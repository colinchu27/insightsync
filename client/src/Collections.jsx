import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import CollectionForm from './CollectionForm';
import InsightManager from './InsightManager';
import './App.css';

function Collections() {
    const { user, token, isAuthenticated } = useAuth();
    const [collections, setCollections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [managingCollection, setManagingCollection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('all'); // 'all', 'my', 'public'

    useEffect(() => {
        fetchCollections();
    }, [token, viewMode]);

    const fetchCollections = async () => {
        try {
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            let endpoint = '/api/collections';
            if (viewMode === 'my' && isAuthenticated) {
                endpoint = '/api/collections/my';
            } else if (viewMode === 'public') {
                endpoint = '/api/collections/public';
            }

            const response = await fetch(`http://localhost:5050${endpoint}`, {
                headers
            });
            const data = await response.json();
            setCollections(data);
        } catch (err) {
            console.error('Error fetching collections:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCollection = () => {
        if (!isAuthenticated) {
            alert('Please sign in to create collections');
            return;
        }
        setEditingCollection(null);
        setShowForm(true);
    };

    const handleEditCollection = (collection) => {
        if (!isAuthenticated || collection.user._id !== user._id) {
            alert('You can only edit your own collections');
            return;
        }
        setEditingCollection(collection);
        setShowForm(true);
    };

    const handleDeleteCollection = async (collectionId) => {
        if (!window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5050/api/collections/${collectionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCollections(collections.filter(c => c._id !== collectionId));
            }
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    const handleSaveCollection = (savedCollection) => {
        if (editingCollection) {
            setCollections(collections.map(c => 
                c._id === savedCollection._id ? savedCollection : c
            ));
        } else {
            setCollections([savedCollection, ...collections]);
        }
        setShowForm(false);
        setEditingCollection(null);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingCollection(null);
    };

    const handleManageInsights = (collection) => {
        if (!isAuthenticated || collection.user._id !== user._id) {
            alert('You can only manage insights in your own collections');
            return;
        }
        setManagingCollection(collection);
    };

    const handleUpdateCollection = (updatedCollection) => {
        setCollections(collections.map(c => 
            c._id === updatedCollection._id ? updatedCollection : c
        ));
        setManagingCollection(updatedCollection);
    };

    const handleCloseInsightManager = () => {
        setManagingCollection(null);
    };

    const canEditCollection = (collection) => {
        return isAuthenticated && collection.user._id === user._id;
    };

    if (isLoading) {
        return (
            <div className="app-container">
                <div className="background-pattern"></div>
                <div className="content">
                    <div className="loading">Loading collections...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="background-pattern"></div>
            <div className="content">
                <header className="app-header">
                    <div className="app-icon">
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h1 className="app-title">Collections</h1>
                    <p className="app-subtitle">Discover and organize insights with curated collections</p>
                    
                    <div className="header-actions">
                        <div className="view-controls">
                            <button 
                                onClick={() => setViewMode('all')}
                                className={`view-button ${viewMode === 'all' ? 'active' : ''}`}
                            >
                                All Collections
                            </button>
                            {isAuthenticated && (
                                <button 
                                    onClick={() => setViewMode('my')}
                                    className={`view-button ${viewMode === 'my' ? 'active' : ''}`}
                                >
                                    My Collections
                                </button>
                            )}
                            <button 
                                onClick={() => setViewMode('public')}
                                className={`view-button ${viewMode === 'public' ? 'active' : ''}`}
                            >
                                Public Only
                            </button>
                        </div>
                        
                        {isAuthenticated && (
                            <button onClick={handleCreateCollection} className="create-collection-button">
                                + Create New Collection
                            </button>
                        )}
                        
                        <Link to="/" className="back-to-insights-button">
                            ← Back to Insights
                        </Link>
                    </div>
                </header>

                <section className="collections-section">
                    {collections.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="empty-title">
                                {viewMode === 'my' ? 'No collections yet' : 'No collections found'}
                            </h3>
                            <p className="empty-text">
                                {viewMode === 'my' 
                                    ? 'Create your first collection to start organizing insights'
                                    : 'Check back later for shared collections'
                                }
                            </p>
                            {viewMode === 'my' && isAuthenticated && (
                                <button onClick={handleCreateCollection} className="create-collection-button">
                                    Create Your First Collection
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="collections-grid">
                            {collections.map((collection) => (
                                <div key={collection._id} className="collection-card">
                                    <div className="collection-header">
                                        <div className="collection-info">
                                            <h3 className="collection-title">{collection.name}</h3>
                                            <div className="collection-meta">
                                                <span className={`visibility-badge ${collection.visibility}`}>
                                                    {collection.visibility === 'public' ? '🌍 Public' : '🔒 Private'}
                                                </span>
                                                <span className="author-badge">
                                                    by {collection.user.displayName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="collection-description">
                                        {collection.description || 'No description provided'}
                                    </p>

                                    <div className="collection-stats">
                                        <span className="stat">
                                            📊 {collection.insights?.length || 0} insights
                                        </span>
                                        <span className="stat">
                                            📅 {new Date(collection.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {collection.insights && collection.insights.length > 0 && (
                                        <div className="collection-insights-preview">
                                            <h4>Recent Insights:</h4>
                                            <div className="insights-preview-grid">
                                                {collection.insights.slice(0, 3).map((insight) => (
                                                    <div key={insight._id} className="insight-preview">
                                                        <h5>{insight.title}</h5>
                                                        <p>{insight.takeaway.substring(0, 100)}...</p>
                                                    </div>
                                                ))}
                                                {collection.insights.length > 3 && (
                                                    <div className="more-insights">
                                                        +{collection.insights.length - 3} more insights
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {canEditCollection(collection) && (
                                        <div className="collection-actions">
                                            <button
                                                onClick={() => handleManageInsights(collection)}
                                                className="action-button primary"
                                                title="Add or remove insights from this collection"
                                            >
                                                📚 Add/Remove Insights
                                            </button>
                                            <div className="secondary-actions">
                                                <button
                                                    onClick={() => handleEditCollection(collection)}
                                                    className="action-button secondary"
                                                    title="Edit collection details"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCollection(collection._id)}
                                                    className="action-button danger"
                                                    title="Delete this collection"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Collection Form Modal */}
            {showForm && (
                <div className="form-overlay">
                    <div className="form-modal">
                        <CollectionForm
                            collection={editingCollection}
                            onSave={handleSaveCollection}
                            onCancel={handleCancelForm}
                        />
                    </div>
                </div>
            )}

            {/* Insight Manager Modal */}
            {managingCollection && (
                <div className="form-overlay">
                    <div className="form-modal large">
                        <div className="modal-header">
                            <h2>Manage Insights: {managingCollection.name}</h2>
                            <button onClick={handleCloseInsightManager} className="close-button">
                                ✕
                            </button>
                        </div>
                        <InsightManager
                            collection={managingCollection}
                            onUpdate={handleUpdateCollection}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Collections;
