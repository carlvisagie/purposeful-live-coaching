import { describe, it, expect, beforeAll, vi } from 'vitest';
import { appRouter } from '../../routers';
import { createContext } from '../../_core/context';
import type { Request, Response } from 'express';

describe('Stripe Payment Verification', () => {
  it('should have verifyAndCreateBooking procedure', () => {
    expect(appRouter.stripe.verifyAndCreateBooking).toBeDefined();
  });

  it('should validate session_id input', async () => {
    const mockReq = {
      headers: {},
      cookies: {},
    } as Request;
    
    const mockRes = {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as Response;

    const ctx = await createContext({ req: mockReq, res: mockRes });
    const caller = appRouter.createCaller(ctx);

    // Test with invalid input
    await expect(
      caller.stripe.verifyAndCreateBooking({ sessionId: '' })
    ).rejects.toThrow();
  });
});

describe('Booking Creation', () => {
  it('should have createCheckoutSession procedure', () => {
    expect(appRouter.stripe.createCheckoutSession).toBeDefined();
  });

  it('should validate required booking fields', async () => {
    const mockReq = {
      headers: {},
      cookies: {},
    } as Request;
    
    const mockRes = {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as Response;

    const ctx = await createContext({ req: mockReq, res: mockRes });
    const caller = appRouter.createCaller(ctx);

    // Test with missing required fields
    await expect(
      caller.stripe.createCheckoutSession({
        sessionTypeId: 1,
        scheduledDate: new Date().toISOString(),
        notes: '',
      })
    ).rejects.toThrow();
  });
});

describe('Dashboard Data', () => {
  it('should have getCoachSessions procedure', () => {
    expect(appRouter.scheduling.getCoachSessions).toBeDefined();
  });

  it('should have clients list procedure', () => {
    expect(appRouter.clients.list).toBeDefined();
  });
});
