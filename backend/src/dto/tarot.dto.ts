export interface ISpreadCard {
    name: string;
    position: string;
    meaning_up: string;
    desc: string;
}

export interface IInterpretRequest {
    spreadType: "celtic" | "three-cards";
    language?: "en" | "he";
    question?: string;
    cards: ISpreadCard[];
}
