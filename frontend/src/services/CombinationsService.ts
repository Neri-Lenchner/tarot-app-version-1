import axios from "axios";

export interface ICombinationMatch {
    cards: string[];
    meaning: string;
    source: "general" | "health";
    category: string;
}

const BASE_URL = "http://localhost:4000";

// Celtic Cross adjacency (0-indexed, so position N = index N-1)
// 1↔2,3,4,5,6 | 3↔4,8 | 4↔5 | 5↔6 | 6↔10 | 7↔8 | 8↔9,3 | 9↔10
const CELTIC_ADJACENCY: Record<number, number[]> = {
    0: [1, 2, 3, 4, 5],   // pos 1
    1: [0, 2, 3, 4, 5],   // pos 2
    2: [0, 1, 3, 7],      // pos 3 — also connects to pos 8 (idx 7)
    3: [0, 1, 2, 4],      // pos 4
    4: [0, 1, 3, 5],      // pos 5
    5: [0, 1, 2, 4, 9],   // pos 6 — also connects to pos 10 (idx 9)
    6: [7],               // pos 7
    7: [6, 8, 2],         // pos 8 — connects to pos 7, 9, and 3 (idx 2)
    8: [7, 9],            // pos 9
    9: [8, 5],            // pos 10 — connects to pos 9 and 6 (idx 5)
};


function isConnected(indices: number[], adjacency: Record<number, number[]>): boolean {
    if (indices.length <= 1) return true;
    const indexSet = new Set(indices);
    const visited = new Set<number>();
    const queue = [indices[0]];
    visited.add(indices[0]);
    while (queue.length > 0) {
        const current = queue.shift()!;
        for (const neighbor of (adjacency[current] ?? [])) {
            if (indexSet.has(neighbor) && !visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return visited.size === indexSet.size;
}

class CombinationsService {
    async checkCombinations(cardNames: string[]): Promise<ICombinationMatch[]> {
        const response = await axios.post(`${BASE_URL}/api/tarot/check-combinations`, { cardNames });
        return response.data;
    }

    filterByProximity(matches: ICombinationMatch[], spreadCards: string[]): ICombinationMatch[] {
        const cardIndexMap = new Map(spreadCards.map((name, i) => [name.toLowerCase(), i]));
        return matches.filter(match => {
            const indices = match.cards
                .map(name => cardIndexMap.get(name.replace(/ Rx$/i, '').toLowerCase()))
                .filter((i): i is number => i !== undefined);
            if (indices.length !== match.cards.length) return false;
            return isConnected(indices, CELTIC_ADJACENCY);
        });
    }
}

export const combinationsService = new CombinationsService();
