import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function pharmacyRoutes(app: FastifyInstance) {
  app.get('/pharmacies', async (request, reply) => {
    const pharmacies = await prisma.pharmacy.findMany()
    return reply.send(pharmacies)
  })
}
