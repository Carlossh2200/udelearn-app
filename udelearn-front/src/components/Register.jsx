// src/components/Register.jsx
import React, { useState } from 'react'

export default function Register({ onNavigate }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const newErrors = {
            nombre: '',
            email: '',
            password: '',
            confirmPassword: ''
        }

        let hasErrors = false

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido'
            hasErrors = true
        }

        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido'
            hasErrors = true
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Por favor ingresa un correo electrónico válido'
            hasErrors = true
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida'
            hasErrors = true
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
            hasErrors = true
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña'
            hasErrors = true
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'
            hasErrors = true
        }

        setErrors(newErrors)

        if (!hasErrors) {
            console.log('Register attempt:', formData)
            onNavigate('login')
        }
    }

    const isValidEmail = (email) => {
        return email.includes('@') && email.includes('.') && email.length > 5
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    // Estilos más compactos
    const inputStyle = {
        padding: '10px 35px 10px 10px',
        border: '2px solid #275054',
        borderRadius: '6px',
        fontSize: '13px',
        outline: 'none',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#275054',
        width: '100%',
        boxSizing: 'border-box'
    }

    const errorInputStyle = {
        ...inputStyle,
        borderColor: 'red'
    }

    const buttonStyle = {
        padding: '10px',
        background: '#275054',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        fontWeight: 'bold',
        width: '100%'
    }

    const eyeButtonStyle = {
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#275054',
        padding: '0',
        width: '16px',
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }

    const errorTextStyle = {
        color: 'red',
        fontSize: '11px',
        margin: '3px 0 0 0',
        textAlign: 'left',
        display: 'block',
        minHeight: '14px'
    }

    // Íconos SVG
    const EyeIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    )

    const EyeOffIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    )

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
                top: '45%', // Más arriba
                left: '30%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                width: '85%', // Más angosto
                maxWidth: '320px', // Más pequeño
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Logo más pequeño */}
                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <img
                        src="/assets/logo.png"
                        alt="Logo UdeLearn"
                        style={{
                            width: '250px', // Logo más pequeño
                            height: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'
                        }}
                        draggable={false}
                    />
                </div>

                {/* Formulario más compacto */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '20px', // Menos padding
                    borderRadius: '10px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                    width: '100%'
                }}>
                    <h2 style={{ 
                        textAlign: 'center', 
                        marginBottom: '15px', 
                        color: '#333',
                        fontSize: '18px', // Título más pequeño
                        fontWeight: 'bold'
                    }}>
                        Crear Cuenta
                    </h2>
                    
                    <form 
                        onSubmit={handleSubmit} 
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} // Menos espacio entre campos
                        autoComplete="off"
                        noValidate
                    >
                        {/* Nombre */}
                        <div>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre completo"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                style={errors.nombre ? errorInputStyle : inputStyle}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="words"
                                spellCheck="false"
                                required
                            />
                            <span style={errorTextStyle}>
                                {errors.nombre}
                            </span>
                        </div>
                        
                        {/* Email */}
                        <div>
                            <input
                                type="text"
                                name="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleInputChange}
                                style={errors.email ? errorInputStyle : inputStyle}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                required
                            />
                            <span style={errorTextStyle}>
                                {errors.email}
                            </span>
                        </div>
                        
                        {/* Contraseña */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleInputChange}
                                style={errors.password ? errorInputStyle : inputStyle}
                                autoComplete="new-password"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={eyeButtonStyle}
                                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                            <span style={errorTextStyle}>
                                {errors.password}
                            </span>
                        </div>
                        
                        {/* Confirmar Contraseña */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirmar contraseña"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                style={errors.confirmPassword ? errorInputStyle : inputStyle}
                                autoComplete="new-password"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                style={eyeButtonStyle}
                                title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                            <span style={errorTextStyle}>
                                {errors.confirmPassword}
                            </span>
                        </div>
                        
                        <button 
                            type="submit" 
                            style={buttonStyle}
                        >
                            Registrarse
                        </button>
                    </form>
                    
                    <p style={{ textAlign: 'center', marginTop: '12px', color: '#666', fontSize: '12px' }}>
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