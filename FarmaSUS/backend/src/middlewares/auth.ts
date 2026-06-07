import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'supersecret_farmasus_2026'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string, role: string }

    request.user = {
      sub: decoded.sub,
      role: decoded.role,
    }
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
