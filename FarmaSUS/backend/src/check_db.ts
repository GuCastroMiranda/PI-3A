import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const usersCount = await prisma.user.count()
  const pharmaciesCount = await prisma.pharmacy.count()
  const medicationsCount = await prisma.medication.count()
  const inventoryCount = await prisma.inventory.count()
  const favoritesCount = await prisma.favorite.count()

  console.log(`--- RELATÓRIO DO BANCO DE DADOS ---`)
  console.log(`Usuários: ${usersCount}`)
  console.log(`Farmácias (UBS): ${pharmaciesCount}`)
  console.log(`Medicamentos: ${medicationsCount}`)
  console.log(`Estoques Registrados: ${inventoryCount}`)
  console.log(`Favoritos Registrados: ${favoritesCount}`)
  console.log(`-----------------------------------`)

  // Checar por anomalias:
  const usersWithSameEmail = await prisma.$queryRaw`SELECT email, COUNT(*) FROM "User" GROUP BY email HAVING COUNT(*) > 1`
  if ((usersWithSameEmail as any[]).length > 0) {
    console.log('⚠️ ALERTA: Existem usuários duplicados no banco de dados!')
    console.log(usersWithSameEmail)
  } else {
    console.log('✅ Tabela User saudável (sem emails duplicados).')
  }

  const pharmaciesWithSameName = await prisma.$queryRaw`SELECT name, COUNT(*) FROM "Pharmacy" GROUP BY name HAVING COUNT(*) > 1`
  if ((pharmaciesWithSameName as any[]).length > 0) {
    console.log('⚠️ ALERTA: Existem farmácias duplicadas no banco de dados!')
  } else {
    console.log('✅ Tabela Pharmacy saudável (sem duplicações).')
  }

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
