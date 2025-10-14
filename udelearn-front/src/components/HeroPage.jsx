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
        // Paso 1: Logo vuelve al centro y oculta formulario
        setIsActive(false)
        setShowForm(false)

        // Paso 2: Después de 1.5s (cuando logo ya está en centro), flash
        setTimeout(() => {
            setShowFlash(true)
            
            // Paso 3: Flash rápido y cambio de modo
            setTimeout(() => {
                setMode(prev => prev === 'day' ? 'night' : 'day')
                setShowFlash(false)
                
                // Paso 4: Después de 2s, logo sube y muestra formulario
                setTimeout(() => {
                    setIsActive(true)
                    setTimeout(() => setShowForm(true), 1500)
                }, 2000)
                
            }, 200) // Flash rápido
        }, 1500) // Tiempo que tarda el logo en volver al centro
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
                            : 'brightness(0) invert(1)'
                    }}
                >
                    {mode === 'day' ? '🌙' : '☀️'}
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
                    background: 'white',
                    zIndex: 10,
                    opacity: 0,
                    animation: 'flash 0.2s ease-out'
                }} />
            )}
        </div>
    )
}