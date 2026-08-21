import { createStore } from 'redux';

export type Lang = 'en' | 'he';

export interface LangState {
    lang: Lang;
}

export enum LangActionType {
    Toggle = 'Toggle',
    Set = 'Set',
}

export interface LangAction {
    type: LangActionType;
    lang?: Lang;
}

function langReducer(state: LangState = { lang: 'en' }, action: LangAction): LangState {
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
