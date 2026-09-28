'use client';

import { useLocale } from 'next-intl';

type SupportedLocale = 'en' | 'es';

const localeLabels: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
};

function persistLocale(locale: SupportedLocale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
}

/**
 * Language selector component that allows users to switch between supported
 * locales. Persists the choice in the `NEXT_LOCALE` cookie -- the convention
 * the server reads -- then reloads the document so the server renders the
 * page and its locale together before hydration.
 */
export function LanguageSelector() {
  const locale = useLocale() as SupportedLocale;

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    if (newLocale === locale) return;

    persistLocale(newLocale);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      {(['en', 'es'] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            locale === loc
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={`Switch to ${localeLabels[loc]}`}
          title={localeLabels[loc]}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
