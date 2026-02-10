import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#1a1a2e',
          color: 'white',
          padding: '40px',
          fontFamily: 'monospace'
        }}>
          <h1 style={{ color: '#ff6b6b', fontSize: '36px', marginBottom: '20px' }}>
            ❌ Something went wrong!
          </h1>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#ffd93d', marginBottom: '10px' }}>Error:</h2>
            <pre style={{ 
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              color: '#ff6b6b'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h2 style={{ color: '#ffd93d', marginBottom: '10px' }}>Component Stack:</h2>
            <pre style={{ 
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontSize: '12px',
              color: '#a8dadc'
            }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '30px',
              padding: '15px 30px',
              fontSize: '16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
