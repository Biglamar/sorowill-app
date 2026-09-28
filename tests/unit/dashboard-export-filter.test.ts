import { describe, expect, it } from 'vitest';
import { filterWills } from '@/app/dashboard/page';
describe('dashboard export filtering', () => { it('exports only the active filtered list', () => { const wills = [{ id: '1', status: 'Active', beneficiaries: [{ address: 'GABC', percentage: 100 }] }, { id: '2', status: 'Cancelled', beneficiaries: [{ address: 'GDEF', percentage: 100 }] }] as never[]; expect(filterWills(wills, '', 'Active')).toHaveLength(1); expect(filterWills(wills, '2', 'all')).toHaveLength(1); }); });
