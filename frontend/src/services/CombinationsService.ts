import axios from "axios";

export interface ICombinationMatch {
    cards: string[];
    meaning: string;
    source: "general" | "health";
    category: string;
}

type Adjacency = Record<number, number[]>;

// Celtic Cross: positions 0-5 form a fully-connected cross cluster;
// positions 6-9 form a linear staff; position 5 bridges cross to staff.
export const CELTIC_ADJACENCY: Adjacency = {
    0: [1, 2, 3, 4, 5],
    1: [0, 2, 3, 4, 5],
    2: [0, 1, 3, 4, 5],
    3: [0, 1, 2, 4, 5],
    4: [0, 1, 2, 3, 5],
    5: [0, 1, 2, 3, 4, 6],
    6: [5, 7],
    7: [6, 8],
    8: [7, 9],
    9: [8],
};

// Three Cards: linear chain 0 ↔ 1 ↔ 2
export const THREE_CARDS_ADJACENCY: Adjacency = {
    0: [1],
    1: [0, 2],
    2: [1],
};

function isConnectedInSpread(comboCards: string[], spreadCards: any[], adjacency: Adjacency): boolean {
    const positions: number[] = [];
    for (const cardName of comboCards) {
        const idx = spreadCards.findIndex(
            c => c.name.replace(/ Rx$/i, '').toLowerCase() === cardName.replace(/ Rx$/i, '').toLowerCase()
        );
        if (idx === -1) return false;
        positions.push(idx);
    }
    if (positions.length <= 1) return true;

    const posSet = new Set(positions);
    const visited = new Set<number>();
    const queue = [positions[0]];
    visited.add(positions[0]);
    while (queue.length > 0) {
        const curr = queue.shift()!;
        for (const neighbor of (adjacency[curr] ?? [])) {
            if (posSet.has(neighbor) && !visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return visited.size === posSet.size;
}

export function filterByProximity(matches: ICombinationMatch[], spreadCards: any[], adjacency: Adjacency): ICombinationMatch[] {
    return matches.filter(match => isConnectedInSpread(match.cards, spreadCards, adjacency));
}

const BASE_URL = "http://localhost:4000";

class CombinationsService {
    async checkCombinations(cardNames: string[], question?: string): Promise<ICombinationMatch[]> {
        const response = await axios.post(`${BASE_URL}/api/tarot/check-combinations`, { cardNames, question });
        return response.data;
    }
}

export const combinationsService = new CombinationsService();
