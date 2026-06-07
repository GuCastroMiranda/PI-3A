import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { verifyJWT } from '../middlewares/auth'

export async function favoriteRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  // Lista favoritos do usuário logado
  app.get('/favorites', async (request, reply) => {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: request.user.sub },
      include: {
        medication: true,
      },
    })

    return reply.send(favorites.map(f => f.medication))
  })

  // Adiciona um medicamento aos favoritos
  app.post('/favorites', async (request, reply) => {
    const bodySchema = z.object({
      medication_id: z.string().uuid(),
    })

    const { medication_id } = bodySchema.parse(request.body)

    const favoriteExists = await prisma.favorite.findUnique({
      where: {
        user_id_medication_id: {
          user_id: request.user.sub,
          medication_id,
        },
      },
    })

    if (favoriteExists) {
      return reply.status(409).send({ message: 'Medication already in favorites.' })
    }

    const favorite = await prisma.favorite.create({
      data: {
        user_id: request.user.sub,
        medication_id,
      },
    })

    return reply.status(201).send(favorite)
  })

  // Remove um medicamento dos favoritos
  app.delete('/favorites/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    await prisma.favorite.deleteMany({
      where: {
        user_id: request.user.sub,
        medication_id: id,
      },
    })

    return reply.status(204).send()
  })
}
