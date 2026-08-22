import { createContext, useContext, useState, useMemo, useCallback, ReactNode, JSX } from 'react';

type Language = 'en' | 'he';

interface ILanguageContextValue {
    language: Language;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<ILanguageContextValue>({
    language: 'en',
    toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
    const [language, setLanguage] = useState<Language>('en');
    const toggleLanguage = useCallback(() => setLanguage(l => (l === 'en' ? 'he' : 'en')), []);
    const value = useMemo(() => ({ language, toggleLanguage }), [language, toggleLanguage]);
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): ILanguageContextValue {
    return useContext(LanguageContext);
}
