import { createStore } from 'redux';
import { ISpreadInterpretation } from '../arrays-&-models/SpreadInterpretation.model';
import { interpretService } from '../services/InterpretService';

export type { ISpreadInterpretation };

// Step 1
export type SpreadType = 'celtic' | 'three-cards' | 'master-spread';

// Unlike selectedCards/isSpread (persisted per spread page), this store had
// no localStorage backing at all — a hard refresh (not in-app navigation,
// which never touches it) silently wiped every reading, which is also what
// left ConclusionModal with nothing to show and no way to reopen.
function loadPersistedInterpretation(spreadType: SpreadType): Pick<ISpreadInterpretation, 'en' | 'he' | 'followupQ' | 'followupAnswer'> {
    try {
        const raw = localStorage.getItem(`interpretation-${spreadType}`);
        if (!raw) return { en: null, he: null, followupQ: null, followupAnswer: null };
        const parsed = JSON.parse(raw);
        return {
            en: parsed.en ?? null,
            he: parsed.he ?? null,
            followupQ: parsed.followupQ ?? null,
            followupAnswer: parsed.followupAnswer ?? null,
        };
    } catch {
        return { en: null, he: null, followupQ: null, followupAnswer: null };
    }
}

export class InterpretState {
    celtic: ISpreadInterpretation = { heLoading: false, requestId: 0, ...loadPersistedInterpretation('celtic') };
    'three-cards': ISpreadInterpretation = { heLoading: false, requestId: 0, ...loadPersistedInterpretation('three-cards') };
    'master-spread': ISpreadInterpretation = { heLoading: false, requestId: 0, ...loadPersistedInterpretation('master-spread') };
}

// Step 2
export enum InterpretActionType {
    BeginInterpret = 'BeginInterpret',
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
        case InterpretActionType.BeginInterpret:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], he: null, heLoading: false, heFailed: false, requestId: (state[action.spreadType].requestId ?? 0) + 1 } };
        case InterpretActionType.SetEnglish:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], en: action.payload!.en!, he: null, heLoading: false, heFailed: false, followupQ: null, followupAnswer: null } };
        case InterpretActionType.SetHebrewLoading:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], heLoading: true, heFailed: false } };
        case InterpretActionType.SetHebrew:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], he: action.payload!.he!, heLoading: false, heFailed: false } };
        case InterpretActionType.SetHebrewFailed:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], heLoading: false, heFailed: true } };
        case InterpretActionType.Clear:
            return { ...state, [action.spreadType]: { en: null, he: null, heLoading: false, heFailed: false, followupQ: null, followupAnswer: null, requestId: (state[action.spreadType].requestId ?? 0) + 1 } };
        case InterpretActionType.SetFollowup:
            return { ...state, [action.spreadType]: { ...state[action.spreadType], followupQ: action.followup!.question, followupAnswer: action.followup!.answer } };
        default:
            return state;
    }
}

// Step 5
export const interpretStore = createStore(interpretReducer);

// Mirrors en/he/followup into localStorage on every change so a hard
// refresh doesn't lose a reading that's already been paid for (heLoading/
// heFailed/requestId are transient/session-only and deliberately excluded).
interpretStore.subscribe(() => {
    const state = interpretStore.getState();
    (['celtic', 'three-cards', 'master-spread'] as SpreadType[]).forEach(spreadType => {
        const { en, he, followupQ, followupAnswer } = state[spreadType];
        localStorage.setItem(`interpretation-${spreadType}`, JSON.stringify({ en, he, followupQ, followupAnswer }));
    });
});

// Fetches the Hebrew translation for a spread's English reading, on demand.
// Safe to call from multiple components at once — it re-checks the live
// store state before dispatching, so only the first caller actually fetches.
export async function ensureHebrewTranslation(spreadType: SpreadType): Promise<void> {
    const current = interpretStore.getState()[spreadType];
    if (current.en === null || current.he !== null || current.heLoading) return;

    const myRequestId = current.requestId;
    interpretStore.dispatch({ type: InterpretActionType.SetHebrewLoading, spreadType });
    try {
        const he = await interpretService.translateToHebrew(current.en);
        // Only commit if nothing superseded this request (a fresh interpret
        // or a Clear) while the translation was in flight.
        if (interpretStore.getState()[spreadType].requestId === myRequestId) {
            interpretStore.dispatch({ type: InterpretActionType.SetHebrew, spreadType, payload: { he } });
        }
    } catch {
        if (interpretStore.getState()[spreadType].requestId === myRequestId) {
            interpretStore.dispatch({ type: InterpretActionType.SetHebrewFailed, spreadType });
        }
    }
}

// Like ensureHebrewTranslation, but resolves with the Hebrew text once it's
// ready — starting the fetch if none is in flight, or simply waiting for an
// already-in-flight one (e.g. triggered by toggling the language) to finish.
export function waitForHebrewTranslation(spreadType: SpreadType): Promise<string> {
    const state = interpretStore.getState()[spreadType];
    if (state.he !== null) return Promise.resolve(state.he);
    if (state.en === null) return Promise.reject(new Error('No English reading to translate yet'));

    // Pinned so a BeginInterpret/Clear fired by the user while this promise
    // is still waiting (e.g. confirming a combination mid-save) is detected
    // as "this reading got superseded" instead of the requestId-agnostic
    // he===null/heLoading===false state that a fresh SetEnglish briefly
    // passes through looking exactly like a failed translation.
    const myRequestId = state.requestId;

    if (!state.heLoading) {
        void ensureHebrewTranslation(spreadType);
    }

    return new Promise<string>((resolve, reject) => {
        const unsubscribe = interpretStore.subscribe(() => {
            const latest = interpretStore.getState()[spreadType];
            if (latest.requestId !== myRequestId) {
                unsubscribe();
                reject(new Error('Spread changed before translation finished'));
                return;
            }
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
