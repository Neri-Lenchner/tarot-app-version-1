// Step 1

import {TarotCardData} from "../arrays-&-models/TarotCardData.model";
import { createStore } from 'redux';

export class DeckState {
    tarotDeckList: TarotCardData[] = [];
}

// Step 2
export enum IDeckActionType {
    GetCardsDeck = "GetCardsDeck"
}

// Step 3
export interface IDeckAction {
    type: IDeckActionType,
    payload: any,
}


// Step 4
export function deckReducer(deckState: DeckState = new DeckState(), action: IDeckAction): DeckState {

    const newState: DeckState = {...deckState};
    newState.tarotDeckList = [...newState.tarotDeckList];

    switch (action.type) {
        case IDeckActionType.GetCardsDeck:
            newState.tarotDeckList = action.payload;
            break;
    }

    return newState;
}

// Step 5
export const deckStore = createStore(deckReducer);
