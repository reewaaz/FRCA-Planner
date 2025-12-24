import React, { useState, useEffect } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlan, UserSettings, CurriculumSection } from '../types';
import { Calendar, Clock, Brain, Loader2, Save, RefreshCw, AlertCircle } from 'lucide-react';

interface SmartPlannerProps {
  settings: UserSettings;
  curriculum: CurriculumSection[];
  savedPlan: StudyPlan | null;
  onSavePlan: (plan: StudyPlan) => void;
}

const SmartPlanner: React.FC<SmartPlannerProps> = ({ settings, curriculum, savedPlan, onSavePlan }) => {
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState(4);
  const [hours, setHours] = useState(2);
  const [weaknesses, setWeaknesses] = useState("");

  const getIncompleteTopics = () => {
    const topics: string[] = [];
    curriculum.forEach(sec => {
      sec.topics.forEach(t => {
        if (!t.completed) {
          topics.push(`${sec.title}: ${t.title}`);
          if (t.subtopics) {
            t.subtopics.forEach(st => {
              if (!st.completed) topics.push(st.title);
            });
          }
        }
      });
    });
    return topics;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const incomplete = getIncompleteTopics();
      const generatedPlan = await generateStudyPlan(
        weeks, 
        weaknesses || "General revision", 
        hours, 
        settings.examType,
        incomplete
      );
      onSavePlan(generatedPlan);
    } catch (e) {
      alert("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
       <header>
        <h2 className="text-3xl font-bold text-slate-800">Smart Planner</h2>
        <p className="text-slate-500 mt-2">AI-generated revision timetables tailored to your uncompleted topics.</p>
      </header>

      {!savedPlan ? (
        <div className="max-w-xl mx-auto w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 mt-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-teal-600" />
            Create New Plan
          </h3>
          
          <div className="bg-slate-50 p-4 rounded-lg mb-6 text-sm text-slate-600 flex items-start">
             <AlertCircle className="w-4 h-4 mr-2 mt-0.5 text-slate-500 flex-shrink-0" />
             <p>This will generate a plan prioritizing the {getIncompleteTopics().length} topics you haven't marked as complete in your syllabus tracker.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Weeks)</label>
              <input 
                type="number" 
                min="1" max="12"
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hours per Day</label>
              <input 
                type="number" 
                min="1" max="12"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specific Weaknesses (Optional)</label>
              <textarea 
                rows={3}
                placeholder="e.g. I struggle with Pharmacokinetics math..."
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Syllabus...
                </>
              ) : (
                "Generate Personalized Plan"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="mb-2 md:mb-0">
              <h3 className="text-xl font-bold text-slate-800">{savedPlan.title}</h3>
              <p className="text-sm text-slate-500">Created: {new Date(savedPlan.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-3">
               <button onClick={() => onSavePlan(null as any)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center border border-slate-200">
                 <RefreshCw className="w-4 h-4 mr-2" /> New Plan
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto pb-8">
            {savedPlan.schedule.map((day, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-teal-800 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {day.day}
                  </h4>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {day.notes}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {day.sessions.map((session, sIdx) => (
                    <div key={sIdx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                      <div className="flex justify-between font-medium text-slate-800">
                        <span>{session.topic}</span>
                        <span className="text-teal-600 flex items-center text-xs">
                          <Clock className="w-3 h-3 mr-1" /> {session.duration}
                        </span>
                      </div>
                      <div className="mt-1 text-slate-600 text-xs flex flex-wrap gap-2">
                         <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-xs">{session.method}</span>
                         <span className="italic text-slate-500">Focus: {session.focus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartPlanner;
