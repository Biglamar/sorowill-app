import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageSelector } from '@/components/LanguageSelector';

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('LanguageSelector (#84, #242, #249, #254)', () => {
  it('renders language switch buttons for EN and ES', () => {
    render(<LanguageSelector />);
    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to español/i })).toBeInTheDocument();
  });

  it('sets NEXT_LOCALE cookie and reloads the document on switch', () => {
    render(<LanguageSelector />);
    const esButton = screen.getByRole('button', { name: /switch to español/i });
    const mockReload = vi.fn();
    const windowWithMockReload = new Proxy(window, {
      get(target, property) {
        if (property === 'location') return { reload: mockReload };
        return Reflect.get(target, property, target);
      },
    });
    vi.stubGlobal('window', windowWithMockReload);

    try {
      fireEvent.click(esButton);

      expect(document.cookie).toContain('NEXT_LOCALE=es');
      expect(mockReload).toHaveBeenCalledOnce();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
