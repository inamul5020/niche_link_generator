import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/30 backdrop-blur-md sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            Niche Link Generator
          </span>
        </h1>
        <p className="text-slate-400 mt-1">Discover websites for popular niches in the US.</p>
      </div>
    </header>
  );
};

export default Header;