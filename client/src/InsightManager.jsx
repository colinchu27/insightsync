import { useState, useEffect } from 'react';
import './App.css';

function InsightManager({ collection, onUpdate }) {
    const [availableInsights, setAvailableInsights] = useState([]);
    const [selectedInsight, setSelectedInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAvailableInsights();
    }, []);

    const fetchAvailableInsights = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/insights');
            const insights = await response.json();
            setAvailableInsights(insights);
        } catch (error) {
            console.error('Error fetching insights:', error);
        }
    };

    const addInsightToCollection = async () => {
        if (!selectedInsight) return;

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5050/api/collections/${collection._id}/insights`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ insightId: selectedInsight })
            });

            if (response.ok) {
                const updatedCollection = await response.json();
                onUpdate(updatedCollection);
                setSelectedInsight('');
            }
        } catch (error) {
            console.error('Error adding insight to collection:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeInsightFromCollection = async (insightId) => {
        if (!window.confirm('Are you sure you want to remove this insight from the collection?')) return;

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5050/api/collections/${collection._id}/insights/${insightId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const updatedCollection = await response.json();
                onUpdate(updatedCollection);
            }
        } catch (error) {
            console.error('Error removing insight from collection:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const collectionInsightIds = collection.insights?.map(insight => insight._id) || [];
    const filteredInsights = availableInsights.filter(insight => !collectionInsightIds.includes(insight._id));

    return (
        <div className="insight-manager">
            <div className="insight-manager-header">
                <h3>Manage Insights in Collection</h3>
                <div className="add-insight-form">
                    <select
                        value={selectedInsight}
                        onChange={(e) => setSelectedInsight(e.target.value)}
                        className="form-input"
                        disabled={isLoading}
                    >
                        <option value="">Select an insight to add...</option>
                        {filteredInsights.map(insight => (
                            <option key={insight._id} value={insight._id}>
                                {insight.title}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={addInsightToCollection}
                        disabled={!selectedInsight || isLoading}
                        className="add-button"
                    >
                        {isLoading ? 'Adding...' : 'Add to Collection'}
                    </button>
                </div>
            </div>

            <div className="collection-insights">
                <h4>Insights in this Collection ({collection.insights?.length || 0})</h4>
                {collection.insights?.length === 0 ? (
                    <p className="empty-text">No insights in this collection yet.</p>
                ) : (
                    <div className="insights-list">
                        {collection.insights?.map(insight => (
                            <div key={insight._id} className="insight-item">
                                <div className="insight-item-content">
                                    <h5>{insight.title}</h5>
                                    <p>{insight.takeaway}</p>
                                    {insight.tags && insight.tags.length > 0 && (
                                        <div className="tags-container">
                                            {insight.tags.map((tag, idx) => (
                                                <span key={idx} className="tag-button small">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeInsightFromCollection(insight._id)}
                                    disabled={isLoading}
                                    className="remove-button"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InsightManager; 