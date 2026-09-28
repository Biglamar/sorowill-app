import { describe, expect, it, vi, beforeEach } from 'vitest';
const register = vi.fn(); const confirm = vi.fn(); const unsubscribe = vi.fn(); const getWill = vi.fn();
vi.mock('@/lib/reminders', () => ({ registerReminderSubscription: register, confirmReminderSubscription: confirm, unsubscribeReminderSubscription: unsubscribe }));
vi.mock('@/lib/sorowill', () => ({ getSoroWillClient: () => ({ getWill }) }));
vi.mock('viem', () => ({ verifyMessage: vi.fn().mockResolvedValue(true) }));
import { POST as registerRoute } from '@/app/api/reminders/register/route';
import { GET as confirmRoute } from '@/app/api/reminders/confirm/route';
import { POST as unsubscribeRoute } from '@/app/api/reminders/unsubscribe/route';

describe('reminder routes', () => {
  beforeEach(() => { vi.clearAllMocks(); getWill.mockResolvedValue({ id: '1' }); register.mockResolvedValue({ ok: true }); confirm.mockResolvedValue({ ok: true }); unsubscribe.mockResolvedValue({ ok: true }); });
  it('rejects invalid registration bodies', async () => { const response = await registerRoute(new Request('http://localhost/api/reminders/register', { method: 'POST', body: '{}' })); expect(response.status).toBe(400); });
  it('registers a valid subscription', async () => { const response = await registerRoute(new Request('http://localhost/api/reminders/register', { method: 'POST', body: JSON.stringify({ willId: '1', email: 'a@example.com', owner: '0xabc', signature: '0xsig', message: 'hello' }), headers: { 'content-type': 'application/json' } })); expect(response.status).toBe(200); expect(register).toHaveBeenCalled(); });
  it('confirms and unsubscribes valid tokens', async () => { expect((await confirmRoute(new Request('http://localhost/api/reminders/confirm?token=ok'))).status).toBe(200); expect((await unsubscribeRoute(new Request('http://localhost/api/reminders/unsubscribe?token=ok'))).status).toBe(200); });
});
