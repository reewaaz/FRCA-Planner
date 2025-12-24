import React from 'react';
import { MOCK_RESOURCES } from '../constants';
import { ExternalLink, FileText, Book, Globe } from 'lucide-react';

const ResourceLibrary: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Book': return <Book className="w-5 h-5 text-amber-600" />;
      case 'Website': return <Globe className="w-5 h-5 text-blue-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold text-slate-800">Resource Library</h2>
        <p className="text-slate-500 mt-2">Essential texts, guidelines, and links.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_RESOURCES.map((res) => (
          <a key={res.id} href={res.url} className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-teal-500 transition-all duration-200 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-teal-50 transition-colors">
                  {getIcon(res.type)}
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-teal-700 mb-1">{res.title}</h3>
              <p className="text-sm text-slate-500">{res.type}</p>
            </div>
          </a>
        ))}
        
        {/* Add New Placeholder */}
        <button className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-teal-500 hover:text-teal-600 transition-colors">
          <span className="text-2xl mb-2">+</span>
          <span className="font-medium">Add Resource</span>
        </button>
      </div>
    </div>
  );
};

export default ResourceLibrary;
