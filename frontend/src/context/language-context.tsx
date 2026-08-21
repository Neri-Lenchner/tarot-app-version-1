import { createContext, useContext, useState, ReactNode, JSX } from 'react';

type Language = 'en' | 'he';

interface LanguageContextValue {
    language: Language;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
    language: 'en',
    toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
    const [language, setLanguage] = useState<Language>('en');
    const toggleLanguage = () => setLanguage(l => (l === 'en' ? 'he' : 'en'));
    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    return useContext(LanguageContext);
}
