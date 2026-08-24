/**
 * PERSONAL CARD NOTES
 * -------------------
 * Add your own rules, insights, or interpretive notes for any card.
 * Leave the note as an empty string "" to skip that card.
 * The AI will receive your note as a mandatory instruction when that card appears in a spread.
 *
 * Example:
 *   { card: "The Moon", note: "Always emphasize hidden fears and self-deception over confusion." }
 */

export interface IPersonalCardNote {
    card: string;
    note: string;
}

export const personalCardNotes: IPersonalCardNote[] = [

    // ── MAJOR ARCANA ─────────────────────────────────────────────────────────

    { card: "The Fool",          note: "" },
    { card: "The Magician",      note: "" },
    { card: "The High Priestess",note: "SPECIAL RULE — LAST POSITION ONLY: If The High Priestess appears in the final position of the spread (position 10 'Potential' in the Celtic Cross, or 'Future' in the Three Cards spread), this overrides everything else in the reading. Do NOT interpret any other card. Deliver this single message and nothing else: explain to the querent that The High Priestess in this final position is a sign that something is being kept hidden — not out of deliberate deception, but because there is something the querent is not yet ready to see, or has not yet admitted to themselves. This hidden element makes the rest of the spread impossible to read accurately, because the full picture has not yet surfaced. The cards cannot guide what has not yet been revealed — even to the querent themselves. Name the card and its position explicitly as the reason. — If The High Priestess appears in any OTHER position, ignore this rule entirely and interpret her normally." },
    { card: "The Empress",       note: "" },
    { card: "The Emperor",       note: "" },
    { card: "The Hierophant",    note: "" },
    { card: "The Lovers",        note: "The Lovers is first and foremost a card of decision — a crossroads where the querent must choose, or has already chosen, between two fundamentally different paths. The core tension is always the same: the heart versus the mind, emotion versus reason, passion versus wisdom. The classic image is the dilemma of choosing between a young, beautiful, exciting option that sets the heart on fire — and a wiser, more stable option that the rational mind knows is the sounder choice. This is not always literal romance; it can reflect any life decision where the querent is torn between what they feel and what they know. The card does not tell them which to choose — it tells them that a real choice is in front of them (or behind them), and that both sides have genuine weight. Emphasize the inner conflict: part of them wants to follow desire and feeling, part of them wants to follow logic and long-term thinking. The Lovers forces the question: which voice do you listen to?" },
    { card: "The Chariot",       note: "" },
    { card: "Strength",          note: "" },
    { card: "The Hermit",        note: "" },
    { card: "Wheel of Fortune",  note: "" },
    { card: "Justice",           note: "" },
    { card: "The Hanged Man",    note: "" },
    { card: "Death",             note: "" },
    { card: "Temperance",        note: "Temperance is the card of balance and subtle mastery — the ability to manage two contradictory or parallel situations at the same time without either one disrupting the other. There is an angelic, higher force lending the querent a certain finesse here: a lightness of touch that lets them navigate complexity most people would stumble through. This often shows up in situations where someone is keeping multiple things running in parallel — relationships, secrets, commitments — and somehow holding it all together without the pieces colliding. Do NOT moralize this card. It says nothing about whether what the querent is doing is right or wrong. It simply says: they have a gift for balance and they are being helped by something larger than ordinary luck. What they use that for is their own business." },
    { card: "The Devil",         note: "" },
    { card: "The Tower",         note: "" },
    { card: "The Star",          note: "" },
    { card: "The Moon",          note: "" },
    { card: "The Sun",           note: "" },
    { card: "Judgement",         note: "" },
    { card: "The World",         note: "" },

    // ── CUPS ─────────────────────────────────────────────────────────────────

    { card: "Ace of Cups",       note: "" },
    { card: "Two of Cups",       note: "" },
    { card: "Three of Cups",     note: "" },
    { card: "Four of Cups",      note: "" },
    { card: "Five of Cups",      note: "" },
    { card: "Six of Cups",       note: "" },
    { card: "Seven of Cups",     note: "SPECIAL RULE — LAST POSITION ONLY: If the Seven of Cups appears in the final position of the spread (position 10 'Potential' in the Celtic Cross, or 'Future' in the Three Cards spread), this overrides everything else in the reading. Do NOT interpret any other card. Deliver this single message and nothing else: the Seven of Cups is the card of illusions, fantasy, and self-deception. In this final position it is a direct signal from the cards that the querent is lying to themselves — they are not seeing their situation as it truly is, but through a distorted lens of wishful thinking or delusion. Name the card and its position explicitly. Tell the querent clearly and directly that the cards cannot give them a reliable reading right now, because the foundation they are operating from is not reality. Until they are willing to face the truth of their situation without illusion, the spread cannot serve them. — If the Seven of Cups appears in any OTHER position, interpret it normally as the card of illusions, choices, and fantasy." },
    { card: "Eight of Cups",     note: "" },
    { card: "Nine of Cups",      note: "" },
    { card: "Ten of Cups",       note: "" },
    { card: "Page of Cups",      note: "" },
    { card: "Knight of Cups",    note: "" },
    { card: "Queen of Cups",     note: "" },
    { card: "King of Cups",      note: "" },

    // ── SWORDS ───────────────────────────────────────────────────────────────

    { card: "Ace of Swords",     note: "" },
    { card: "Two of Swords",     note: "The silence before the storm — the storm is already on its way and nothing can stop it. The querent has closed their heart as a defense mechanism, and in doing so they have lost their ability to see clearly. They are standing still with their eyes shut while the world around them continues to move. Acknowledge the stillness, but make clear: closing the heart does not delay what is coming. The blindness is real, and so is the storm." },
    { card: "Three of Swords",   note: "" },
    { card: "Four of Swords",    note: "" },
    { card: "Five of Swords",    note: "The Five of Swords is the card of the pyrrhic victory — a win that costs more than it was worth. When this card appears, emphasize that the querent may achieve what they are fighting for, but at a price that outweighs the gain: relationships damaged, trust destroyed, energy depleted, or self-respect compromised. The victory is hollow. Depending on the surrounding cards, this card can also point to betrayal — someone in the querent's life acting in bad faith, stabbing them in the back, or winning at their expense. Always ask: who is holding the swords here — the querent, or someone else?" },
    { card: "Six of Swords",     note: "" },
    { card: "Seven of Swords",   note: "The thief who steals the minds of others — this card speaks of someone who takes what is not theirs to take: ideas, credit, mental energy, trust, or the narrative itself. The Seven of Swords is a master manipulator, a deceiver who operates in the shadows and walks away with something that belonged to someone else. When this card appears, ask: who is playing games here? Who is not being fully honest? It may be someone in the querent's life — or it may be the querent themselves, aware on some level that they are not being entirely above board. Either way, something is being taken without permission, and the truth has not fully surfaced yet." },
    { card: "Eight of Swords",   note: "" },
    { card: "Nine of Swords",    note: "" },
    { card: "Ten of Swords",     note: "" },
    { card: "Page of Swords",    note: "" },
    { card: "Knight of Swords",  note: "" },
    { card: "Queen of Swords",   note: "" },
    { card: "King of Swords",    note: "" },

    // ── WANDS ────────────────────────────────────────────────────────────────

    { card: "Ace of Wands",      note: "" },
    { card: "Two of Wands",      note: "" },
    { card: "Three of Wands",    note: "" },
    { card: "Four of Wands",     note: "" },
    { card: "Five of Wands",     note: "" },
    { card: "Six of Wands",      note: "" },
    { card: "Seven of Wands",    note: "" },
    { card: "Eight of Wands",    note: "" },
    { card: "Nine of Wands",     note: "" },
    { card: "Ten of Wands",      note: "" },
    { card: "Page of Wands",     note: "" },
    { card: "Knight of Wands",   note: "" },
    { card: "Queen of Wands",    note: "" },
    { card: "King of Wands",     note: "The King of Wands carries an imposing presence — a natural, almost magnetic authority that fills a room before he says a word. This is not aggression; it is command. People instinctively defer to him, follow his lead, or measure themselves against him. When this card appears, emphasize the commanding, larger-than-life energy of the querent (or the figure represented): bold, visionary, sure of themselves, unwilling to be overlooked. But the same imposingness that inspires can also intimidate or overshadow others — where the surrounding cards suggest friction, consider whether this dominant presence is being felt as leadership or as an imposition on someone else's space." },

    // ── PENTACLES ────────────────────────────────────────────────────────────

    { card: "Ace of Pentacles",  note: "" },
    { card: "Two of Pentacles",  note: "" },
    { card: "Three of Pentacles",note: "" },
    { card: "Four of Pentacles", note: "" },
    { card: "Five of Pentacles", note: "" },
    { card: "Six of Pentacles",  note: "" },
    { card: "Seven of Pentacles",note: "" },
    { card: "Eight of Pentacles",note: "" },
    { card: "Nine of Pentacles", note: "" },
    { card: "Ten of Pentacles",  note: "" },
    { card: "Page of Pentacles", note: "" },
    { card: "Knight of Pentacles",note: "" },
    { card: "Queen of Pentacles",note: "" },
    { card: "King of Pentacles", note: "" },
];
