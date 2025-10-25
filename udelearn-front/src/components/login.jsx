// src/components/Login.jsx
import React, { useState } from 'react'

export default function Login({ onNavigate }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [emailError, setEmailError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!isValidEmail(formData.email)) {
            setEmailError('Por favor ingresa un correo electrónico válido')
            return
        }
        
        setEmailError('')
        console.log('Login attempt:', formData)
        onNavigate('dashboard')
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
                        Iniciar Sesión
                    </h2>
                    
                    {/* FORMULARIO CON AUTCOMPLETE DESHABILITADO */}
                    <form 
                        onSubmit={handleSubmit} 
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        autoComplete="off"
                        noValidate
                    >
                        <div>
                            <input
                                type="text"
                                name="login-email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleEmailChange}
                                style={{
                                    ...inputStyle,
                                    borderColor: emailError ? 'red' : '#275054'
                                }}
                                autoComplete="off"
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
                            name="login-password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            style={inputStyle}
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck="false"
                            required
                        />
                        
                        <button
                            type="submit"
                            style={buttonStyle}
                            onMouseOver={(e) => e.target.style.background = '#1a3a3f'}
                            onMouseOut={(e) => e.target.style.background = '#275054'}
                        >
                            Ingresar
                        </button>
                    </form>
                    
                    <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '14px' }}>
                        ¿No tienes cuenta?{' '}
                        <span 
                            onClick={() => onNavigate('register')}
                            style={{ color: '#275054', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                        >
                            Regístrate aquí
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}