export interface Medication {
  id: string;
  name: string;
  inStock: boolean;
  pharmacy: string;
  address: string;
  cep?: string;
  description?: string;
}

export const medicationsMock: Medication[] = [
  { 
    id: '1', 
    name: 'Dipirona 500mg', 
    inStock: true, 
    pharmacy: 'UBS Centro',
    address: 'Setor Comercial Sul Q. 6 Edifício Venâncio 2000 - Asa Sul, Brasília - DF',
    cep: '70333-900',
    description: 'Indicado para o tratamento de dor e febre.'
  },
  { 
    id: '2', 
    name: 'Amoxicilina 500mg', 
    inStock: false, 
    pharmacy: 'UBS Sul',
    address: 'EQS 415/416 - Asa Sul, Brasília - DF',
    cep: '70390-100',
    description: 'Antibiótico indicado para o tratamento de infecções bacterianas.'
  },
  { 
    id: '3', 
    name: 'Ibuprofeno 400mg', 
    inStock: true, 
    pharmacy: 'UBS Norte',
    address: 'EQN 114/115 - Asa Norte, Brasília - DF',
    cep: '70764-500',
    description: 'Indicado para alívio de dor, febre e inflamação.'
  },
  { 
    id: '4', 
    name: 'Losartana 50mg', 
    inStock: true, 
    pharmacy: 'UBS Leste',
    address: 'SHIS QI 25 - Lago Sul, Brasília - DF',
    cep: '71660-200',
    description: 'Indicado para o tratamento de hipertensão arterial.'
  },
  { 
    id: '5', 
    name: 'Paracetamol 750mg', 
    inStock: false, 
    pharmacy: 'UBS Oeste',
    address: 'QNM 18 Conjunto A - Ceilândia Sul, Brasília - DF',
    cep: '72210-181',
    description: 'Indicado para o tratamento de dor e febre.'
  },
];