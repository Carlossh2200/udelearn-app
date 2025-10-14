// src/components/HeroPage.jsx
import React, { useState, useEffect } from 'react'

export default function HeroPage({
    bgUrl = '/assets/bg.jpg',
    bg2Url = '/assets/bg2.jpg',
    logoUrl = '/assets/logo.png'
}) {
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            margin: 0,
            padding: 0
        }}>
            {/* Fondo inicial */}
            <img
                src={bgUrl}
                alt="Fondo UdeLearn"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
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
                alt="Fondo UdeLearn 2"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 2,
                    transition: 'opacity 1.5s ease-in-out',
                    opacity: isActive ? 1 : 0
                }}
                draggable={false}
            />
            
            {/* Logo con animación sincronizada */}
            <div style={{
                position: 'absolute',
                top: isActive ? '-30px' : '50%',
                left: '50%',
                transform: isActive 
                    ? 'translateX(-50%) scale(0.6)' // 556/800 = 0.695
                    : 'translate(-50%, -50%) scale(1)',
                transition: 'all 1.5s ease-in-out',
                zIndex: 3
            }}>
                <img
                    src={logoUrl}
                    alt="Logo UdeLearn"
                    style={{
                        width: '800px', // Tamaño fijo inicial
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                        display: 'block'
                    }}
                    draggable={false}
                />
            </div>
        </div>
    )
}