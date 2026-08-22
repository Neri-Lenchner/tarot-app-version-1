import { createStore } from 'redux';

export type Lang = 'en' | 'he';

export interface ILangState {
    lang: Lang;
}

export enum ILangActionType {
    Toggle = 'Toggle',
    Set = 'Set',
}

export interface ILangAction {
    type: ILangActionType;
    lang?: Lang;
}

function langReducer(state: ILangState = { lang: 'en' }, action: ILangAction): ILangState {
    switch (action.type) {
        case ILangActionType.Toggle:
            return { lang: state.lang === 'en' ? 'he' : 'en' };
        case ILangActionType.Set:
            return { lang: action.lang ?? state.lang };
        default:
            return state;
    }
}

export const langStore = createStore(langReducer);
