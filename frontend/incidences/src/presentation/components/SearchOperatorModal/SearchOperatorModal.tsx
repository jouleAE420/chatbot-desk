import React, { useState, useEffect } from 'react';
import './SearchOperatorModal.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const fetchUsers = async (query: string): Promise<User[]> => {
  const mockUsers: User[] = [
    { id: '1', username: 'adolfo.cruz', email: 'adolfo.cruz@example.com', role: 'operator' },
    { id: '2', username: 'juan.perez', email: 'juan.perez@example.com', role: 'operator' },
    { id: '3', username: 'ana.lopez', email: 'ana.lopez@example.com', role: 'supervisor' },
    { id: '4', username: 'maria.garcia', email: 'maria.garcia@example.com', role: 'admin' },
    { id: '5', username: 'carlos.ruiz', email: 'carlos.ruiz@example.com', role: 'operator' },
  ];
  if (!query) return [];
  return mockUsers.filter(u => 
    u.username.toLowerCase().includes(query.toLowerCase()) || 
    u.email.toLowerCase().includes(query.toLowerCase())
  );
};

interface SearchOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOperatorModal: React.FC<SearchOperatorModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const debounceTimer = setTimeout(() => {
      fetchUsers(query).then(data => {
        setResults(data);
        setIsLoading(false);
        setSelectedIndex(0);
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results.length, onClose]);

  if (!isOpen) return null;

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="spotlight-overlay" onClick={onClose}>
      <div className="spotlight-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Input Area */}
        <div className="spotlight-header">
          <svg className="search-icon" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar operador por nombre o email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="spotlight-input"
          />
          <button onClick={onClose} className="close-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Results Area */}
        <div className="spotlight-results">
          {isLoading && (
            <div className="spotlight-loading">
              <div className="spinner"></div>
              <span>Buscando...</span>
            </div>
          )}

          {!isLoading && query.length > 1 && results.length === 0 && (
            <div className="spotlight-empty">
              <div className="empty-title">No se encontraron operadores</div>
              <div className="empty-subtitle">Intenta con otro término de búsqueda</div>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="results-list">
              {results.map((user, index) => (
                <div
                  key={user.id}
                  className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => console.log('Seleccionado:', user)}
                >
                  <div className="user-avatar">
                    {getInitials(user.username)}
                  </div>

                  <div className="user-details">
                    <div className="user-header">
                      <h4 className="user-name">{user.username}</h4>
                      <span className={`user-badge badge-${user.role}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="user-email-row">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      <span>{user.email}</span>
                    </div>
                  </div>

                  {index === selectedIndex && (
                    <kbd className="enter-key">↵</kbd>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && query.length === 0 && (
            <div className="spotlight-empty">
              <div className="empty-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <div className="empty-title">Comienza a escribir para buscar</div>
              <div className="empty-subtitle">Escribe al menos 2 caracteres</div>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="spotlight-footer">
            <div className="footer-hints">
              <span className="hint">
                <kbd>↑</kbd>
                <kbd>↓</kbd>
                navegar
              </span>
              <span className="hint">
                <kbd>↵</kbd>
                seleccionar
              </span>
            </div>
            <span className="hint">
              <kbd>Esc</kbd>
              cerrar
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOperatorModal;