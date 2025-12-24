import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, UserSettings } from '../types';
import { EXAM_LABELS } from '../constants';
import { Play, Check, X, ArrowRight, Loader2, AlertCircle, BookOpen } from 'lucide-react';

interface QuizModeProps {
  settings: UserSettings;
}

const QuizMode: React.FC<QuizModeProps> = ({ settings }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const q = await generateQuiz(topic, settings.examType);
      setQuestions(q);
      setCurrentIndex(0);
      setScore(0);
      setQuizFinished(false);
      setShowExplanation(false);
      setSelectedOption(null);
    } catch (e) {
      alert("Error generating quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Generating {EXAM_LABELS[settings.examType]} SBA Questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-700">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Practice SBA</h2>
          <p className="text-slate-500 mb-6">Enter a topic to generate 5 high-yield Single Best Answer questions tailored for <span className="font-semibold text-slate-700">{EXAM_LABELS[settings.examType]}</span>.</p>
          
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="e.g. 'Propofol Pharmacology' or 'Sepsis Guidelines'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
            />
            <button 
              onClick={startQuiz}
              disabled={!topic}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2" /> Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center">
         <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
           <h2 className="text-3xl font-bold text-slate-800 mb-4">Quiz Complete!</h2>
           <p className="text-slate-500 mb-8">You scored</p>
           <div className="text-6xl font-black text-teal-600 mb-8">
             {score} / {questions.length}
           </div>
           <button 
             onClick={() => setQuestions([])}
             className="px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
           >
             New Topic
           </button>
         </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto mt-4">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Question {currentIndex + 1} of {questions.length}</span>
        <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">{currentQ.domain}</span>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let itemClass = "w-full p-4 text-left border rounded-lg transition-all duration-200 flex justify-between items-center ";
            
            if (selectedOption === null) {
              itemClass += "border-slate-200 hover:border-teal-500 hover:bg-teal-50";
            } else {
              if (idx === currentQ.correctIndex) {
                 itemClass += "bg-green-50 border-green-500 text-green-800 font-medium";
              } else if (idx === selectedOption) {
                 itemClass += "bg-red-50 border-red-500 text-red-800";
              } else {
                 itemClass += "opacity-50 border-slate-200";
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOption !== null}
                className={itemClass}
              >
                <div className="flex items-center">
                   <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center mr-3 text-xs font-bold text-slate-500">
                    {String.fromCharCode(65 + idx)}
                   </span>
                   <span>{option}</span>
                </div>
                {selectedOption !== null && idx === currentQ.correctIndex && <Check className="w-5 h-5 text-green-600" />}
                {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctIndex && <X className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 animate-fade-in">
          <h4 className="font-bold text-blue-900 mb-2">Explanation</h4>
          <p className="text-blue-800 leading-relaxed text-sm">
            {currentQ.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button 
          onClick={nextQuestion}
          disabled={selectedOption === null}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {currentIndex === questions.length - 1 ? "Finish" : "Next Question"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default QuizMode;
