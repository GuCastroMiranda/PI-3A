export interface Medication {
  id: string;
  name: string;
  inStock: boolean;
  pharmacy: string;
}

export const medicationsMock: Medication[] = [
  { id: '1', name: 'Dipirona 500mg', inStock: true, pharmacy: 'UBS Centro' },
  { id: '2', name: 'Amoxicilina 500mg', inStock: false, pharmacy: 'UBS Sul' },
  { id: '3', name: 'Ibuprofeno 400mg', inStock: true, pharmacy: 'UBS Norte' },
  { id: '4', name: 'Losartana 50mg', inStock: true, pharmacy: 'UBS Leste' },
  { id: '5', name: 'Paracetamol 750mg', inStock: false, pharmacy: 'UBS Oeste' },
];