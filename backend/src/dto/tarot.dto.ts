export interface ISpreadCard {
    name: string;
    position: string;
}

export interface IInterpretRequest {
    spreadType: "celtic" | "three-cards";
    language?: "en" | "he";
    question?: string;
    cards: ISpreadCard[];
}
