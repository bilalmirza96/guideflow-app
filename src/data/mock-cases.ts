export interface CaseEntry {
  procedure: string;
  date: string;
  role: 'SC' | 'SJ' | 'TA' | 'FA';
  category: string;
}

export const MOCK_CASES: CaseEntry[] = [
  { procedure: 'Lap Cholecystectomy', date: 'Mar 10', role: 'SJ', category: 'Biliary' },
  { procedure: 'Appendectomy', date: 'Mar 8', role: 'SJ', category: 'Appendix' },
  { procedure: 'Inguinal Hernia Repair', date: 'Mar 6', role: 'SJ', category: 'Hernia' },
  { procedure: 'Exploratory Laparotomy', date: 'Mar 5', role: 'FA', category: 'Abdominal' },
  { procedure: 'Sigmoid Colectomy', date: 'Mar 3', role: 'FA', category: 'Large Intestine' },
  { procedure: 'Thyroidectomy', date: 'Mar 1', role: 'SJ', category: 'Endocrine' },
  { procedure: 'Upper Endoscopy (EGD)', date: 'Feb 28', role: 'SJ', category: 'Upper Endoscopy' },
  { procedure: 'Pancreaticoduodenectomy', date: 'Feb 26', role: 'FA', category: 'Pancreas' },
];
