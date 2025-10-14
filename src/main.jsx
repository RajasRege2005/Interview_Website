import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  // StrictMode disabled to prevent double timer intervals in InterviewSession
  // <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  // </StrictMode>,
)
