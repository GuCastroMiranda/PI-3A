import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const JWT_SECRET = 'supersecret_farmasus_2026'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      cpf: z.string().optional(),
      cep: z.string().optional(),
      address: z.string().optional(),
      role: z.enum(['CITIZEN', 'ADMIN']).default('CITIZEN'),
    })

    const { name, email, password, cpf, cep, address, role } = registerBodySchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      return reply.status(409).send({ message: 'E-mail already exists.' })
    }

    const password_hash = await bcrypt.hash(password, 8)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        cpf,
        cep,
        address,
        role,
      },
    })

    if (role === 'ADMIN') {
      await prisma.pharmacy.create({
        data: {
          name,
          address: address || 'Endereço não informado',
          admin_id: newUser.id,
        }
      })
    }

    return reply.status(201).send()
  })

  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = loginBodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { cpf: email }
        ]
      },
      include: { pharmacy: true }
    })

    if (!user) {
      return reply.status(400).send({ message: 'Invalid credentials.' })
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      return reply.status(400).send({ message: 'Invalid credentials.' })
    }

    const token = jwt.sign({ role: user.role }, JWT_SECRET, {
      subject: user.id,
      expiresIn: '7d',
    })

    return reply.status(200).send({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        cpf: user.cpf,
        cep: user.cep,
        address: user.address,
        role: user.role,
        pharmacy_id: user.pharmacy?.id 
      } 
    })
  })
}
