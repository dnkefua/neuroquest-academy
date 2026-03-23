import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit } from '@/lib/rateLimit'
import { rateLimitMap } from '@/lib/rateLimit'

describe('rateLimit', () => {
  // Use a unique IP per test to avoid cross-test state pollution
  const uniqueIp = () => `test-ip-${Date.now()}-${Math.random().toString(36).slice(2)}`

  beforeEach(() => {
    // Clear the shared map between tests so each test starts fresh
    rateLimitMap.clear()
  })

  it('allows first request', () => {
    const result = rateLimit(uniqueIp())
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBeLessThanOrEqual(20)
  })

  it('allows multiple requests up to the limit', () => {
    const ip = uniqueIp()
    const results: boolean[] = []
    for (let i = 0; i < 20; i++) {
      results.push(rateLimit(ip).allowed)
    }
    expect(results.every((r) => r === true)).toBe(true)
  })

  it('blocks once MAX_REQUESTS is exceeded', () => {
    const ip = uniqueIp()
    for (let i = 0; i < 20; i++) rateLimit(ip)
    const result = rateLimit(ip)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('returns non-zero remaining for non-exhausted IP', () => {
    const ip = uniqueIp()
    rateLimit(ip)
    rateLimit(ip)
    const result = rateLimit(ip)
    expect(result.remaining).toBeGreaterThan(0)
    expect(result.allowed).toBe(true)
  })

  it('returns resetAt timestamp when blocked', () => {
    const ip = uniqueIp()
    for (let i = 0; i < 20; i++) rateLimit(ip)
    const result = rateLimit(ip)
    expect(result.resetAt).toBeGreaterThan(Date.now())
  })

  it('tracks different IPs independently', () => {
    const ipA = uniqueIp()
    const ipB = uniqueIp()
    for (let i = 0; i < 20; i++) rateLimit(ipA)
    const result = rateLimit(ipB)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(19)
  })
})
