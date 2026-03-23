// In-memory sliding-window rate limiter.
// No external dependencies — works in Next.js Edge and Node runtimes.

const WINDOW_MS = 60_000 // 1-minute window
const MAX_REQUESTS = 20   // 20 requests per window per IP

export const rateLimitMap = new Map<string, number[]>()

export function rateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []
  const valid = timestamps.filter((t) => now - t < WINDOW_MS)

  if (valid.length >= MAX_REQUESTS) {
    const oldestValid = Math.min(...valid)
    return { allowed: false, remaining: 0, resetAt: oldestValid + WINDOW_MS }
  }

  valid.push(now)
  rateLimitMap.set(ip, valid)
  return { allowed: true, remaining: MAX_REQUESTS - valid.length, resetAt: now + WINDOW_MS }
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIP = req.headers.get('x-real-ip')
  if (realIP) return realIP
  return '127.0.0.1'
}
