import {TarotCard} from "../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {cardsDeck} from "../arrays-&-models/tarot-deck-array/tarotDeck";
import {riderWaiteCards} from "../data/riderWaite";
import {DeckActionType, deckStore} from "../state/deck-state";
class DeckService {

    constructor(
        public tarotCardsDetails: any[] = riderWaiteCards
    ) {}


    async getTarotDetails(): Promise<any> {
        deckStore.dispatch({type: DeckActionType.GetCardsDeck, payload: riderWaiteCards});
        return deckStore.getState().tarotDeckList;
    }


    spreadThemShuffle(): TarotCard[] {
        const shuffledDeck: TarotCard[] = [...cardsDeck];
        for (let i: number = shuffledDeck.length - 1 ; i >= 0 ; i--) {
            let j: number = Math.floor(Math.random() * (i + 1));
            [shuffledDeck[j], shuffledDeck[i]] = [shuffledDeck[i], shuffledDeck[j]];
        }
        return shuffledDeck;
    };

    spreadThem(count: number = 10): [TarotCard[], boolean] {
        const shuffled: TarotCard[] = this.spreadThemShuffle();
        const chosen: TarotCard[] = shuffled.slice(0, count);
        return [chosen, true];
    };

    spreadMajorArcana(count: number = 3): [TarotCard[], boolean] {
        const majorArcana: TarotCard[] = cardsDeck.slice(0, 22);
        const shuffled: TarotCard[] = [...majorArcana];
        for (let i = shuffled.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[j], shuffled[i]] = [shuffled[i], shuffled[j]];
        }
        return [shuffled.slice(0, count), true];
    };

    clearSpread(bool: string, arr: string): boolean{
        console.log("Clearing spread");
        localStorage.removeItem(bool);
        localStorage.removeItem(arr);
        return false;
    };
}

export const deckService = new DeckService();