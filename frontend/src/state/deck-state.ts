// Step 1

import {TarotCardFromApi} from "../arrays-&-models/TarotCardFromApi.model";
import { createStore } from 'redux';

export class DeckState {
    tarotDeckList: TarotCardFromApi[] = [];
}

// Step 2
export enum DeckActionType {
    GetCardsDeck = "GetCardsDeck"
}

// Step 3
export interface DeckAction {
    type: DeckActionType,
    payload: any,
}


// Step 4
export function deckReducer(deckState: DeckState = new DeckState(), action: DeckAction): DeckState {

    const newState: DeckState = {...deckState};
    newState.tarotDeckList = [...newState.tarotDeckList];

    switch (action.type) {
        case DeckActionType.GetCardsDeck:
            newState.tarotDeckList = action.payload;
            break;
    }

    return newState;
}

// Step 5
export const deckStore = createStore(deckReducer);
