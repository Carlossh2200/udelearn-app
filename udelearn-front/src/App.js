// src/App.jsx
import React, { useState, useEffect } from 'react'
import Login from './components/login'
import Register from './components/Register'
import HeroPage from './components/HeroPage'

export default function App() {
    const [currentPage, setCurrentPage] = useState('login') // 'login' | 'register' | 'dashboard'
    
    useEffect(() => {
        const handlePaste = (e) => {
            e.preventDefault()
        }

        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault()
            }
            if (e.shiftKey && e.key === 'Insert') {
                e.preventDefault()
            }
        }

        document.addEventListener('paste', handlePaste)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('paste', handlePaste)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const navigateTo = (page) => {
        setCurrentPage(page)
    }

    // Función para cerrar sesión
    const handleLogout = () => {
        setCurrentPage('login')
    }

    const renderCurrentPage = () => {
        switch(currentPage) {
            case 'login':
                return <Login onNavigate={navigateTo} />
            case 'register':
                return <Register onNavigate={navigateTo} />
            case 'dashboard':
                return <HeroPage onLogout={handleLogout} />
            default:
                return <Login onNavigate={navigateTo} />
        }
    }

    return (
        <div>
            {renderCurrentPage()}
        </div>
    )
}