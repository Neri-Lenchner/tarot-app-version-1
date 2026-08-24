import { createStore } from 'redux';
import { ISpreadInterpretation } from '../arrays-&-models/SpreadInterpretation.model';
import { interpretService } from '../services/InterpretService';

export type { ISpreadInterpretation };

// Step 1
export type SpreadType = 'celtic' | 'three-cards';

export class InterpretState {
    celtic: ISpreadInterpretation = { en: null, he: null, heLoading: false };
    'three-cards': ISpreadInterpretation = { en: null, he: null, heLoading: false };
}

// Step 2
export enum InterpretActionType {
    SetEnglish = 'SetEnglish',
    SetHebrew = 'SetHebrew',
    SetHebrewLoading = 'SetHebrewLoading',
    SetHebrewFailed = 'SetHebrewFailed',
    Clear = 'Clear',
    SetFollowup = 'SetFollowup',
}

// Step 3
export interface IInterpretAction {
    type: InterpretActionType;
    spreadType: SpreadType;
    payload?: { en?: string; he?: string };
    followup?: { question: string; answer: string };
}

// Step 4
export function interpretReducer(
    state: InterpretState = new InterpretState(),
    action: IInterpretAction
): InterpretState {
    switch (action.type) {
        case InterpretActionType.SetEnglish:
            return { ...state, [action.spreadType]: { en: action.payload!.en!, he: null, heLoading: false, followupQ: null, followupAnswer: null } };
        case InterpretActionType.SetHebrewLoading:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], heLoading: true } };
        case InterpretActionType.SetHebrew:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], he: action.payload!.he!, heLoading: false } };
        case InterpretActionType.SetHebrewFailed:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], heLoading: false } };
        case InterpretActionType.Clear:
            return { ...state, [action.spreadType]: { en: null, he: null, heLoading: false, followupQ: null, followupAnswer: null } };
        case InterpretActionType.SetFollowup:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], followupQ: action.followup!.question, followupAnswer: action.followup!.answer } };
        default:
            return state;
    }
}

// Step 5
export const interpretStore = createStore(interpretReducer);

// Fetches the Hebrew translation for a spread's English reading, on demand.
// Safe to call from multiple components at once — it re-checks the live
// store state before dispatching, so only the first caller actually fetches.
export async function ensureHebrewTranslation(spreadType: SpreadType): Promise<void> {
    const current = interpretStore.getState()[spreadType];
    if (current.en === null || current.he !== null || current.heLoading) return;

    interpretStore.dispatch({ type: InterpretActionType.SetHebrewLoading, spreadType });
    try {
        const he = await interpretService.translateToHebrew(current.en);
        interpretStore.dispatch({ type: InterpretActionType.SetHebrew, spreadType, payload: { he } });
    } catch {
        interpretStore.dispatch({ type: InterpretActionType.SetHebrewFailed, spreadType });
    }
}

// Like ensureHebrewTranslation, but resolves with the Hebrew text once it's
// ready — starting the fetch if none is in flight, or simply waiting for an
// already-in-flight one (e.g. triggered by toggling the language) to finish.
export function waitForHebrewTranslation(spreadType: SpreadType): Promise<string> {
    const state = interpretStore.getState()[spreadType];
    if (state.he !== null) return Promise.resolve(state.he);
    if (state.en === null) return Promise.reject(new Error('No English reading to translate yet'));

    if (!state.heLoading) {
        void ensureHebrewTranslation(spreadType);
    }

    return new Promise<string>((resolve, reject) => {
        const unsubscribe = interpretStore.subscribe(() => {
            const latest = interpretStore.getState()[spreadType];
            if (latest.he !== null) {
                unsubscribe();
                resolve(latest.he);
            } else if (!latest.heLoading) {
                unsubscribe();
                reject(new Error('Hebrew translation failed'));
            }
        });
    });
}
