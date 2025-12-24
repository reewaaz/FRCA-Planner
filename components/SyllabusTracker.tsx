import React from 'react';
import { CurriculumSection, CurriculumItem } from '../types';
import { CheckCircle, Circle, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

interface SyllabusTrackerProps {
  curriculum: CurriculumSection[];
  onToggleTopic: (sectionId: string, topicId: string, subtopicId?: string) => void;
}

const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({ curriculum, onToggleTopic }) => {
  return (
    <div className="space-y-6">
       <header>
        <h2 className="text-3xl font-bold text-slate-800">Primary FRCA Syllabus</h2>
        <p className="text-slate-500 mt-2">Track your coverage of the RCoA curriculum.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {curriculum.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-slate-800">{section.title}</h3>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                {section.topics.filter(t => t.completed).length} / {section.topics.length} Done
              </span>
            </div>
            
            <div className="p-4 divide-y divide-slate-100">
              {section.topics.map((topic) => (
                <div key={topic.id} className="py-3">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => onToggleTopic(section.id, topic.id)}
                      className={`transition-colors duration-200 ${topic.completed ? 'text-teal-600' : 'text-slate-300 hover:text-teal-400'}`}
                    >
                      {topic.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={`text-sm ${topic.completed ? 'text-slate-800 line-through decoration-slate-400 opacity-70' : 'text-slate-700 font-medium'}`}>
                      {topic.title}
                    </span>
                  </div>
                  
                  {/* Nested Subtopics Render (if any) */}
                  {topic.subtopics && topic.subtopics.length > 0 && (
                     <div className="ml-8 mt-2 space-y-2 border-l-2 border-slate-100 pl-4">
                        {topic.subtopics.map(sub => (
                           <div key={sub.id} className="flex items-center space-x-3">
                              <button 
                                onClick={() => onToggleTopic(section.id, topic.id, sub.id)}
                                className={`transition-colors duration-200 ${sub.completed ? 'text-teal-600' : 'text-slate-300 hover:text-teal-400'}`}
                              >
                                {sub.completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                              </button>
                              <span className={`text-xs ${sub.completed ? 'text-slate-600 line-through' : 'text-slate-600'}`}>
                                {sub.title}
                              </span>
                           </div>
                        ))}
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusTracker;
