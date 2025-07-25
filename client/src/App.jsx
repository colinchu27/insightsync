import { useEffect, useState } from 'react';

function App() {
  const [insights, setInsights] = useState([]);
  const [form, setForm] = useState({
    title: '',
    source: '',
    takeaway: '',
    tags: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetch('http://localhost:5050/api/insights')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched insights:", data);
        setInsights(data);
      });
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tags: form.tags.split(',').map(tag => tag.trim())
    };

    if (isEditing && editId) {
      const res = await fetch(`http://localhost:5050/api/insights/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const updatedInsight = await res.json();

      setInsights(insights.map(insight =>
        insight._id === editId ? updatedInsight : insight
      ));

      setIsEditing(false);
      setEditId(null);
    } else {
      const res = await fetch('http://localhost:5050/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const newInsight = await res.json();
      setInsights([...insights, newInsight]);
    }

    setForm({ title: '', source: '', takeaway: '', tags: '' });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this insight?');
    if (!confirmDelete) return;

    await fetch(`http://localhost:5050/api/insights/${id}`, {
      method: 'DELETE'
    });

    setInsights(insights.filter(insight => insight._id !== id));
  };

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.takeaway.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = tagFilter === '' || insight.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
    return matchesSearch && matchesTag;
  });

  const sortedInsights = [...filteredInsights].sort((a, b) => {
    let fieldA = sortField === 'title' ? a.title.toLowerCase() : new Date(a.createdAt);
    let fieldB = sortField === 'title' ? b.title.toLowerCase() : new Date(b.createdAt);

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>InsightSync</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br />
        <input name="source" placeholder="Source URL" value={form.source} onChange={handleChange} /><br />
        <textarea name="takeaway" placeholder="Takeaway" value={form.takeaway} onChange={handleChange} required /><br />
        <input name="tags" placeholder="Comma-separated tags" value={form.tags} onChange={handleChange} /><br />
        <button type="submit">
          {isEditing ? 'Update Insight' : 'Add Insight'}
        </button>
      </form>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          placeholder="Search insights..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <input
          placeholder="Filter by tag..."
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        <button
          onClick={() => {
            setSearchTerm('');
            setTagFilter('');
          }}
          style={{ marginLeft: '1rem' }}
        >
          Clear Filters
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label>Sort By: </label>
        <select value={sortField} onChange={(e) => setSortField(e.target.value)} style={{ marginRight: '1rem' }}>
          <option value="createdAt">Date</option>
          <option value="title">Title</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div>
        {sortedInsights.map(insight => (
          <div key={insight._id} style={{ marginBottom: '1rem' }}>
            <h3>{insight.title}</h3>
            <p>{insight.takeaway}</p>

            {insight.source && (
              <p>
                Source:{' '}
                <a href={insight.source} target="_blank" rel="noopener noreferrer">
                  {insight.source}
                </a>
              </p>
            )}

            <p>
              Tags:{' '}
              {insight.tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setTagFilter(tag)}
                  style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                >
                  {tag}
                </button>
              ))}
            </p>

            <button onClick={() => {
              setForm({
                title: insight.title,
                source: insight.source,
                takeaway: insight.takeaway,
                tags: insight.tags.join(', ')
              });
              setIsEditing(true);
              setEditId(insight._id);
            }}>
              Edit
            </button>

            <button onClick={() => handleDelete(insight._id)} style={{ marginLeft: '1rem' }}>
              Delete
            </button>

            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
