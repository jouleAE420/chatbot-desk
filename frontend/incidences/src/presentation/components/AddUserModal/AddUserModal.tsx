import React, { useState } from 'react';
import './AddUserModal.css';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../ConfirmationModal';
import { IconEye, IconEyeOff } from '@tabler/icons-react'; // <-- NUEVO: Iconos para el ojo

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: { username: string; email: string; role: string; password: string }) => Promise<void>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
const [role, setRole] = useState('operador');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // <-- NUEVO: Estado para visibilidad
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres || !apellidos || !email || !password || !confirmPassword) {
      toast.error('Por favor, rellena todos los campos obligatorios.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleConfirmAddUser = async () => {
    setConfirmModalOpen(false);
    const username = `${nombres} ${apellidos}`.trim();
    
    try {
      await onAddUser({ username, email, role, password });
      toast.success('¡Usuario creado exitosamente!');
      
      setNombres('');
      setApellidos('');
      setEmail('');
      setRole('operador');
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      toast.error('No se pudo crear el usuario. Inténtalo de nuevo.');
      console.error(error);
    }
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
          {/* ... otros campos ... */}
          <div className="form-group">
            <label htmlFor="nombres">Nombre: </label>
            <input type="text" id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">Apellido:</label>
            <input type="text" id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {/* NUEVO: Campo de contraseña con icono */}
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <div className="password-input-wrapper">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número."
              />
              <button type="button" className="password-toggle-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
          </div>

          {/* NUEVO: Campo de confirmar contraseña con icono */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <div className="password-input-wrapper">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Operador</option>
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
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAddUser}
        title="Confirmar Creación de Usuario"
      >
        <p>¿Estás seguro de que deseas crear este nuevo usuario?</p>
      </ConfirmationModal>
    </div>
  );
};

export default AddUserModal;