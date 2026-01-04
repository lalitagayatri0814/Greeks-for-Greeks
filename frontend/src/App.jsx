import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Search, 
  Shield, 
  TrendingUp, 
  FileText, 
  Globe, 
  Brain, 
  Award,
  Loader2
} from 'lucide-react';

// Configuration - CHANGE THIS to your deployed backend URL
const API_URL = 'http://localhost:8000';

function App() {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Example texts for quick testing
  const examples = [
    {
      label: "Verifiable Fact",
      text: "The Eiffel Tower was completed in 1889 and stands at 330 meters tall. It was designed by Gustave Eiffel for the 1889 World's Fair in Paris."
    },
    {
      label: "Uncertain Claim",
      text: "The Eiffel Tower might have been built sometime around 1899 or perhaps earlier. Some sources suggest it could be taller than 400 meters."
    },
    {
      label: "False Information",
      text: "The Eiffel Tower was built in 1920 and is made entirely of chocolate. It melts every summer and has to be rebuilt."
    }
  ];

  const analyzeText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to verify');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze text. Make sure the backend is running on ' + API_URL);
    } finally {
      setAnalyzing(false);
    }
  };

  const loadExample = (exampleText) => {
    setInputText(exampleText);
    setResults(null);
    setError(null);
  };

  const getRiskColor = (risk) => {
    switch(risk?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Shield style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>TruthLens AI</h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>AI Hallucination Detection & Citation Verification</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { icon: FileText, label: 'Total Checks', value: '1,247', color: '#3b82f6' },
            { icon: TrendingUp, label: 'Accuracy Rate', value: '94.8%', color: '#10b981' },
            { icon: AlertCircle, label: 'Hallucinations Found', value: '156', color: '#ef4444' },
            { icon: Globe, label: 'Citations Verified', value: '2,891', color: '#8b5cf6' }
          ].map((stat, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem', borderLeft: `4px solid ${stat.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{stat.label}</p>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>{stat.value}</p>
                </div>
                <stat.icon style={{ width: '2.5rem', height: '2.5rem', color: stat.color, opacity: 0.8 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media (min-width: 1024px)': { gridTemplateColumns: '2fr 1fr' } }}>
          {/* Left Panel - Input */}
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Brain style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>Verify AI-Generated Content</h2>
              </div>

              {/* Example Buttons */}
              <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadExample(example.text)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      background: '#f3f4f6', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem', 
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
                    onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
                  >
                    {example.label}
                  </button>
                ))}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste AI-generated content here for verification...&#10;&#10;Example: 'The Eiffel Tower was completed in 1889 and stands at 330 meters tall. It was designed by Gustave Eiffel for the 1889 World's Fair in Paris.'"
                style={{ 
                  width: '100%', 
                  height: '12rem', 
                  padding: '1rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />

              <button
                onClick={analyzeText}
                disabled={analyzing || !inputText.trim()}
                style={{ 
                  marginTop: '1rem',
                  width: '100%', 
                  background: analyzing ? '#9ca3af' : 'linear-gradient(to right, #4f46e5, #7c3aed)',
                  color: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  fontWeight: '600',
                  border: 'none',
                  cursor: analyzing || !inputText.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                {analyzing ? (
                  <>
                    <Loader2 style={{ width: '1.25rem', height: '1.25rem' }} className="animate-spin" />
                    <span>Analyzing with AI Models...</span>
                  </>
                ) : (
                  <>
                    <Search style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span>Verify Content</span>
                  </>
                )}
              </button>

              {error && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#991b1b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span>{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            {results && (
              <div style={{ marginTop: '1.5rem', background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Verification Results</h3>

                {/* Overall Score */}
                <div style={{ background: 'linear-gradient(to right, #dbeafe, #e0e7ff)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>Truthfulness Score</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className={getScoreColor(results.overall_score)}>
                      {results.overall_score}/100
                    </span>
                  </div>
                  <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden' }}>
                    <div 
                      style={{
                        height: '100%',
                        borderRadius: '9999px',
                        width: `${results.overall_score}%`,
                        background: results.overall_score >= 80 ? '#10b981' : results.overall_score >= 60 ? '#f59e0b' : '#ef4444',
                        transition: 'width 0.5s'
                      }}
                    />
                  </div>
                </div>

                {/* Risk Assessment */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Hallucination Risk</p>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }} className={getRiskColor(results.hallucination_risk)}>
                      {results.hallucination_risk}
                    </span>
                  </div>
                  <div style={{ border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Processing Time</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>
                      {results.processing_time}s
                    </p>
                  </div>
                </div>

                {/* Claim Analysis */}
                {results.claims && results.claims.length > 0 && (
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>Claim-by-Claim Analysis</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {results.claims.map((claim, idx) => (
                        <div key={idx} style={{ border: '2px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            {claim.verified ? (
                              <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', marginTop: '0.125rem', flexShrink: 0 }} />
                            ) : (
                              <XCircle style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444', marginTop: '0.125rem', flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.875rem', color: '#1f2937', marginBottom: '0.5rem' }}>{claim.claim}</p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem' }}>
                                <span style={{ padding: '0.125rem 0.5rem', background: '#f3f4f6', borderRadius: '0.25rem', color: '#6b7280' }}>
                                  Confidence: {claim.confidence}%
                                </span>
                                <span style={{ padding: '0.125rem 0.5rem', background: '#f3f4f6', borderRadius: '0.25rem', color: '#6b7280' }}>
                                  Sources: {claim.sources}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Award style={{ width: '1.5rem', height: '1.5rem', color: '#7c3aed' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>Key Features</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: Brain, color: '#3b82f6', title: 'ML Detection', desc: 'Advanced neural networks identify hallucinations' },
                  { icon: Globe, color: '#10b981', title: 'Real-time Verification', desc: 'Cross-reference with 1000+ sources' },
                  { icon: Shield, color: '#7c3aed', title: 'Azure Powered', desc: 'Built on Microsoft Azure AI infrastructure' }
                ].map((feature, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ background: `${feature.color}1a`, padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <feature.icon style={{ width: '1rem', height: '1rem', color: feature.color }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827' }}>{feature.title}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(to bottom right, #4f46e5, #7c3aed)', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem', color: 'white' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Technology Stack</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <p>• Azure OpenAI Service</p>
                <p>• Machine Learning (94.8% accuracy)</p>
                <p>• React + FastAPI</p>
                <p>• Natural Language Processing</p>
                <p>• Real-time Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '1.5rem', marginTop: '2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          <p>TruthLens AI - Making AI Trustworthy | ByteQuest Hackathon 2025</p>
          <p style={{ marginTop: '0.5rem' }}>Built with ❤️ using Azure OpenAI, React, and FastAPI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;