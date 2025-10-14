// src/components/AnimatedLogo.jsx
import React from 'react'

export default function AnimatedLogo({ 
    logoUrl = '/assets/logo.png', 
    isActive, 
    initialSize = '800px', 
    finalSize = '556px',
    finalPosition = '0px' 
}) {
    const scaleFactor = parseInt(finalSize) / parseInt(initialSize)
    
    return (
        <div style={{
            position: 'absolute',
            top: isActive ? finalPosition : '50%',
            left: '50%',
            transform: isActive 
                ? `translateX(-50%) scale(${scaleFactor})`
                : 'translate(-50%, -50%) scale(1)',
            transition: 'all 1.5s ease-in-out',
            zIndex: 3
        }}>
            <img
                src={logoUrl}
                alt="Logo UdeLearn"
                style={{
                    width: initialSize,
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                    display: 'block'
                }}
                draggable={false}
            />
        </div>
    )
}