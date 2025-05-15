import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Foro Hyppo.</p>
      </div>
    </footer>
  );
};

export default Footer;
