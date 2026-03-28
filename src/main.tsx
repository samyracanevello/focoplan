import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useUserStore } from './store/useUserStore'

import { ErrorBoundary } from 'react-error-boundary'
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary'

// Initialize Supabase auth listener
useUserStore.getState().initAuth();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={GlobalErrorBoundary}>
            <App />
        </ErrorBoundary>
    </StrictMode>,
)
