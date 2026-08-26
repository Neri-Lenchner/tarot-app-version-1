import { createStore } from 'redux';
import { useEffect, useState } from 'react';

export type Lang = 'en' | 'he';

export interface ILangState {
    lang: Lang;
}

export enum LangActionType {
    Toggle = 'Toggle',
    Set = 'Set',
}

export interface ILangAction {
    type: LangActionType;
    lang?: Lang;
}

// No persistence previously — langStore defaulted to 'en' on every fresh
// mount (including a logout/login, which is a full app remount), silently
// reverting the whole app to English even for a user who'd been reading in
// Hebrew. Restoring the last choice here is what makes a re-login actually
// keep it.
function loadPersistedLang(): Lang {
    const raw = localStorage.getItem('lang');
    return raw === 'he' ? 'he' : 'en';
}

function langReducer(state: ILangState = { lang: loadPersistedLang() }, action: ILangAction): ILangState {
    switch (action.type) {
        case LangActionType.Toggle:
            return { lang: state.lang === 'en' ? 'he' : 'en' };
        case LangActionType.Set:
            return { lang: action.lang ?? state.lang };
        default:
            return state;
    }
}

export const langStore = createStore(langReducer);

langStore.subscribe(() => {
    localStorage.setItem('lang', langStore.getState().lang);
});

// Subscribes a component to the global language, re-rendering it whenever
// the header's HE/EN toggle (or any other langStore dispatch) fires.
export function useLang(): Lang {
    const [lang, setLang] = useState<Lang>(langStore.getState().lang);
    useEffect(() => {
        const unsubscribe = langStore.subscribe(() => setLang(langStore.getState().lang));
        return unsubscribe;
    }, []);
    return lang;
}
