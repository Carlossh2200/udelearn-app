// src/components/Register.jsx
import React, { useState } from 'react'

export default function Register({ onNavigate }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [emailError, setEmailError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Validar email
        if (!isValidEmail(formData.email)) {
            setEmailError('Por favor ingresa un correo electrónico válido')
            return
        }
        
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden')
            return
        }
        
        setEmailError('')
        console.log('Register attempt:', formData)
        onNavigate('login')
    }

    const isValidEmail = (email) => {
        return email.includes('@') && email.includes('.') && email.length > 5
    }

    const handleEmailChange = (e) => {
        const value = e.target.value
        setFormData(prev => ({
            ...prev,
            email: value
        }))
        
        if (emailError && isValidEmail(value)) {
            setEmailError('')
        }
    }

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const inputStyle = {
        padding: '12px',
        border: '2px solid #275054',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#275054',
        width: '100%',
        boxSizing: 'border-box'
    }

    const buttonStyle = {
        padding: '12px',
        background: '#275054',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        fontWeight: 'bold',
        width: '100%'
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            overflow: 'hidden'
        }}>
            <img
                src="/assets/bg_login.jpg"
                alt="Fondo UdeLearn"
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    zIndex: 1
                }}
                draggable={false}
            />

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '30%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                width: '90%',
                maxWidth: '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <img
                        src="/assets/logo.png"
                        alt="Logo UdeLearn"
                        style={{
                            width: '300px',
                            height: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'
                        }}
                        draggable={false}
                    />
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    width: '100%'
                }}>
                    <h2 style={{ 
                        textAlign: 'center', 
                        marginBottom: '20px', 
                        color: '#333',
                        fontSize: '22px',
                        fontWeight: 'bold'
                    }}>
                        Crear Cuenta
                    </h2>
                    
                    {/* FORMULARIO */}
                    <form 
                        onSubmit={handleSubmit} 
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        autoComplete="off"
                        noValidate
                    >
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            style={inputStyle}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="words"
                            spellCheck="false"
                            required
                        />
                        
                        <div>
                            <input
                                type="text"
                                name="register-email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleEmailChange}
                                style={{
                                    ...inputStyle,
                                    borderColor: emailError ? 'red' : '#275054'
                                }}
                                autoComplete="new-email"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                required
                            />
                            {emailError && (
                                <p style={{ 
                                    color: 'red', 
                                    fontSize: '12px', 
                                    margin: '5px 0 0 0',
                                    textAlign: 'left'
                                }}>
                                    {emailError}
                                </p>
                            )}
                        </div>
                        
                        <input
                            type="password"
                            name="register-password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={inputStyle}
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck="false"
                            required
                        />
                        
                        <input
                            type="password"
                            name="confirm-password"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            style={inputStyle}
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck="false"
                            required
                        />
                        
                        <button type="submit" style={buttonStyle}>
                            Registrarse
                        </button>
                    </form>
                    
                    <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '14px' }}>
                        ¿Ya tienes cuenta?{' '}
                        <span 
                            onClick={() => onNavigate('login')}
                            style={{ color: '#275054', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                        >
                            Inicia sesión aquí
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}