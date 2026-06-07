import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar o banco para evitar duplicações ao rodar o seed várias vezes
  await prisma.favorite.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.pharmacy.deleteMany()
  await prisma.user.deleteMany()

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

  console.log('✅ Seed finalizado com sucesso! (Sem UBSs mockadas, cadastre a sua na demonstração!)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
