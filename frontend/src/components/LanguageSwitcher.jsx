import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    // i18n.language might be 'en-US' or 'en-GB' because of the language detector.
    // We check if it starts with 'en' or default to 'hi' if it's currently English.
    const isEnglish = i18n.language && i18n.language.startsWith('en');
    const newLang = isEnglish ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const isEnglish = i18n.language && i18n.language.startsWith('en');

  return (
    <button
      onClick={toggleLanguage}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        backgroundColor: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 9999,
        fontWeight: 'bold'
      }}
    >
      {isEnglish ? 'हिंदी में देखें' : 'View in English'}
    </button>
  );
};

export default LanguageSwitcher;

