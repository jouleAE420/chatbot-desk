import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../application/services/auth.service';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('technician');
  const [registrationKey, setRegistrationKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if ((role === 'supervisor' || role === 'admin') && !registrationKey) {
      setError(`La llave de registro es obligatoria para el rol de ${role}`);
      return;
    }

    try {
      await register({ username, password, role, registrationKey });
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-form-container">
        <h1 className="register-title">Crear Cuenta</h1>
        <form onSubmit={handleRegister} className="register-form">
          {error && <p className="register-error">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="technician">Técnico</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {(role === 'supervisor' || role === 'admin') && (
            <div className="form-group">
              <label htmlFor="registrationKey">Llave de Registro</label>
              <input
                type="password"
                id="registrationKey"
                value={registrationKey}
                onChange={(e) => setRegistrationKey(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="register-button">Registrarse</button>
        </form>
        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
