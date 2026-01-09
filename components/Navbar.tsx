
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Image as ImageIcon, History, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Generate', icon: <Sparkles size={20} /> },
    { path: '/history', label: 'My Gallery', icon: <History size={20} /> },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Layout className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              CreatorThumb<span className="text-indigo-400">AI</span>
            </span>
          </Link>
          
          <div className="flex space-x-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
