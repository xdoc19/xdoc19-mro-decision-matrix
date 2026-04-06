export const STEPS = [
  { id: 0, label: 'Colectare date', icon: '◎' },
  { id: 1, label: 'Trimitere RFQ', icon: '◈' },
  { id: 2, label: 'Analiză oferte', icon: '◇' },
  { id: 3, label: 'Business case', icon: '◆' },
  { id: 4, label: 'Decizie', icon: '★' },
];

export const CHECKLIST_ITEMS = [
  'Specificații tehnice complete',
  'Cantități estimate 12 luni',
  'Standarde calitate aplicabile',
  'Constrângeri livrare / lead time',
  'Cerințe ambalare și etichetare',
  'Puncte de livrare identificate',
  'Buget aprobat / estimat',
  'Constrângeri legale sau import/export',
];

export const AI_SUPPLIERS = {
  'Filtrare':    ['Hydac International GmbH', 'Parker Hannifin Corp.', 'Donaldson Company Inc.', 'Pall Corporation', 'Mann+Hummel GmbH'],
  'Lubrifianți': ['Fuchs SE', 'Castrol Industrial', 'Shell Lubricants', 'Klüber Lubrication', 'Mobil Industrial'],
  'Sudură':      ['Lincoln Electric', 'ESAB Group', 'Fronius International', 'Kemppi Oy', 'Victor Technologies'],
  'Pneumatică':  ['Festo SE', 'SMC Corporation', 'Parker Hannifin', 'Norgren', 'Bosch Rexroth'],
  'Electrică':   ['Schneider Electric', 'ABB Ltd.', 'Siemens AG', 'Eaton Corporation', 'Legrand'],
  'Fixare':      ['Würth Group', 'Bossard Group', 'Bufab Group', 'Optimas Solutions', 'TR Fastenings'],
  'Altele':      ['Grainger Industrial', 'RS Components', 'Brammer Buck & Hickman', 'Rubix Group', 'Haberkorn'],
};

export const MRO_CATEGORIES = Object.keys(AI_SUPPLIERS);

export const EVALUATION_CRITERIA = [
  { id: 'price',    label: 'Preț',              weight: 0.40 },
  { id: 'tech',     label: 'Calitate tehnică',  weight: 0.25 },
  { id: 'delivery', label: 'Termen livrare',    weight: 0.15 },
  { id: 'financial',label: 'Aspect financiar',  weight: 0.10 },
  { id: 'refs',     label: 'Referințe',         weight: 0.10 },
];

export const BUSINESS_CASE_THRESHOLD = 15000;

export const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: 'Filtre hidraulice linie asamblare',
    category: 'Filtrare',
    value: 18500,
    currency: 'EUR',
    step: 2,
    description: 'Filtre hidraulice pentru prese și linii de asamblare — reînnoire anuală contract',
    checklist: { 0: true, 1: true, 2: true, 3: true, 4: false, 5: true, 6: true, 7: false },
    suppliers: [
      { id: 's1', name: 'Hydac International', country: 'DE', price: 82000, tech: 8.5, delivery: 9, quality: 9, financial: '42M EUR', refs: 3, legalOk: true, isoOk: true, gdprOk: true, rating: 'A', age: 32, risk: 'Scăzut' },
      { id: 's2', name: 'Parker Hannifin',     country: 'US', price: 88500, tech: 9.0, delivery: 8, quality: 9, financial: '14B USD', refs: 5, legalOk: true, isoOk: false, gdprOk: true, rating: 'A+', age: 85, risk: 'Scăzut' },
      { id: 's3', name: 'Donaldson Co.',       country: 'US', price: 76000, tech: 7.5, delivery: 7, quality: 8, financial: '2.8B USD', refs: 4, legalOk: true, isoOk: true, gdprOk: false, rating: 'BBB+', age: 67, risk: 'Moderat' },
    ],
    scores: {
      s1: { price: 9, tech: 8.5, delivery: 9, financial: 9, refs: 8 },
      s2: { price: 7, tech: 9.0, delivery: 8, financial: 9, refs: 9 },
      s3: { price: 10, tech: 7.5, delivery: 7, financial: 8, refs: 8 },
    },
    businessCase: { savings: 0, investment: 0, payback: 0, roi: 0, justification: '', risks: '' },
    decision: { approvedBy: '', date: '', notes: '' },
    activeTab: 0,
    createdAt: '2025-06-01',
  },
  {
    id: 2,
    name: 'Consumabile sudură — Q3',
    category: 'Sudură',
    value: 7200,
    currency: 'EUR',
    step: 0,
    description: 'Electrozi, sârmă MIG și gaze tehnice pentru atelierul de sudură',
    checklist: {},
    suppliers: [],
    scores: {},
    businessCase: { savings: 0, investment: 0, payback: 0, roi: 0, justification: '', risks: '' },
    decision: { approvedBy: '', date: '', notes: '' },
    activeTab: 0,
    createdAt: '2025-06-10',
  },
];
