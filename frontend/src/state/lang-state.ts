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

function langReducer(state: ILangState = { lang: 'en' }, action: ILangAction): ILangState {
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
