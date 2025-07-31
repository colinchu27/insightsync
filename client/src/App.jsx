import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginForm, RegisterForm } from './components/AuthForms';
import { UserProfile } from './components/UserProfile';
import './App.css';

function App() {
  const { user, token, isAuthenticated } = useAuth();
  const [insights, setInsights] = useState([]);
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    source: '', 
    takeaway: '', 
    tags: '', 
    visibility: 'public',
    collectionId: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchInsights();
    if (isAuthenticated) {
      fetchCollections();
    }
  }, [token, isAuthenticated]);

  const fetchInsights = async () => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5050/api/insights', {
        headers
      });
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/collections/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title || !form.takeaway) return;

    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuth(true);
      return;
    }

    const payload = { ...form, tags: form.tags.split(',').map(tag => tag.trim()) };

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      if (isEditing && editId) {
        const res = await fetch(`http://localhost:5050/api/insights/${editId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
        const updatedInsight = await res.json();
        setInsights(insights.map(insight => insight._id === editId ? updatedInsight : insight));
        setIsEditing(false);
        setEditId(null);
      } else {
        const res = await fetch('http://localhost:5050/api/insights', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        const newInsight = await res.json();
        setInsights([newInsight, ...insights]);
        
        // If a collection was selected, add the insight to it
        if (form.collectionId) {
          await addInsightToCollection(newInsight._id, form.collectionId);
        }
      }
      setForm({ title: '', source: '', takeaway: '', tags: '', visibility: 'public', collectionId: '' });
    } catch (error) {
      console.error('Error saving insight:', error);
    }
  };

  const addInsightToCollection = async (insightId, collectionId) => {
    try {
      const response = await fetch(`http://localhost:5050/api/collections/${collectionId}/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ insightId })
      });
      
      if (response.ok) {
        console.log('Insight added to collection successfully');
      }
    } catch (error) {
      console.error('Error adding insight to collection:', error);
    }
  };

  const handleAddToCollection = async (insightId) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuth(true);
      return;
    }

    const collectionId = prompt('Enter collection ID to add this insight to:');
    if (collectionId) {
      await addInsightToCollection(insightId, collectionId);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this insight?')) return;

    try {
      const response = await fetch(`http://localhost:5050/api/insights/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setInsights(insights.filter(insight => insight._id !== id));
      }
    } catch (error) {
      console.error('Error deleting insight:', error);
    }
  };

  const handleEdit = (insight) => {
    if (!isAuthenticated || insight.user._id !== user._id) {
      alert('You can only edit your own insights');
      return;
    }
    setForm({
      title: insight.title,
      source: insight.source,
      takeaway: insight.takeaway,
      tags: insight.tags.join(', '),
      visibility: insight.visibility,
      collectionId: ''
    });
    setIsEditing(true);
    setEditId(insight._id);
  };

  const handleAuthClose = () => {
    setShowAuth(false);
    setAuthMode('login');
  };

  const switchToRegister = () => setAuthMode('register');
  const switchToLogin = () => setAuthMode('login');

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.takeaway.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !tagFilter || insight.tags.some(tag => 
      tag.toLowerCase().includes(tagFilter.toLowerCase())
    );
    return matchesSearch && matchesTag;
  });

  const sortedInsights = [...filteredInsights].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      return sortOrder === 'desc' ? new Date(bValue) - new Date(aValue) : new Date(aValue) - new Date(bValue);
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
    }
    
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const allTags = [...new Set(insights.flatMap(insight => insight.tags))];

  return (
    <div className="app-container">
      <div className="background-pattern"></div>
      <div className="content">
        {/* Header */}
        <header className="app-header">
          <div className="app-icon">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="app-title">InsightSync</h1>
          <p className="app-subtitle">
            Capture, organize, and discover your most valuable insights in one beautiful place
          </p>
          
          <div className="header-actions">
            {isAuthenticated ? (
              <div className="user-actions">
                <div className="user-info">
                  <span className="user-name">Welcome, {user?.displayName}</span>
                  <button 
                    onClick={() => setShowProfile(true)}
                    className="profile-button"
                  >
                    👤 Profile
                  </button>
                </div>
                <Link to="/collections" className="public-link-button">
                  View Collections →
                </Link>
              </div>
            ) : (
              <div className="auth-actions">
                <button 
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuth(true);
                  }}
                  className="auth-button login"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuth(true);
                  }}
                  className="auth-button register"
                >
                  Sign Up
                </button>
                <Link to="/collections" className="public-link-button">
                  Browse Collections →
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Form */}
        <section className="form-section">
          <div className="form-card">
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Title *</label>
                <input
                  name="title"
                  placeholder="Enter insight title..."
                  value={form.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Source URL</label>
                <input
                  name="source"
                  placeholder="https://example.com (optional)"
                  value={form.source}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Key Takeaway *</label>
                <textarea
                  name="takeaway"
                  placeholder="What's the main insight or lesson learned?"
                  value={form.takeaway}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Tags</label>
                <input
                  name="tags"
                  placeholder="productivity, learning, tech..."
                  value={form.tags}
                  onChange={handleChange}
                  className="form-input"
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
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>

              {isAuthenticated && collections.length > 0 && (
                <div className="input-group">
                  <label className="input-label">Add to Collection (Optional)</label>
                  <select
                    name="collectionId"
                    value={form.collectionId}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select a collection...</option>
                    {collections.map(collection => (
                      <option key={collection._id} value={collection._id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button onClick={handleSubmit} className="submit-button">
                  {isEditing ? '✨ Update Insight' : '+ Add New Insight'}
                </button>
                {isEditing && (
                  <button onClick={() => {
                    setIsEditing(false);
                    setEditId(null);
                    setForm({ title: '', source: '', takeaway: '', tags: '', visibility: 'public', collectionId: '' });
                  }} className="cancel-button">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="filters-section">
          <div className="filters-card">
            <div className="filters-grid">
              <div className="search-inputs">
                <div className="search-container">
                  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    placeholder="Search insights..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="search-container">
                  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <input
                    placeholder="Filter by tag..."
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filter-controls">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="sort-select"
                >
                  <option value="createdAt">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="sort-button"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <svg className={`sort-icon ${sortOrder === 'desc' ? 'rotated' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 8V8m0 8l4-4m-4 4l-4-4" />
                  </svg>
                </button>

                <button
                  onClick={() => { setSearchTerm(''); setTagFilter(''); }}
                  className="clear-button"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Insights Grid */}
        <section className="insights-section">
          {sortedInsights.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="empty-title">No insights found</h3>
              <p className="empty-text">Start capturing your valuable insights above</p>
            </div>
          ) : (
            <div className="insights-grid">
              {sortedInsights.map((insight) => (
                <div key={insight._id} className="insight-card">
                  <div className="insight-content">
                    <div className="insight-header">
                      <h3 className="insight-title">{insight.title}</h3>
                      <div className="insight-meta">
                        <span className={`visibility-badge ${insight.visibility}`}>
                          {insight.visibility === 'public' ? '🌍 Public' : '🔒 Private'}
                        </span>
                        {insight.user && (
                          <span className="author-badge">
                            by {insight.user.displayName}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="insight-text">{insight.takeaway}</p>

                    {insight.source && (
                      <a
                        href={insight.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="insight-link"
                      >
                        <svg className="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Source
                      </a>
                    )}

                    {insight.tags && insight.tags.length > 0 && (
                      <div className="tags-container">
                        {insight.tags.map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => setTagFilter(tag)}
                            className="tag-button"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {isAuthenticated && (
                      <div className="insight-collection-actions">
                        <button
                          onClick={() => handleAddToCollection(insight._id)}
                          className="add-to-collection-button"
                          title="Add this insight to a collection"
                        >
                          📚 Add to Collection
                        </button>
                      </div>
                    )}

                    {isAuthenticated && insight.user?._id === user?._id && (
                      <div className="insight-actions">
                        <button
                          onClick={() => handleEdit(insight)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(insight._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Authentication Modals */}
      {showAuth && (
        authMode === 'login' ? (
          <LoginForm 
            onSwitchToRegister={switchToRegister}
            onClose={handleAuthClose}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={switchToLogin}
            onClose={handleAuthClose}
          />
        )
      )}

      {/* Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

export default App;