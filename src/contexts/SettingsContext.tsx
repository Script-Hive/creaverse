import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'mr';

interface SettingsContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    settings: 'Settings',
    profile: 'Profile',
    appearance: 'Appearance',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    themeDescription: 'Switch between light and dark appearance',
    notifications: 'Notifications',
    pushNotifications: 'Push Notifications',
    notificationsDescription: 'Receive notifications about activity on your posts',
    language: 'Language',
    languageDescription: 'Choose your preferred language',
    english: 'English',
    marathi: 'मराठी',
    about: 'About',
    appVersion: 'App Version',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    logout: 'Logout',
    logoutDescription: 'Sign out of your account',
  },
  mr: {
    settings: 'सेटिंग्ज',
    profile: 'प्रोफाइल',
    appearance: 'दृश्य',
    theme: 'थीम',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    themeDescription: 'लाइट आणि डार्क थीम मध्ये बदला',
    notifications: 'सूचना',
    pushNotifications: 'पुश सूचना',
    notificationsDescription: 'तुमच्या पोस्टवरील क्रियाकलापांबद्दल सूचना प्राप्त करा',
    language: 'भाषा',
    languageDescription: 'तुमची पसंतीची भाषा निवडा',
    english: 'English',
    marathi: 'मराठी',
    about: 'बद्दल',
    appVersion: 'अॅप आवृत्ती',
    termsOfService: 'सेवा अटी',
    privacyPolicy: 'गोपनीयता धोरण',
    logout: 'लॉगआउट',
    logoutDescription: 'तुमच्या खात्यातून साइन आउट करा',
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('creaverse-theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [notificationsEnabled, setNotificationsEnabledState] = useState(() => {
    const saved = localStorage.getItem('creaverse-notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('creaverse-language');
    return (saved as Language) || 'en';
  });

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('creaverse-theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem('creaverse-notifications', JSON.stringify(enabled));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('creaverse-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Apply theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        notificationsEnabled,
        setNotificationsEnabled,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
