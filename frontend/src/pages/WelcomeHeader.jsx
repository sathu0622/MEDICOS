import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeHeader = () => {
  return (
    <nav className="flex justify-between items-center py-8 px-4 max-w-6xl mx-auto">
      <Link to="/" className="text-[#037bff] text-2xl font-bold font-sans">
        MEDICOS
      </Link>

   
      {/* Menu */}
      <ul className="hidden md:flex items-center space-x-8">
        <li>
          <Link 
            to="/" 
            className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors"
          >
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default WelcomeHeader;