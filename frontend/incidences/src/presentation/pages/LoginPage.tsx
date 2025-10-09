import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      // The redirect is handled inside the login function in the context
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h1 className="login-title"><img src="/accesblanco.png" alt="B2Park Logo" className="login-logo"/><span className="login-subtitle"> Incidencias</span></h1>
        <form onSubmit={handleLogin} className="login-form">
          {error && <p className="login-error">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número."
            />
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;