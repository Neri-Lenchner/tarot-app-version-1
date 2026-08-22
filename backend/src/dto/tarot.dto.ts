export interface ISpreadCard {
    name: string;
    position: string;
}

export interface IInterpretRequest {
    spreadType: "celtic" | "three-cards";
    language?: "en" | "he";
    question?: string;
    isThirdPerson?: boolean;
    cards: ISpreadCard[];
}

export interface ICombinationMatch {
    cards: string[];
    meaning: string;
    meaning_he: string;
    source: "general" | "health";
    category: string;
    category_he: string;
}
