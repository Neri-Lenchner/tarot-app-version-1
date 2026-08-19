import { createStore } from 'redux';

// Step 1
export type SpreadType = 'celtic' | 'three-cards';

export interface SpreadInterpretation {
    en: string | null;
    he: string | null;
}

export class InterpretState {
    celtic: SpreadInterpretation = { en: null, he: null };
    'three-cards': SpreadInterpretation = { en: null, he: null };
}

// Step 2
export enum InterpretActionType {
    SetBoth = 'SetBoth',
    Clear = 'Clear',
}

// Step 3
export interface InterpretAction {
    type: InterpretActionType;
    spreadType: SpreadType;
    payload?: { en: string; he: string };
}

// Step 4
export function interpretReducer(
    state: InterpretState = new InterpretState(),
    action: InterpretAction
): InterpretState {
    switch (action.type) {
        case InterpretActionType.SetBoth:
            return { ...state, [action.spreadType]: action.payload };
        case InterpretActionType.Clear:
            return { ...state, [action.spreadType]: { en: null, he: null } };
        default:
            return state;
    }
}

// Step 5
export const interpretStore = createStore(interpretReducer);
