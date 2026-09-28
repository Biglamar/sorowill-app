import Link from 'next/link';
import { useTranslations } from 'next-intl';

const faqItemKeys = [
  'howItWorks',
  'missedCheckIn',
  'updateBeneficiaries',
  'cancelWill',
  'guardians',
  'recoverFunds',
  'supportedTokens',
  'trustless',
  'willPrivacy',
  'lostWallet',
  'beneficiaryStatus',
  'willSafety',
  'federatedAddresses',
  'deadlineReminder',
  'fees',
  'claimInheritance',
] as const;

const lifecycleStepKeys = ['create', 'checkins', 'miss', 'grace', 'release'] as const;

export default function FAQPage() {
  const t = useTranslations('faq');

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-8 sm:py-16 sm:px-0">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-will-light sm:text-4xl">
          {t('title')}
        </h1>
        <p className="text-lg text-will-light/70">{t('subtitle')}</p>
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-will-light">{t('lifecycle.heading')}</h2>
          <p className="text-sm text-will-light/60">{t('lifecycle.description')}</p>
        </div>

        <div className="space-y-6">
          {lifecycleStepKeys.map((stepKey, index) => (
            <div key={stepKey} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <span className="font-mono text-sm font-semibold text-will-purple">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-semibold text-will-light">{t(`lifecycle.steps.${stepKey}.title`)}</h3>
                <p className="mt-1 text-sm text-will-light/60">
                  {t(`lifecycle.steps.${stepKey}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-will-light">{t('faqHeading')}</h2>

        <div className="space-y-4">
          {faqItemKeys.map((itemKey) => (
            <details
              key={itemKey}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all [&[open]]:bg-white/10"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-will-light hover:text-white">
                <span>{t(`items.${itemKey}.question`)}</span>
                <span className="ml-2 text-will-purple">{/* + */}▸</span>
              </summary>
              <p className="mt-4 text-sm text-will-light/70">{t(`items.${itemKey}.answer`)}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <h2 className="text-xl font-semibold text-will-light">{t('cta.title')}</h2>
        <p className="mt-2 text-sm text-will-light/60">{t('cta.description')}</p>
        <Link
          href="/will/new"
          className="mt-4 inline-block rounded-full bg-will-purple px-6 py-3 text-sm font-semibold text-white transition hover:bg-will-purple/90"
        >
          {t('cta.button')}
        </Link>
      </section>
    </div>
  );
}
