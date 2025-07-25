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

  useEffect(() => {
    fetch('http://localhost:5050/api/insights')
      .then(res => res.json())
      .then(data => setInsights(data));
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
      // PUT request to update
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
      // POST request to add
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



  return (
    <div style={{ padding: '2rem' }}>
      <h1>InsightSync</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br />
        <input name="source" placeholder="Source URL" value={form.source} onChange={handleChange} required /><br />
        <textarea name="takeaway" placeholder="Takeaway" value={form.takeaway} onChange={handleChange} required /><br />
        <input name="tags" placeholder="Comma-separated tags" value={form.tags} onChange={handleChange} /><br />
        <button type="submit">
          {isEditing ? 'Update Insight' : 'Add Insight'}
        </button>
      </form>


      <div>
        {insights.map(insight => (
          <div key={insight._id} style={{ marginBottom: '1rem' }}>
            <h3>{insight.title}</h3>
            <p>{insight.takeaway}</p>
            <a href={insight.source} target="_blank" rel="noopener noreferrer">Read More</a>
            <p>Tags: {insight.tags.join(', ')}</p>

            {/* 🔧 Edit Button */}
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

            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
