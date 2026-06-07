import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { verifyJWT } from '../middlewares/auth'

export async function medicationRoutes(app: FastifyInstance) {
  // Lista todos os medicamentos com seus respectivos estoques
  app.get('/medications', async (request, reply) => {
    const medications = await prisma.medication.findMany({
      include: {
        inventories: {
          include: {
            pharmacy: true,
          },
        },
      },
    })
    return reply.send(medications)
  })

  // Rota para cadastrar novos medicamentos (requer Admin)
  app.post('/medications', { preHandler: [verifyJWT] }, async (request, reply) => {
    if (request.user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Apenas administradores podem cadastrar medicamentos.' })
    }

    const bodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      category: z.string().optional(),
    })

    const data = bodySchema.parse(request.body)

    const medication = await prisma.medication.create({
      data,
    })

    return reply.status(201).send(medication)
  })

  // Busca a disponibilidade de um medicamento nas UBSs
  app.get('/medications/:id/availability', async (request, reply) => {
    const { id } = request.params as { id: string }

    const availability = await prisma.inventory.findMany({
      where: { medication_id: id },
      include: {
        pharmacy: true,
      },
    })

    const formattedResponse = availability.map((inv) => ({
      pharmacy_name: inv.pharmacy.name,
      address: inv.pharmacy.address,
      latitude: inv.pharmacy.latitude,
      longitude: inv.pharmacy.longitude,
      quantity: inv.quantity,
      in_stock: inv.quantity > 0,
    }))

    return reply.send(formattedResponse)
  })
}
