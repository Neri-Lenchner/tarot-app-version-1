export interface ISpreadCard {
    name: string;
    position: string;
}

export interface IInterpretRequest {
    spreadType: "celtic" | "three-cards";
    language?: "en" | "he";
    question?: string;
    isThirdPerson?: boolean;
    confirmedCombination?: ICombinationMatch;
    cards: ISpreadCard[];
    gender?: "male" | "female";
}

export interface ICombinationMatch {
    cards: string[];
    meaning: string;
    meaning_he: string;
    source: "general" | "health";
    category: string;
    category_he: string;
}
