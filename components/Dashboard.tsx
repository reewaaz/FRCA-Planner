import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CurriculumSection, UserSettings } from '../types';
import { EXAM_LABELS } from '../constants';
import { Trophy, Clock, Target, Calendar, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  curriculum: CurriculumSection[];
  completedCount: number;
  totalCount: number;
  settings: UserSettings;
  setView: (view: any) => void;
}

const COLORS = ['#0f766e', '#cbd5e1']; // Teal-700, Slate-300

const Dashboard: React.FC<DashboardProps> = ({ curriculum, completedCount, totalCount, settings, setView }) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Calculate days remaining
  const today = new Date();
  const examDate = new Date(settings.examDate);
  const diffTime = Math.max(0, examDate.getTime() - today.getTime());
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Find weakest domain (lowest completion)
  const domainData = curriculum.map(section => {
    const sectionTotal = section.topics.length;
    const sectionCompleted = section.topics.filter(t => t.completed).length;
    return {
      name: section.title,
      completed: sectionCompleted,
      total: sectionTotal,
      percentage: sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0
    };
  });

  const sortedDomains = [...domainData].sort((a, b) => a.percentage - b.percentage);
  const weakestArea = sortedDomains[0];

  const pieData = [
    { name: 'Completed', value: completedCount },
    { name: 'Remaining', value: totalCount - completedCount },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Hello, {settings.name}.</h2>
          <p className="text-slate-500 mt-2">Targeting: <span className="font-semibold text-teal-600">{EXAM_LABELS[settings.examType]}</span></p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Days to Exam</p>
          <p className={`text-4xl font-black ${daysRemaining < 30 ? 'text-red-600' : 'text-slate-800'}`}>
            {daysRemaining}
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Syllabus</p>
            <h3 className="text-2xl font-bold text-slate-900">{percentage}%</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Topics Done</p>
            <h3 className="text-2xl font-bold text-slate-900">{completedCount}/{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4 cursor-pointer hover:border-red-300 transition-colors" onClick={() => setView('syllabus')}>
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-slate-500 font-medium truncate">Focus Area</p>
            <h3 className="text-lg font-bold text-slate-900 truncate">{weakestArea?.name || "None"}</h3>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Date</p>
            <h3 className="text-lg font-bold text-slate-900">{new Date(settings.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit'})}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Mastery */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Domain Breakdown</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={140} tick={{fontSize: 11}} interval={0} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="percentage" fill="#0f766e" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Actions & Pie */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Completion Status</h3>
            <div className="h-48 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
               </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold text-lg mb-2">Need a study plan?</h3>
            <p className="text-slate-300 text-sm mb-4">Use the Smart Planner to generate a schedule based on your {totalCount - completedCount} remaining topics.</p>
            <button 
              onClick={() => setView('planner')}
              className="w-full py-2 bg-teal-600 hover:bg-teal-500 rounded-lg font-medium transition-colors"
            >
              Go to Planner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
