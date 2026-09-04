import React, { useState } from 'react';

export default function NameMarriagePredictor() {
    const [name, setName] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const calculateAge = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Adjust port if your backend runs on a different one, or use relative path if proxied
            const response = await fetch(`/api/prediction/name-predictions?name=${encodeURIComponent(name)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.error || 'Failed to calculate');
            }

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '20px auto',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h2 style={{
                color: '#881337',
                marginTop: 0,
                marginBottom: '8px',
                fontSize: '24px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                💍 Garga Name Predictor
            </h2>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '24px' }}>
                Discover your Nakshatra, Rashi, marriage, and finance predictions based on your Name Akshar (Avakahada Chakra).
            </p>

            <form onSubmit={calculateAge} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                        Enter your First Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Rahul"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #fecdd3',
                            fontSize: '18px',
                            color: 'rgba(8, 2, 36, 1)',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s'
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    style={{
                        backgroundColor: '#be123c',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                        opacity: loading || !name.trim() ? 0.7 : 1,
                        transition: 'background-color 0.2s'
                    }}
                >
                    {loading ? 'Calculating...' : 'Get Predictions'}
                </button>
            </form>

            {error && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {result && (
                <div style={{
                    marginTop: '24px',
                    padding: '20px',
                    backgroundColor: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '12px',
                    animation: 'fadeIn 0.5s ease-out',
                    maxHeight: '500px',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#881337', fontSize: '18px' }}>
                        Prediction for {result.name}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#000000ff', textTransform: 'uppercase', letterSpacing: '1px' }}>Name Akshar</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{result.akshar}</div>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'rgba(1, 2, 3, 1)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rashi (Moon Sign)</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>{result.rashi}</div>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', gridColumn: 'span 2' }}>
                            <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 1)', textTransform: 'uppercase', letterSpacing: '1px' }}>Nakshatra</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>{result.nakshatra}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#be123c', borderBottom: '1px solid #fecdd3', paddingBottom: '8px' }}>Life Areas</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '18px' }}>
                                {Object.entries(result.details || {}).filter(([k]) => k !== 'qna').map(([key, val]) => (
                                    <div key={key} style={{ paddingBottom: '4px' }}>
                                        <span style={{ fontWeight: '600', color: '#000000ff', textTransform: 'capitalize' }}>
                                            {key.replace(/_/g, ' ')}:
                                        </span>{' '}
                                        <span style={{ color: 'rgba(3, 2, 34, 1)' }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#be123c', borderBottom: '1px solid #fecdd3', paddingBottom: '8px' }}>Specific Answers</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', fontSize: '18px' }}>
                                {Object.entries(result.details?.qna || {}).map(([key, val]) => (
                                    <div key={key}>
                                        <div style={{ fontWeight: '600', color: '#475569' }}>
                                            When will I {key.replace(/_/g, ' ')}?
                                        </div>
                                        <div style={{ color: '#15803d', marginTop: '4px', fontWeight: '500' }}>→ {val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 1)', marginTop: '4px', fontStyle: 'italic', textAlign: 'right' }}>
                            Method: {result.method}
                        </div>
                    </div>

                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
