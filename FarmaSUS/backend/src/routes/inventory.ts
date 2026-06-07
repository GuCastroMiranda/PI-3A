import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { verifyJWT } from '../middlewares/auth'

export async function inventoryRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/inventory', async (request, reply) => {
    if (request.user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Only administrators can update inventory.' })
    }

    const bodySchema = z.object({
      pharmacy_id: z.string().uuid(),
      medication_id: z.string().uuid(),
      quantity: z.number().min(0),
    })

    const { pharmacy_id, medication_id, quantity } = bodySchema.parse(request.body)

    const inventory = await prisma.inventory.upsert({
      where: {
        pharmacy_id_medication_id: {
          pharmacy_id,
          medication_id,
        },
      },
      update: {
        quantity,
      },
      create: {
        pharmacy_id,
        medication_id,
        quantity,
      },
    })

    return reply.status(200).send(inventory)
  })
}
