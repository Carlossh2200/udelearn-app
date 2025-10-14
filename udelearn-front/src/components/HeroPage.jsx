// src/components/HeroPage.jsx
import React, { useState, useEffect } from 'react'
import AnimatedLogo from './AnimatedLogo'
import DayModeForm from './DayModeForm'
import NightModeForm from './NightModeForm'

export default function HeroPage() {
    const [mode, setMode] = useState('day')
    const [isActive, setIsActive] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [showFlash, setShowFlash] = useState(false)
    
    const [formData, setFormData] = useState({
        nombre: '', correo: '', carrera: '', archivo: null
    })

    // Animación inicial - Logo empieza en centro, después de 2s sube
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true) // Logo sube
            setTimeout(() => setShowForm(true), 1500) // Formulario aparece
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    const toggleMode = () => {
        setIsActive(false)  // Logo comienza a bajar
        setShowForm(false)

        setTimeout(() => {
            setShowFlash(true)  // Fade comienza - pantalla comienza a oscurecer
        
        // Esperar a que el fade esté al máximo (20% de 1.5s = 0.3s)
            setTimeout(() => {
                setMode(prev => prev === 'day' ? 'night' : 'day')  // Cambio de fondo CUANDO YA ESTÁ OSCURO
            }, 300)  // ← 0.3s después de que comenzó el fade
        
            setTimeout(() => {
                setShowFlash(false)  // Fade termina - pantalla se aclara
            
                setTimeout(() => {
                    setIsActive(true)  // Logo comienza a subir
                    setTimeout(() => setShowForm(true), 1500)  // Formulario aparece
                }, 2000)  // 2s en centro antes de subir
            
            }, 400)  // Duración total del fade: 1.5 segundos
        }, 1500)  // Animación de bajada del logo
    }

    const handleInputChange = (e) => {
        const { name, value, files } = e.target
        setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }))
    }

    const handleSubmit = (e) => {
        e?.preventDefault()
        if (isFormValid) {
            console.log('Datos a enviar:', formData)
            alert('Formulario enviado correctamente!')
        }
    }

    const isFormValid = formData.nombre && formData.correo && formData.carrera && formData.archivo

    // Fondos según el modo
    const bgUrl = mode === 'day' ? '/assets/bg.jpg' : '/assets/bg3.jpg'
    const bg2Url = mode === 'day' ? '/assets/bg2.jpg' : '/assets/bg4.jpg'

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            overflow: 'hidden',
            margin: 0, padding: 0
        }}>
            {/* Fondo inicial */}
            <img
                src={bgUrl}
                alt="Fondo UdeLearn"
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    zIndex: 1,
                    transition: 'opacity 1.5s ease-in-out',
                    opacity: isActive ? 0 : 1
                }}
                draggable={false}
            />
            
            {/* Segundo fondo */}
            <img
                src={bg2Url}
                alt="Fondo UdeLearn"
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    zIndex: 2,
                    transition: 'opacity 1.5s ease-in-out',
                    opacity: isActive ? 1 : 0
                }}
                draggable={false}
            />
            
            {/* Logo animado - SIMPLE */}
            <AnimatedLogo 
                isActive={isActive}
                finalPosition="0px"
            />

            {/* Botón toggle modo */}
            {showForm && (
                <div 
                    onClick={toggleMode}
                    style={{
                        position: 'absolute',
                        top: '20px', right: '20px',
                        cursor: 'pointer',
                        fontSize: '32px',
                        background: 'none', border: 'none',
                        zIndex: 6,
                        filter: mode === 'day' 
                            ? 'invert(54%) sepia(87%) saturate(415%) hue-rotate(343deg) brightness(93%) contrast(91%)'
                            : 'invert(48%) sepia(79%) saturate(1382%) hue-rotate(345deg) brightness(93%) contrast(89%)'
                    }}
                >
                    {mode === 'day' ? '🌙' : '🔆'}
                </div>
            )}

            {/* Formularios */}
            {showForm && mode === 'day' && (
                <DayModeForm 
                    formData={formData}
                    onInputChange={handleInputChange}
                    isFormValid={isFormValid}
                    onSubmit={handleSubmit}
                />
            )}

            {showForm && mode === 'night' && (
                <NightModeForm 
                    formData={formData}
                    onInputChange={handleInputChange}
                    isFormValid={isFormValid}
                    onSubmit={handleSubmit}
                />
            )}

            {/* Flash */}
            {showFlash && (
                <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                background: 'black',
                zIndex: 10,
                opacity: 0,
                animation: 'fadeTransition 0.4s ease-in-out'  
            }} />
)}
        </div>
    )
}