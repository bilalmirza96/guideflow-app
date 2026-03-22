export interface ACGMECategory {
  name: string;
  min: number;
  logged: number;
  benchmark: number;
}

export const ACGME_DATA: ACGMECategory[] = [
  { name: 'Abdominal', min: 250, logged: 34, benchmark: 42 },
  { name: 'Alimentary Tract', min: 180, logged: 28, benchmark: 35 },
  { name: 'Laparoscopic', min: 175, logged: 30, benchmark: 38 },
  { name: 'Endoscopy', min: 85, logged: 22, benchmark: 20 },
  { name: 'Vascular', min: 50, logged: 8, benchmark: 12 },
  { name: 'Trauma', min: 50, logged: 9, benchmark: 15 },
  { name: 'Surgical Crit Care', min: 40, logged: 12, benchmark: 14 },
  { name: 'Breast', min: 40, logged: 6, benchmark: 8 },
  { name: 'Skin / Soft Tissue', min: 25, logged: 11, benchmark: 10 },
  { name: 'Head & Neck', min: 25, logged: 5, benchmark: 6 },
  { name: 'Thoracic', min: 20, logged: 2, benchmark: 5 },
  { name: 'Pediatric', min: 20, logged: 4, benchmark: 5 },
  { name: 'Endocrine', min: 15, logged: 4, benchmark: 4 },
  { name: 'Plastic', min: 10, logged: 2, benchmark: 3 },
];
