import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar Usuário Teste
  const passwordHash = await bcrypt.hash('123456', 8)
  const user = await prisma.user.upsert({
    where: { email: 'teste@farmasus.com' },
    update: {},
    create: {
      name: 'Usuário Teste',
      email: 'teste@farmasus.com',
      password_hash: passwordHash,
      role: 'CITIZEN',
    },
  })

  // Criar Usuário Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@farmasus.com' },
    update: {},
    create: {
      name: 'Admin Farmácia',
      email: 'admin@farmasus.com',
      password_hash: passwordHash,
      role: 'ADMIN',
    },
  })

  // Criar Medicamentos (Baseados no Mock do frontend)
  const meds = [
    { name: 'Dipirona 500mg', category: 'Analgésico', description: 'Alívio da dor e febre' },
    { name: 'Amoxicilina 500mg', category: 'Antibiótico', description: 'Tratamento de infecções bacterianas' },
    { name: 'Ibuprofeno 400mg', category: 'Anti-inflamatório', description: 'Redução de inflamações e dor' },
    { name: 'Losartana 50mg', category: 'Anti-hipertensivo', description: 'Controle da pressão arterial' },
    { name: 'Paracetamol 750mg', category: 'Analgésico', description: 'Redução de febre e dor leve' },
  ]

  const createdMeds = []
  for (const med of meds) {
    const created = await prisma.medication.create({
      data: med
    })
    createdMeds.push(created)
  }

  // Criar UBSs (Farmácias)
  const pharmacies = [
    { name: 'UBS Centro', address: 'Rua Principal, 100 - Centro', latitude: -23.5505, longitude: -46.6333 },
    { name: 'UBS Sul', address: 'Av. Sul, 200 - Zona Sul', latitude: -23.5605, longitude: -46.6433 },
    { name: 'UBS Norte', address: 'Av. Norte, 300 - Zona Norte', latitude: -23.5405, longitude: -46.6233 },
    { name: 'UBS Leste', address: 'Av. Leste, 400 - Zona Leste', latitude: -23.5305, longitude: -46.6133 },
    { name: 'UBS Oeste', address: 'Av. Oeste, 500 - Zona Oeste', latitude: -23.5505, longitude: -46.6533 },
  ]

  const createdPharmacies = []
  for (const ph of pharmacies) {
    const created = await prisma.pharmacy.create({
      data: ph
    })
    createdPharmacies.push(created)
  }

  // Criar Estoques (Inventory)
  console.log('💊 Preenchendo estoques...')
  // Dipirona na UBS Centro
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[0].id, medication_id: createdMeds[0].id, quantity: 150 } })
  // Amoxicilina na UBS Sul (Sem estoque)
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[1].id, medication_id: createdMeds[1].id, quantity: 0 } })
  // Ibuprofeno na UBS Norte
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[2].id, medication_id: createdMeds[2].id, quantity: 300 } })
  // Losartana na UBS Leste
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[3].id, medication_id: createdMeds[3].id, quantity: 50 } })
  // Paracetamol na UBS Oeste (Sem estoque)
  await prisma.inventory.create({ data: { pharmacy_id: createdPharmacies[4].id, medication_id: createdMeds[4].id, quantity: 0 } })

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
