// src/components/HeroPage.jsx
import React, { useState, useEffect } from 'react'

export default function HeroPage({
    bgUrl = '/assets/bg.jpg',
    bg2Url = '/assets/bg2.jpg',
    logoUrl = '/assets/logo.png',
    buttonImageUrl = '/assets/boton-enviar.png'
}) {
    const [isActive, setIsActive] = useState(false)
    const [showForm, setShowForm] = useState(false)
    
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        carrera: '',
        archivo: null
    })

    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true)
            const formTimer = setTimeout(() => {
                setShowForm(true)
            }, 1600)
            
            return () => clearTimeout(formTimer)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    const isFormValid = formData.nombre && formData.correo && formData.carrera && formData.archivo

    const handleInputChange = (e) => {
        const { name, value, files } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isFormValid) {
            console.log('Datos a enviar:', formData)
            alert('Formulario enviado correctamente!')
        }
    }

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
            
            {/* Logo con animación */}
            <div style={{
                position: 'absolute',
                top: isActive ? '0px' : '50%',
                left: '50%',
                transform: isActive 
                    ? 'translateX(-50%) scale(0.695)'
                    : 'translate(-50%, -50%) scale(1)',
                transition: 'all 1.5s ease-in-out',
                zIndex: 3
            }}>
                <img
                    src={logoUrl}
                    alt="Logo UdeLearn"
                    style={{
                        width: '800px',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                        display: 'block'
                    }}
                    draggable={false}
                />
            </div>

            {/* Botón modo nocturno - Luna naranja */}
            {showForm && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    cursor: 'pointer',
                    fontSize: '32px',
                    background: 'none',
                    border: 'none',
                    zIndex: 4,
                    transition: 'opacity 0.8s ease-in-out',
                    opacity: showForm ? 1 : 0
                }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                >
                    🌙
                    <style>{`
                        [style*="top: 20px; right: 20px;"] {
                            filter: invert(54%) sepia(87%) saturate(415%) hue-rotate(343deg) brightness(93%) contrast(91%);
                        }
                    `}</style>
                </div>
            )}

            {/* Formulario POSICIONADO MÁS ABAJO y transparente */}
            {showForm && (
                <div style={{
                    position: 'absolute',
                    top: '65%', // Más abajo para no tapar el logo
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 4,
                    width: '90%',
                    maxWidth: '400px',
                    transition: 'opacity 0.8s ease-in-out',
                    opacity: showForm ? 1 : 0
                }}>
                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        {/* Campo Nombre - Completamente transparente */}
                        <div>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: `2px solid #275054`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box',
                                    background: 'transparent', // Completamente transparente
                                    color: '#275054',
                                    outline: 'none',
                                    backdropFilter: 'blur(5px)' // Efecto glass
                                }}
                                placeholder="Nombre"
                                required
                            />
                        </div>

                        {/* Campo Correo - Completamente transparente */}
                        <div>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: `2px solid #E97132`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box',
                                    background: 'transparent', // Completamente transparente
                                    color: '#E97132',
                                    outline: 'none',
                                    backdropFilter: 'blur(5px)' // Efecto glass
                                }}
                                placeholder="Correo electrónico"
                                required
                            />
                        </div>

                        {/* Campo Carrera - Completamente transparente */}
                        <div>
                            <input
                                type="text"
                                name="carrera"
                                value={formData.carrera}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: `2px solid #E97132`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box',
                                    background: 'transparent', // Completamente transparente
                                    color: '#E97132',
                                    outline: 'none',
                                    backdropFilter: 'blur(5px)' // Efecto glass
                                }}
                                placeholder="Carrera"
                                required
                            />
                        </div>

                        {/* Campo Archivo - Completamente transparente con icono de clip */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                name="archivo"
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '15px 15px 15px 45px',
                                    border: `2px solid #275054`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box',
                                    background: 'transparent', // Completamente transparente
                                    color: '#275054',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(5px)' // Efecto glass
                                }}
                                required
                            />
                            {/* Icono de clip */}
                            <div style={{
                                position: 'absolute',
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '20px',
                                color: '#275054',
                                pointerEvents: 'none'
                            }}>
                                📎
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Botón de enviar A UN LADO (derecha) */}
            {isFormValid && showForm && (
                <button
                    type="submit"
                    onClick={handleSubmit}
                    style={{
                        position: 'absolute',
                        right: '50px', // A la derecha
                        bottom: '50px', // Abajo
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        zIndex: 5,
                        transition: 'opacity 0.8s ease-in-out, transform 0.2s ease'
                    }}
                >
                    <img
                        src={buttonImageUrl}
                        alt="Enviar formulario"
                        style={{
                            width: '150px', // Un poco más pequeño
                            height: 'auto',
                            display: 'block',
                            transition: 'transform 0.2s ease',
                            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.1)'
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)'
                        }}
                        draggable={false}
                    />
                </button>
            )}
        </div>
    )
}