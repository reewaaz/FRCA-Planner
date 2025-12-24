import { CurriculumSection, ExamType } from './types';

// Default initial settings
export const DEFAULT_SETTINGS = {
  name: 'Candidate',
  examType: 'FRCA_PRIMARY' as ExamType,
  examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
};

export const EXAM_LABELS: Record<ExamType, string> = {
  'FRCA_PRIMARY': 'Primary FRCA',
  'FRCA_FINAL': 'Final FRCA',
  'EDAIC_PART1': 'EDAIC Part 1',
};

// Comprehensive Curriculum spanning Basic Sciences to Clinical
export const INITIAL_CURRICULUM: CurriculumSection[] = [
  {
    id: 'phys',
    title: 'Physiology & Pathophysiology',
    topics: [
      { id: 'p1', title: 'Cellular Physiology & Membrane Transport', completed: false },
      { id: 'p2', title: 'Respiratory Physiology', completed: false, subtopics: [
          { id: 'p2a', title: 'Mechanics of Breathing & Compliance', completed: false },
          { id: 'p2b', title: 'Gas Exchange & Transport', completed: false },
          { id: 'p2c', title: 'V/Q Relationships & Shunts', completed: false },
          { id: 'p2d', title: 'Control of Breathing', completed: false },
          { id: 'p2e', title: 'Hypoxia & Cyanosis', completed: false }
      ]},
      { id: 'p3', title: 'Cardiovascular Physiology', completed: false, subtopics: [
          { id: 'p3a', title: 'Cardiac Cycle & Pressure-Volume Loops', completed: false },
          { id: 'p3b', title: 'Control of Cardiac Output', completed: false },
          { id: 'p3c', title: 'Microcirculation & Starling Forces', completed: false },
          { id: 'p3d', title: 'Coronary & Cerebral Circulation', completed: false }
      ]},
      { id: 'p4', title: 'Neurophysiology', completed: false, subtopics: [
          { id: 'p4a', title: 'Action Potentials & Synaptic Transmission', completed: false },
          { id: 'p4b', title: 'Pain Pathways & Modulation', completed: false },
          { id: 'p4c', title: 'Autonomic Nervous System', completed: false },
          { id: 'p4d', title: 'CSF & Intracranial Pressure', completed: false }
      ]},
      { id: 'p5', title: 'Renal Physiology', completed: false, subtopics: [
          { id: 'p5a', title: 'GFR & Autoregulation', completed: false },
          { id: 'p5b', title: 'Acid-Base Balance', completed: false },
          { id: 'p5c', title: 'Fluid & Electrolyte Homeostasis', completed: false }
      ]},
      { id: 'p6', title: 'Liver, Gut & Metabolism', completed: false },
      { id: 'p7', title: 'Endocrinology & Stress Response', completed: false },
    ]
  },
  {
    id: 'pharm',
    title: 'Pharmacology',
    topics: [
      { id: 'ph1', title: 'Basic Principles', completed: false, subtopics: [
          { id: 'ph1a', title: 'Pharmacokinetics (Compartment Models)', completed: false },
          { id: 'ph1b', title: 'Pharmacodynamics (Receptors)', completed: false },
          { id: 'ph1c', title: 'Isomerism & Chemistry', completed: false }
      ]},
      { id: 'ph2', title: 'Inhalational Anaesthetics', completed: false, subtopics: [
          { id: 'ph2a', title: 'MAC & Meyer-Overton', completed: false },
          { id: 'ph2b', title: 'Specific Agents (Sevo, Des, Iso, N2O)', completed: false }
      ]},
      { id: 'ph3', title: 'IV Induction Agents', completed: false, subtopics: [
         { id: 'ph3a', title: 'Propofol, Thiopental, Ketamine, Etomidate', completed: false },
         { id: 'ph3b', title: 'TIVA principles', completed: false }
      ]},
      { id: 'ph4', title: 'Neuromuscular Blockers & Reversal', completed: false },
      { id: 'ph5', title: 'Local Anaesthetics & Toxicity', completed: false },
      { id: 'ph6', title: 'Analgesics (Opioids & Non-Opioids)', completed: false },
      { id: 'ph7', title: 'Cardiovascular Drugs (Inotropes/Anti-arrhythmics)', completed: false },
    ]
  },
  {
    id: 'physics',
    title: 'Physics, Equipment & Stats',
    topics: [
      { id: 'phy1', title: 'Measurement & Gas Laws', completed: false },
      { id: 'phy2', title: 'Breathing Systems (Mapleson)', completed: false },
      { id: 'phy3', title: 'Ventilators & Vaporizers', completed: false },
      { id: 'phy4', title: 'Monitoring (Pulse Ox, Capnography, ECG)', completed: false },
      { id: 'phy5', title: 'Electrical Safety & Lasers', completed: false },
      { id: 'phy6', title: 'Ultrasound Physics', completed: false },
      { id: 'phy7', title: 'Medical Statistics & Clinical Trials', completed: false },
    ]
  },
  {
    id: 'clin',
    title: 'Clinical Anaesthesia',
    topics: [
      { id: 'c1', title: 'Pre-operative Assessment & Optimization', completed: false },
      { id: 'c2', title: 'Airway Management (Difficult Airway Guidelines)', completed: false },
      { id: 'c3', title: 'Emergency Anaesthesia & Trauma', completed: false },
      { id: 'c4', title: 'Obstetric Anaesthesia', completed: false },
      { id: 'c5', title: 'Paediatric Anaesthesia', completed: false },
      { id: 'c6', title: 'Neuroanaesthesia', completed: false },
      { id: 'c7', title: 'Regional Anaesthesia (Blocks)', completed: false },
      { id: 'c8', title: 'Critical Incidents (Anaphylaxis, MH, LAST)', completed: false },
    ]
  },
  {
    id: 'icm',
    title: 'Intensive Care Medicine',
    topics: [
      { id: 'icm1', title: 'Sepsis & Septic Shock', completed: false },
      { id: 'icm2', title: 'Respiratory Failure & Ventilation', completed: false },
      { id: 'icm3', title: 'Renal Replacement Therapy', completed: false },
    ]
  }
];

export const MOCK_RESOURCES = [
  { id: 1, title: 'e-LA (e-Learning Anaesthesia)', type: 'Website', url: 'https://www.e-lfh.org.uk/programmes/anaesthesia/' },
  { id: 2, title: 'RCoA 2024 Curriculum Guide', type: 'PDF', url: 'https://www.rcoa.ac.uk/training-careers/training-anaesthesia/2021-anaesthetics-curriculum' },
  { id: 3, title: 'BJA Education', type: 'Journal', url: 'https://www.bjaed.org/' },
  { id: 4, title: 'LITFL (Life in the Fast Lane)', type: 'Website', url: 'https://litfl.com/' },
  { id: 5, title: 'Propofolology', type: 'Website', url: '#' },
];
