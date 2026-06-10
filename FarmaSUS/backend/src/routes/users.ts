import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { verifyJWT } from '../middlewares/auth'

export async function userRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.put('/profile', async (request, reply) => {
    const updateBodySchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      cpf: z.string().optional(),
      cep: z.string().optional(),
      address: z.string().optional(),
    })

    const data = updateBodySchema.parse(request.body)

    try {
      const user = await prisma.user.update({
        where: { id: request.user.sub },
        data,
        include: { pharmacy: true }
      })

      return reply.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        cep: user.cep,
        address: user.address,
        role: user.role,
        pharmacy_id: user.pharmacy?.id 
      })
    } catch (error) {
      return reply.status(500).send({ message: 'Internal server error' })
    }
  })
}
