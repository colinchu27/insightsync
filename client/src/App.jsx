import { useEffect, useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  const [insights, setInsights] = useState([]);
  const [form, setForm] = useState({ title: '', source: '', takeaway: '', tags: '', visibility: 'public' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetch('http://localhost:5050/api/insights')
      .then(res => res.json())
      .then(data => setInsights(data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title || !form.takeaway) return;

    const payload = { ...form, tags: form.tags.split(',').map(tag => tag.trim()) };

    if (isEditing && editId) {
      const res = await fetch(`http://localhost:5050/api/insights/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const updatedInsight = await res.json();
      setInsights(insights.map(insight => insight._id === editId ? updatedInsight : insight));
      setIsEditing(false); setEditId(null);
    } else {
      const res = await fetch('http://localhost:5050/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const newInsight = await res.json();
      setInsights([...insights, newInsight]);
    }
    setForm({ title: '', source: '', takeaway: '', tags: '', visibility: 'public' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this insight?')) return;
    await fetch(`http://localhost:5050/api/insights/${id}`, { method: 'DELETE' });
    setInsights(insights.filter(insight => insight._id !== id));
  };

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) || insight.takeaway.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = tagFilter === '' || insight.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
    return matchesSearch && matchesTag;
  });

  const sortedInsights = [...filteredInsights].sort((a, b) => {
    let fieldA = sortField === 'title' ? a.title.toLowerCase() : new Date(a.createdAt);
    let fieldB = sortField === 'title' ? b.title.toLowerCase() : new Date(b.createdAt);
    return sortOrder === 'asc' ? fieldA > fieldB ? 1 : -1 : fieldA < fieldB ? 1 : -1;
  });

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
          <div className="view-collections-link">
            <Link to="/collections" className="public-link-button">
              View Collections →
            </Link>
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

              <button onClick={handleSubmit} className="submit-button">
                {isEditing ? '✨ Update Insight' : '+ Add New Insight'}
              </button>
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
                    <h3 className="insight-title">{insight.title}</h3>
                    <p className="text-sm italic mb-1" style={{ color: 'white' }}>
                      {insight.visibility === 'public' ? '🌍 Public' : '🔒 Private'}
                    </p>




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

                    <div className="insight-actions">
                      <button
                        onClick={() => {
                          setForm({
                            title: insight.title,
                            source: insight.source || '',
                            takeaway: insight.takeaway,
                            tags: insight.tags ? insight.tags.join(', ') : ''
                          });
                          setIsEditing(true);
                          setEditId(insight._id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;