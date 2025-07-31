import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

export const LoginForm = ({ onSwitchToRegister, onClose }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="form-overlay">
            <div className="form-modal">
                <div className="form-card">
                    <div className="modal-header">
                        <h2 className="form-title">Welcome Back</h2>
                        <button onClick={onClose} className="close-button">✕</button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="form-grid">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email..."
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Enter your password..."
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>

                        <div className="auth-switch">
                            <p>Don't have an account? 
                                <button 
                                    type="button" 
                                    onClick={onSwitchToRegister}
                                    className="switch-button"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const RegisterForm = ({ onSwitchToLogin, onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.displayName
        );
        
        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="form-overlay">
            <div className="form-modal">
                <div className="form-card">
                    <div className="modal-header">
                        <h2 className="form-title">Create Account</h2>
                        <button onClick={onClose} className="close-button">✕</button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="form-grid">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <input
                                name="username"
                                type="text"
                                placeholder="Choose a username..."
                                value={formData.username}
                                onChange={handleChange}
                                className="form-input"
                                required
                                minLength="3"
                                maxLength="30"
                            />
                        </div>

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
                            <label className="input-label">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email..."
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Create a password..."
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password..."
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>

                        <div className="auth-switch">
                            <p>Already have an account? 
                                <button 
                                    type="button" 
                                    onClick={onSwitchToLogin}
                                    className="switch-button"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 