import './assets/styles/index.css'
import './assets/styles/main.css'
import 'react/jsx-runtime'
import Layout from '@/components/Layout'
import { Loading } from '@/components/Form'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from "@/components/theme-provider"
import { StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import routes from '~react-pages'

import press from "virtual:press"
import { PressContext } from './contexts'
import { useApp } from "@/gateway";

// initialize your API layer
useApp().load()

// create the client once
const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<Layout><Loading className='p-4' /></Layout>}>
                <ThemeProvider defaultTheme="light" storageKey="color-scheme">
                    <PressContext.Provider value={press}>
                        {useRoutes(routes)}
                    </PressContext.Provider>
                </ThemeProvider>
            </Suspense>
        </QueryClientProvider>
    )
}

function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => window.scrollTo(0, 0), [pathname])
    return null
}

const app = createRoot(document.getElementById('root')!)
app.render(
    <StrictMode>
        <Router>
            <ScrollToTop />
            <App />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </Router>
    </StrictMode>,
)
