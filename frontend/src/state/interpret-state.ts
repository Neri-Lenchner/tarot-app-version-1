import { createStore } from 'redux';

// Step 1
export type SpreadType = 'celtic' | 'three-cards';

export interface ISpreadInterpretation {
    en: string | null;
    he: string | null;
}

export class InterpretState {
    celtic: ISpreadInterpretation = { en: null, he: null };
    'three-cards': ISpreadInterpretation = { en: null, he: null };
}

// Step 2
export enum IInterpretActionType {
    SetBoth = 'SetBoth',
    Clear = 'Clear',
}

// Step 3
export interface IInterpretAction {
    type: IInterpretActionType;
    spreadType: SpreadType;
    payload?: { en: string; he: string };
}

// Step 4
export function interpretReducer(
    state: InterpretState = new InterpretState(),
    action: IInterpretAction
): InterpretState {
    switch (action.type) {
        case IInterpretActionType.SetBoth:
            return { ...state, [action.spreadType]: action.payload };
        case IInterpretActionType.Clear:
            return { ...state, [action.spreadType]: { en: null, he: null } };
        default:
            return state;
    }
}

// Step 5
export const interpretStore = createStore(interpretReducer);
