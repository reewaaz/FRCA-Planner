import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Book, Calendar, HelpCircle, FileText, Settings, Stethoscope } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Curriculum', icon: Book },
    { id: 'planner', label: 'Smart Planner', icon: Calendar },
    { id: 'quiz', label: 'Quiz Mode', icon: HelpCircle },
    { id: 'resources', label: 'Resources', icon: FileText },
  ];

  return (
    <div className="w-64 bg-slate-900 h-full flex flex-col text-slate-300 flex-shrink-0">
      <div className="p-6 flex items-center space-x-3 text-white border-b border-slate-800">
        <div className="bg-teal-600 p-2 rounded-lg">
          <Stethoscope className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg tracking-tight">MasterMind</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
           onClick={() => setView('settings')}
           className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'settings' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Settings</span>
        </button>
        <div className="mt-4 px-4 text-xs text-slate-500">
          v2.0.0
        </div>
      </div>
    </div>
  );
};

export default Navigation;
