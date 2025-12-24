import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StudyPlan, QuizQuestion, ExamType } from '../types';
import { EXAM_LABELS } from '../constants';

const ai = new GoogleGenAI({ apiKey: AIzaSyBmCN1_tbncO6etpRkqqY9I_75ckaHAPwE });

const modelName = "gemini-3-flash-preview";

// Schema for Study Plan
const studyPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          notes: { type: Type.STRING },
          sessions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                duration: { type: Type.STRING },
                method: { type: Type.STRING },
                focus: { type: Type.STRING },
              },
              required: ["topic", "duration", "method", "focus"]
            }
          }
        },
        required: ["day", "sessions", "notes"]
      }
    },
    createdAt: { type: Type.STRING } // Helper for persistence/versioning
  },
  required: ["title", "schedule"]
};

// Schema for Quiz
const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      question: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      correctIndex: { type: Type.INTEGER },
      explanation: { type: Type.STRING },
      domain: { type: Type.STRING },
    },
    required: ["id", "question", "options", "correctIndex", "explanation", "domain"]
  }
};

export const generateStudyPlan = async (
  weeks: number,
  weaknesses: string,
  hoursPerDay: number,
  examType: ExamType,
  incompleteTopics: string[]
): Promise<StudyPlan> => {
  
  // Format the incomplete topics to guide the AI
  const priorityTopics = incompleteTopics.slice(0, 20).join(", ");
  const examName = EXAM_LABELS[examType];

  const prompt = `
    You are a senior Examiner for the ${examName}.
    Create a highly detailed ${weeks}-week revision timetable for a candidate.
    
    Context:
    - Exam: ${examName}
    - Daily Study Time: ${hoursPerDay} hours.
    - Specific User Weaknesses: ${weaknesses}.
    - Priority Syllabus Areas (Incomplete): ${priorityTopics}... (and others).

    Instructions:
    - Focus heavily on the incomplete topics listed.
    - Structure sessions to include 'Active Recall', 'SBA Practice', and 'Core Reading'.
    - Ensure Physics and Physiology are intermixed with Clinical topics to prevent burnout.
    - For ${examType === 'EDAIC_PART1' ? 'EDAIC, emphasize Basic Sciences heavily as Part 1 is detail-oriented.' : 'FRCA, emphasize clinical application of basic sciences.'}
    
    Output strictly in JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: studyPlanSchema,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const plan = JSON.parse(text) as StudyPlan;
    plan.createdAt = new Date().toISOString();
    return plan;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
};

export const generateQuiz = async (
  topic: string,
  examType: ExamType
): Promise<QuizQuestion[]> => {
  const examName = EXAM_LABELS[examType];
  const isEdaic = examType === 'EDAIC_PART1';

  const prompt = `
    Generate 5 high-yield Single Best Answer (SBA) questions for the ${examName}.
    Topic: ${topic}.
    
    Style Guide:
    - ${isEdaic ? 'EDAIC style: Focus on physiological values, specific drug properties, and physics principles. High detail.' : 'FRCA style: Clinical vignettes followed by basic science justification.'}
    - 5 options per question (A-E).
    - Provide a detailed explanation for the correct answer, referencing guidelines where applicable.
    
    Output strictly in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
