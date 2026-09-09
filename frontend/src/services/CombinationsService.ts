import axios from "axios";
import { ITarotCard } from "../arrays-&-models/tarot-deck-array/tarotCard.interface";
import { ICombinationMatch } from "../arrays-&-models/combinationMatch.interface";

type Adjacency = Record<number, number[]>;

export const CELTIC_ADJACENCY: Adjacency = {
    0: [1, 2, 3, 4, 5],
    1: [0, 2, 3, 4, 5],
    2: [0, 1, 3, 6, 7, 8],
    3: [0, 1, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 2, 4, 9],
    6: [7, 2],
    7: [2, 6, 8],
    8: [2, 7, 9],
    9: [8, 5],
};

// Three Cards: linear chain 0 ↔ 1 ↔ 2
export const THREE_CARDS_ADJACENCY: Adjacency = {
    0: [1],
    1: [0, 2],
    2: [1],
};

// Master Spread: 3x3 story grid (0-8, row-major — Past/Present/Future rows,
// each read left-to-right) plus Potential (9), which connects only to
// Future-End (8) — mirroring how Celtic's Potential links to Far Future.
// Mirrors backend/src/utils/prompt-constants.ts MASTER_ADJACENCY — keep in sync.
export const MASTER_ADJACENCY: Adjacency = {
    0: [1, 3, 4],
    1: [0, 2, 3, 4, 5],
    2: [1, 4, 5],
    3: [0, 1, 4, 6, 7],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [1, 2, 4, 7, 8],
    6: [3, 4, 7],
    7: [3, 4, 5, 6, 8],
    8: [4, 5, 7, 9],
    9: [8],
};

function isConnectedInSpread(comboCards: string[], spreadCards: ITarotCard[], adjacency: Adjacency): boolean {
    const positions: number[] = [];
    for (const cardName of comboCards) {
        const idx: number = spreadCards.findIndex(
            card => card.name.replace(/ Rx$/i, '').toLowerCase() === cardName.replace(/ Rx$/i, '').toLowerCase()
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

export function filterByProximity(matches: ICombinationMatch[], spreadCards: ITarotCard[], adjacency: Adjacency): ICombinationMatch[] {
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
