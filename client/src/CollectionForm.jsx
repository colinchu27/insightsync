import { useState, useEffect } from 'react';
import './App.css';

function CollectionForm({ collection, onSave, onCancel }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        visibility: 'public'
    });

    useEffect(() => {
        if (collection) {
            setForm({
                name: collection.name || '',
                description: collection.description || '',
                visibility: collection.visibility || 'public'
            });
        }
    }, [collection]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        try {
            const url = collection 
                ? `http://localhost:5050/api/collections/${collection._id}`
                : 'http://localhost:5050/api/collections';
            
            const method = collection ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                const savedCollection = await response.json();
                onSave(savedCollection);
            } else {
                console.error('Failed to save collection');
            }
        } catch (error) {
            console.error('Error saving collection:', error);
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-modal">
                <div className="form-card">
                    <h2 className="form-title">
                        {collection ? 'Edit Collection' : 'Create New Collection'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="input-group">
                            <label className="input-label">Collection Name *</label>
                            <input
                                name="name"
                                placeholder="Enter collection name..."
                                value={form.name}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe what this collection is about..."
                                value={form.description}
                                onChange={handleChange}
                                className="form-textarea"
                                rows="3"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Visibility</label>
                            <select
                                name="visibility"
                                value={form.visibility}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-button">
                                {collection ? '✨ Update Collection' : '+ Create Collection'}
                            </button>
                            <button 
                                type="button" 
                                onClick={onCancel}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CollectionForm; 