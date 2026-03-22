export interface OnCallEntry {
  service: string;
  name: string;
  phone: string;
  pager: string;
}

export const MOCK_ONCALL: OnCallEntry[] = [
  {
    service: 'General Surgery',
    name: 'Dr. Faisal Jehan',
    phone: '(555) 234-5678',
    pager: '4401',
  },
  {
    service: 'Trauma Surgery',
    name: 'Dr. Sarah Okoye',
    phone: '(555) 345-6789',
    pager: '4402',
  },
  {
    service: 'Vascular Surgery',
    name: 'Dr. James Patel',
    phone: '(555) 456-7890',
    pager: '4403',
  },
];
