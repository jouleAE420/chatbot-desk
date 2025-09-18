import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Adjust this value as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
      {isScrolled ? (
        <h1 className="mini-header-title">B2Park</h1>
      ) : (
        <>
          <img src="/dfsdfsf.png" alt="B2Park" />
          <h1 className="header-title">PANEL DE INCIDENCIAS</h1>
        </>
      )}
    </header>
  );
};

export default Header;
