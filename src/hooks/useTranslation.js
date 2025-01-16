'use client';

import { useRouter } from 'next/navigation';

import en from '@/locales/en/common.json';
import tr from '@/locales/tr/common.json';
import de from '@/locales/de/common.json';

const translations = {
  en,
  tr,
  de,
};

const useTranslation = () => {
  const router = useRouter();
  const locale = "tr"
  const t = (key) => translations[locale]?.[key] || key;
  return { t, locale };
};

export default useTranslation;
