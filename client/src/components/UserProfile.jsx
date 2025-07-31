import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

export const UserProfile = ({ onClose }) => {
    const { user, updateProfile, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        bio: user?.bio || ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await updateProfile(formData);
        
        if (result.success) {
            setIsEditing(false);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <div className="form-overlay">
            <div className="form-modal">
                <div className="form-card">
                    <div className="modal-header">
                        <h2 className="form-title">Profile</h2>
                        <button onClick={onClose} className="close-button">✕</button>
                    </div>
                    
                    {!isEditing ? (
                        <div className="profile-view">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.displayName} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {user?.displayName?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="profile-info">
                                    <h3>{user?.displayName}</h3>
                                    <p className="username">@{user?.username}</p>
                                    {user?.bio && <p className="bio">{user.bio}</p>}
                                </div>
                            </div>

                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Member since</span>
                                    <span className="stat-value">
                                        {new Date(user?.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="edit-profile-button"
                                >
                                    Edit Profile
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="logout-button"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="form-grid">
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Display Name</label>
                                <input
                                    name="displayName"
                                    type="text"
                                    placeholder="Your display name..."
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                    maxLength="50"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Bio</label>
                                <textarea
                                    name="bio"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows="3"
                                    maxLength="500"
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}; 