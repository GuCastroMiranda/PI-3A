import fastify from 'fastify'
import cors from '@fastify/cors'
import { prisma } from './lib/prisma'
import { authRoutes } from './routes/auth'
import { medicationRoutes } from './routes/medications'
import { pharmacyRoutes } from './routes/pharmacies'
import { favoriteRoutes } from './routes/favorites'
import { inventoryRoutes } from './routes/inventory'

const app = fastify({ logger: true })

app.register(cors, {
  origin: true, // Permite que o App Expo acesse a API
})

app.register(authRoutes, { prefix: '/auth' })
app.register(medicationRoutes)
app.register(pharmacyRoutes)
app.register(favoriteRoutes)
app.register(inventoryRoutes)

app.get('/health', async (request, reply) => {
  return { status: 'ok', message: 'FarmaSUS Backend is running!' }
})

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' })
    console.log('🔥 Server running on http://localhost:3333')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
