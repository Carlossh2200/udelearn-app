// src/components/NightModeForm.jsx
import React from 'react'

export default function NightModeForm({ formData, onInputChange, isFormValid, onSubmit }) {
    return (
        <>
            {/* Formulario modo noche */}
            <div style={{
                position: 'absolute',
                top: '65%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 4,
                width: '90%',
                maxWidth: '400px',
                transition: 'opacity 0.8s ease-in-out'
            }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Campo Nombre - Nuevos colores para modo noche */}
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={onInputChange}
                        style={{
                            width: '100%', padding: '15px',
                            border: `2px solid #FFD700`, borderRadius: '10px',
                            background: 'transparent', color: '#FFD700',
                            backdropFilter: 'blur(5px)',
                            fontSize: '16px', outline: 'none'
                        }}
                        placeholder="Nombre"
                        required
                    />

                    {/* Campo Correo */}
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={onInputChange}
                        style={{
                            width: '100%', padding: '15px',
                            border: `2px solid #FF6B35`, borderRadius: '10px',
                            background: 'transparent', color: '#FF6B35',
                            backdropFilter: 'blur(5px)',
                            fontSize: '16px', outline: 'none'
                        }}
                        placeholder="Correo electrónico"
                        required
                    />

                    {/* Campo Carrera */}
                    <input
                        type="text"
                        name="carrera"
                        value={formData.carrera}
                        onChange={onInputChange}
                        style={{
                            width: '100%', padding: '15px',
                            border: `2px solid #FF6B35`, borderRadius: '10px',
                            background: 'transparent', color: '#FF6B35',
                            backdropFilter: 'blur(5px)',
                            fontSize: '16px', outline: 'none'
                        }}
                        placeholder="Carrera"
                        required
                    />

                    {/* Campo Archivo con clip */}
                    <div style={{ position: 'relative' }}>
                        <input
                            type="file"
                            name="archivo"
                            onChange={onInputChange}
                            style={{
                                width: '100%', padding: '15px 15px 15px 45px',
                                border: `2px solid #FFD700`, borderRadius: '10px',
                                background: 'transparent', color: '#FFD700',
                                backdropFilter: 'blur(5px)',
                                fontSize: '16px', outline: 'none',
                                cursor: 'pointer'
                            }}
                            required
                        />
                        <div style={{
                            position: 'absolute',
                            left: '15px', top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '20px', color: '#FFD700',
                            pointerEvents: 'none'
                        }}>
                            📎
                        </div>
                    </div>
                </form>
            </div>

            {/* Botón enviar modo noche */}
            {isFormValid && (
                <button
                    onClick={onSubmit}
                    style={{
                        position: 'absolute',
                        right: '50px', bottom: '50px',
                        background: 'none', border: 'none', padding: 0,
                        cursor: 'pointer', zIndex: 5
                    }}
                >
                    <img
                        src="/assets/boton-enviar-nocturno.png" // Cambia esta imagen
                        alt="Enviar formulario"
                        style={{
                            width: '150px', height: 'auto', display: 'block',
                            transition: 'transform 0.2s ease',
                            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        draggable={false}
                    />
                </button>
            )}
        </>
    )
}