'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

import { supportedLocales, type SupportedLocale } from '@/i18n/negotiate';

const DEFAULT_LOCALE: SupportedLocale = 'en';
const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === 'string' && (supportedLocales as readonly string[]).includes(value);
}

function writeLocaleCookie(locale: SupportedLocale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`;
}

function readLocaleCookie(): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const localeLabels: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
};

/**
 * Language selector component that allows users to switch between supported
 * locales. Persists the choice in the `NEXT_LOCALE` cookie -- the convention
 * `next-intl`'s `getLocale()` reads server-side -- then refreshes the router
 * so the server re-renders with the new locale. Only locales from the i18n
 * `supportedLocales` list are accepted; an unsupported persisted value is
 * silently replaced with the default (`en`).
 */
export function LanguageSelector() {
  const locale = useLocale() as SupportedLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const persisted = readLocaleCookie();
    if (persisted !== undefined && !isSupportedLocale(persisted)) {
      writeLocaleCookie(DEFAULT_LOCALE);
    }
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    if (!isSupportedLocale(newLocale) || newLocale === locale) return;

    startTransition(() => {
      writeLocaleCookie(newLocale);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      {supportedLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          disabled={isPending}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            locale === loc
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={`Switch to ${localeLabels[loc]}`}
          title={localeLabels[loc]}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
