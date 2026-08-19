import {TarotCard} from "../arrays-&-models/tarot-deck-array/tarotCard.interface";
import {cardsDeck} from "../arrays-&-models/tarot-deck-array/tarotDeck";
import axios from "axios";
import {DeckActionType, deckStore} from "../state/deck-state";
class DeckService {

    constructor(
        public tarotCardsDetails: [] = []
    ) {}


    async getTarotDetails(): Promise<any> {
        const url = "https://tarotapi.dev/api/v1/cards";
        try {
            const response = await axios.get(url);
            deckStore.dispatch({type: DeckActionType.GetCardsDeck, payload: response.data});
            this.tarotCardsDetails = response.data.cards;
            console.log("success");
        } catch (error) {
            console.error("The error:", error);
        }
        console.log(deckStore.getState().tarotDeckList);
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

    spreadThem(): [TarotCard[], boolean] {
        const shuffled: TarotCard[] = this.spreadThemShuffle();
        const chosen: TarotCard[] = shuffled.slice(0, 10);

        console.log("Dealt 10 cards:", chosen.map((card: TarotCard): string => card.name));

        return [chosen, true];
    };

    clearSpread(bool: string, arr: string): boolean{
        console.log("Clearing spread");
        localStorage.removeItem(bool);
        localStorage.removeItem(arr);
        return false;
    };
}

export const deckService = new DeckService();