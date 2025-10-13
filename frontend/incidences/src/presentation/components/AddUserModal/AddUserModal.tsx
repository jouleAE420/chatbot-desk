import React, { useState } from 'react';
import './AddUserModal.css'; // Crearemos este archivo CSS en el siguiente paso

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: { username: string; email: string; role: string; password: string }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Rol por defecto
  const [password, setPassword] = useState('');

  if (!isOpen) return null; // Si no está abierto, no renderiza nada

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }
    onAddUser({ username, email, role, password });
    // Limpiar formulario después de enviar
    setUsername('');
    setEmail('');
    setRole('user');
    setPassword('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Nuevo Usuario</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <div className="form-actions">
           <button type="submit" className="primary-button submit-button">Agregar Usuario</button>
        <button type="button" className="secondary-button cancel-button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;