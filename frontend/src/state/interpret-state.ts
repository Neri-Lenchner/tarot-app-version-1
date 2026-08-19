import { createStore } from 'redux';

// Step 1
export class InterpretState {
    en: string | null = null;
    he: string | null = null;
}

// Step 2
export enum InterpretActionType {
    SetBoth = "SetBoth",
    Clear = "Clear",
}

// Step 3
export interface InterpretAction {
    type: InterpretActionType;
    payload?: { en: string; he: string };
}

// Step 4
export function interpretReducer(
    state: InterpretState = new InterpretState(),
    action: InterpretAction
): InterpretState {
    switch (action.type) {
        case InterpretActionType.SetBoth:
            return { ...state, en: action.payload!.en, he: action.payload!.he };
        case InterpretActionType.Clear:
            return new InterpretState();
        default:
            return state;
    }
}

// Step 5
export const interpretStore = createStore(interpretReducer);
