import {ITarotCard} from "../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {cardsDeck} from "../arrays-&-models/tarot-deck-array/tarotDeck";
import {riderWaiteCards} from "../data/riderWaite";
import {TarotCardData} from "../arrays-&-models/TarotCardData.model";
import {DeckActionType, deckStore} from "../state/deck-state";
class DeckService {

    constructor(
        public tarotCardsDetails: TarotCardData[] = riderWaiteCards
    ) {}


    async getTarotDetails(): Promise<TarotCardData[]> {
        deckStore.dispatch({type: DeckActionType.GetCardsDeck, payload: riderWaiteCards});
        return deckStore.getState().tarotDeckList;
    }


    spreadThemShuffle(): ITarotCard[] {
        const shuffledDeck: ITarotCard[] = [...cardsDeck];
        for (let i: number = shuffledDeck.length - 1 ; i >= 0 ; i--) {
            let j: number = Math.floor(Math.random() * (i + 1));
            [shuffledDeck[j], shuffledDeck[i]] = [shuffledDeck[i], shuffledDeck[j]];
        }
        return shuffledDeck;
    };

    spreadMajorArcanaShuffle(): ITarotCard[] {
        const majorArcana: ITarotCard[] = cardsDeck.slice(0, 22);
        const shuffled: ITarotCard[] = [...majorArcana];
        for (let i = shuffled.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[j], shuffled[i]] = [shuffled[i], shuffled[j]];
        }
        return shuffled;
    };

    clearSpread(bool: string, arr: string): boolean{
        localStorage.removeItem(bool);
        localStorage.removeItem(arr);
        return false;
    };
}

export const deckService = new DeckService();