import { useEffect, useState } from 'react';
import './App.css';

function Collections() {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5050/api/collections/public')
            .then(res => res.json())
            .then(data => setCollections(data))
            .catch(err => console.error(err));
    }, []);


    return (
        <div className="app-container">
            <div className="background-pattern"></div>
            <div className="content">
                <header className="app-header">
                    <div className="app-icon">
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h1 className="app-title">Public Collections</h1>
                    <p className="app-subtitle">Browse shared insights curated by the community</p>
                </header>

                <section className="insights-section">
                    {collections.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="empty-title">No collections found</h3>
                            <p className="empty-text">Check back later for shared collections</p>
                        </div>
                    ) : (
                        <div className="insights-grid">
                            {collections.map((collection) => (
                                <div key={collection._id} className="insight-card">
                                    <div className="insight-content">
                                        <h3 className="insight-title">{collection.name}</h3>
                                        <p className="insight-text">{collection.description}</p>

                                        {collection.insights?.length > 0 && (
                                            <div className="tags-container">
                                                {collection.insights.map((insight, idx) => (
                                                    <span key={idx} className="tag-button">
                                                        {insight.title}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
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

export default Collections;
