import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SyllabusTracker from './components/SyllabusTracker';
import SmartPlanner from './components/SmartPlanner';
import QuizMode from './components/QuizMode';
import ResourceLibrary from './components/ResourceLibrary';
import Settings from './components/Settings';
import { ViewState, CurriculumSection, UserSettings, StudyPlan } from './types';
import { INITIAL_CURRICULUM, DEFAULT_SETTINGS } from './constants';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  // --- State Initialization with Persistence ---
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('mastermind_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Load Curriculum Progress
  const [curriculum, setCurriculum] = useState<CurriculumSection[]>(() => {
    const saved = localStorage.getItem('mastermind_curriculum');
    return saved ? JSON.parse(saved) : INITIAL_CURRICULUM;
  });

  // Load Saved Plan
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(() => {
     const saved = localStorage.getItem('mastermind_plan');
     return saved ? JSON.parse(saved) : null;
  });

  // --- Effects for Persistence ---

  useEffect(() => {
    localStorage.setItem('mastermind_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mastermind_curriculum', JSON.stringify(curriculum));
  }, [curriculum]);

  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem('mastermind_plan', JSON.stringify(currentPlan));
    } else {
      localStorage.removeItem('mastermind_plan');
    }
  }, [currentPlan]);

  // --- Handlers ---

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const toggleTopic = (sectionId: string, topicId: string, subtopicId?: string) => {
    setCurriculum(prev => prev.map(section => {
      if (section.id !== sectionId) return section;

      return {
        ...section,
        topics: section.topics.map(topic => {
          if (topic.id !== topicId) return topic;

          if (subtopicId) {
             const newSubtopics = topic.subtopics?.map(sub => 
               sub.id === subtopicId ? { ...sub, completed: !sub.completed } : sub
             );
             // Auto-complete parent if all subtopics are done? Keeping it manual for now gives more control.
             return { ...topic, subtopics: newSubtopics };
          }

          return { ...topic, completed: !topic.completed };
        })
      };
    }));
  };

  // Calculate stats
  const totalTopics = curriculum.reduce((acc, sec) => acc + sec.topics.length + (sec.topics.reduce((sum, t) => sum + (t.subtopics?.length || 0), 0)), 0);
  const completedTopics = curriculum.reduce((acc, sec) => {
    const mainTopics = sec.topics.filter(t => t.completed).length;
    const subTopics = sec.topics.reduce((sum, t) => sum + (t.subtopics?.filter(st => st.completed).length || 0), 0);
    return acc + mainTopics + subTopics;
  }, 0);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
                  curriculum={curriculum} 
                  completedCount={completedTopics} 
                  totalCount={totalTopics} 
                  settings={settings}
                  setView={setCurrentView}
               />;
      case 'syllabus':
        return <SyllabusTracker curriculum={curriculum} onToggleTopic={toggleTopic} />;
      case 'planner':
        return <SmartPlanner 
                  settings={settings} 
                  curriculum={curriculum}
                  savedPlan={currentPlan}
                  onSavePlan={setCurrentPlan}
               />;
      case 'quiz':
        return <QuizMode settings={settings} />;
      case 'resources':
        return <ResourceLibrary />;
      case 'settings':
        return <Settings settings={settings} onSave={handleUpdateSettings} />;
      default:
        return <Dashboard curriculum={curriculum} completedCount={completedTopics} totalCount={totalTopics} settings={settings} setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Navigation currentView={currentView} setView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-30">
          <span className="font-bold text-slate-800">MasterMind</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full pb-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
