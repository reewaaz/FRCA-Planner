import React from 'react';
import { UserSettings, ExamType } from '../types';
import { Settings as SettingsIcon, Save, Calendar, User, GraduationCap } from 'lucide-react';
import { EXAM_LABELS } from '../constants';

interface SettingsProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = React.useState<UserSettings>(settings);
  const [saved, setSaved] = React.useState(false);

  const handleChange = (field: keyof UserSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
       <header>
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-slate-700" />
          Settings
        </h2>
        <p className="text-slate-500 mt-2">Configure your exam target and preferences.</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Your Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Target Examination
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(EXAM_LABELS) as ExamType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange('examType', type)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    formData.examType === type
                      ? 'bg-teal-50 border-teal-600 text-teal-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                  }`}
                >
                  {EXAM_LABELS[type]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {formData.examType === 'EDAIC_PART1' 
                ? 'Curriculum will prioritize Basic Sciences and Physiology.' 
                : 'Curriculum will balance Clinical and Basic Sciences.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Exam Date
            </label>
            <input
              type="date"
              value={formData.examDate}
              onChange={(e) => handleChange('examDate', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saved ? (
              <span className="text-green-600 text-sm font-medium flex items-center">
                <SettingsIcon className="w-4 h-4 mr-1" /> Preferences Saved
              </span>
            ) : <span></span>}
            
            <button
              type="submit"
              className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
