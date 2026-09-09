import axios from "axios";
import { appConfig } from "../utils/app-config";
import { ISpreadCard } from "../dto/tarot.dto";
import { tarotCombinations } from "../data/combinations";
import { riderWaiteCards } from "../data/riderWaite";
import { healthCombinations } from "../data/health-combinations";
import { CELTIC_POSITION_GUIDE, MASTER_POSITION_GUIDE } from "../utils/prompt-constants";
import {
    findMatchingCombinations,
    isHealthQuestion,
    findHealthIndicators,
    getCourtCardsSection,
    getCourtMeetingsSection,
    getCourtMeetingPositions,
    getMajorArcanaFigureSection,
    getSuitDominanceSection,
    isAllMajorArcana,
    isCategoryRelevant,
    getMajorArcanaSection,
    getPersonalNotesSection,
    getPastAnchorSection,
} from "./prompt-sections";

class TarotService {
    // Event-based mode (eventBasedActive below), the court/Major-Arcana person
    // rulings that feed it, and the question-address-first conclusion opener
    // were added 2026-09-01 and verified against a real OpenAI response the
    // same day (The Empress in Past, Queen of Cups in Present, "will I find
    // love next month?"): event-story paragraphs landed after **Conclusion**
    // with no card-name heading, the court card read as a real person, the
    // Major Arcana card read as the querent, and the conclusion opened by
    // answering the question's timeframe/domain before the event stories.
    private buildInterpretationMessages(spreadType: string, cards: ISpreadCard[], language: "en" | "he", question?: string, isThirdPerson?: boolean, confirmedCombination?: import("../dto/tarot.dto").ICombinationMatch, gender?: "male" | "female", isEventBased?: boolean): { system: string; user: string } {
        const eventBasedActive = !!isEventBased && spreadType === "celtic";
        const spreadName = spreadType === "celtic" ? "Celtic Cross" : spreadType === "master-spread" ? "Master Spread" : "Old Gipsy";

        const cardList = cards
            .map((card, i) => {
                const data = riderWaiteCards.find(c => c.name.toLowerCase() === card.name.toLowerCase());
                return `${i + 1}. ${card.position} — ${card.name}: ${data?.meaning_up ?? ""}`;
            })
            .join("\n");

        const questionLine = question?.trim()
            ? `The querent's question is: "${question.trim()}"\n\n`
            : "";

        const celticThirdPersonPositions = spreadType === "celtic"
            ? "\n- IMPORTANT — Celtic Cross positions 7 (Inside), 8 (Outside), 9 (Fears), 10 (Potential) are especially revealing: they expose that person's private inner world, how they present themselves to others, what they are afraid of, and what their highest potential is. Treat these four positions as the deepest window into who this person truly is."
            : "";
        const thirdPersonSection = isThirdPerson
            ? `=== THIRD-PERSON READING ===\nThe querent is asking about ANOTHER PERSON, not about themselves. Adjust your ENTIRE interpretation accordingly:\n- The ENTIRE spread — every card and every position — describes that OTHER PERSON's life, situation, emotions, and trajectory, not the querent's own.\n- Speak to the querent as the observer. Refer to the subject as "the person you asked about", "they", or by the relationship if mentioned (e.g. "your friend", "your partner", "your mother").\n- Never say "you are facing" — say "the person you asked about is facing", "they feel", "their fear is", etc.${celticThirdPersonPositions}\n===\n\n`
            : "";

        const healthMatches = question?.trim() && isHealthQuestion(question.trim())
            ? findHealthIndicators(cards)
            : [];
        const healthSection = healthMatches.length > 0
            ? `=== HEALTH QUESTION DETECTED — READ THIS FIRST ===\nThe querent is asking about health. The cards in this spread indicate the following health conditions:\n\n${healthMatches.join("\n")}\n\nThese health indicators carry the HIGHEST priority. Lead your entire interpretation with the health dimension. Be specific, compassionate, and direct about what the cards are showing regarding the querent's physical or mental wellbeing.\n===\n\n`
            : "";

        const majorArcanaSection = (spreadType === "celtic" || spreadType === "master-spread") ? getMajorArcanaSection(cards) : "";
        const courtMeetingsSection = getCourtMeetingsSection(cards, spreadType);
        const courtMeetingPositions = getCourtMeetingPositions(cards, spreadType);
        const courtCardsSection = getCourtCardsSection(cards, gender, spreadType, question, eventBasedActive, courtMeetingPositions);
        const majorArcanaFigureSection = getMajorArcanaFigureSection(cards, spreadType, eventBasedActive);

        const eventBasedSection = eventBasedActive
            ? `=== EVENT-BASED READING MODE ===\nKeep the normal structure — Past, Present, Near Future, and Far Future each still get their own individual paragraph, exactly as described below. Do not remove or merge those paragraphs.\n\nIn addition, two extra paragraphs are added AFTER all the individual position paragraphs are written — see the EVENT-STORY PARAGRAPHS instruction later in this prompt for their exact content, placement, and formatting.\n\nCRITICAL — COURT/ROYALTY CARDS: wherever a Page, Knight, Queen, or King of any suit appears in the Past, Present, Near Future, or Far Future positions — including inside the two event-story paragraphs — it represents an ACTUAL PERSON the querent will interact with or encounter in that event, not an abstract energy or trait. Describe that person concretely: their likely role or relationship to the querent, their personality or manner, and how the querent will engage with them. (See the mandatory per-card court rulings below for the exact wording to use per card.)\n===\n\n`
            : "";

        const eventStoriesInstruction = eventBasedActive
            ? `Immediately after the **Conclusion** marker (before the short conclusion text described below), add exactly two more paragraphs, in this order. For each one, do NOT just narrate the first card then the second card back to back — first identify the specific energy, theme, or dynamic that EMERGES from combining these two particular cards together, as if they formed a single unified symbol (the same way two adjacent cards form a known "combination" elsewhere in tarot tradition), and then tell the event as a story built around that combined energy:\n\n1. One paragraph treating the Past and Present cards TOGETHER as ONE SPECIFIC EVENT in the querent's timeline. Name the combined energy this pairing creates, then tell a short, concrete story of that one event (what happened, what is happening now) built around it. Do not just restate what the individual Past and Present paragraphs already said — this is a distinct synthesis of the two, not a recap.\n\n2. One paragraph treating the Near Future and Far Future cards TOGETHER as ANOTHER SPECIFIC EVENT about to unfold. Name the combined energy this pairing creates, then tell a short, concrete story of that one upcoming event built around it. Do not just restate what the individual Near Future and Far Future paragraphs already said — this is a distinct synthesis of the two, not a recap.\n\nFormatting rule for both of these two paragraphs: do NOT give them a card-name heading or any bold title line before them (no "**Card Name**" line) — write each as plain flowing prose only, with no heading. Then, after these two paragraphs, write the short conclusion text as normal.\n\n`
            : "";

        const confirmedComboSection = confirmedCombination
            ? `=== USER-CONFIRMED LIFE CONTEXT ===\nThe user was shown a detected combination and confirmed it is directly relevant to their current life situation:\n${confirmedCombination.cards.join(' + ')} → ${language === 'he' ? confirmedCombination.meaning_he : confirmedCombination.meaning}\nThis is the most important context in this entire reading. Treat this confirmed combination as the central truth of the spread. Reference it explicitly throughout your interpretation — especially in the opening and the conclusion — and show how each card connects back to this theme.\n===\n\n`
            : '';

        const matchedCombos = findMatchingCombinations(cards, spreadType);
        const combinationsSection = matchedCombos.length > 0
            ? `=== ESTABLISHED CARD COMBINATIONS DETECTED IN THIS SPREAD ===\nThe following well-known tarot combinations appear in the drawn cards:\n\n${matchedCombos.join("\n")}\n\nDo NOT mention or explain these while interpreting the individual cards. Save them entirely for a dedicated "Things You Should Pay Attention To" section placed AFTER all the individual card paragraphs and BEFORE the conclusion, as instructed below.\n===\n\n`
            : "";

        const suitDominanceSection = getSuitDominanceSection(cards);
        const personalNotesSection = getPersonalNotesSection(cards);
        const pastAnchorSection = getPastAnchorSection(cards, question);
        const positionGuide = spreadType === "celtic" ? `\n\n${CELTIC_POSITION_GUIDE}` : spreadType === "master-spread" ? `\n\n${MASTER_POSITION_GUIDE}` : "";

        const positionInstruction = language === "he"
            ? "Translate each position name into Hebrew (e.g. Past→עבר, Present→הווה, Future→עתיד, Positive Energy→אנרגיה חיובית, Negative Energy→אנרגיה שלילית, Near Future→עתיד קרוב, Far Future→עתיד רחוק, Inside→עולם פנימי, Outside→עולם חיצוני, Fears→פחדים, Potential→פוטנציאל). Do NOT write 'Position 1', 'Position 2', etc. When writing 'In the X position' use the word 'מיקום' (NOT 'מצב') — e.g. 'במיקום האנרגיה החיובית'. IMPORTANT: Always write card names in English (do NOT translate them) — e.g. 'יש לך את הקלף The Fool'."
            : "Use the position name exactly as provided in the list above.";

        const openingContext = question?.trim() ? " in relation to the querent's question" : "";
        const combosCount = matchedCombos.length;
        const formatOpening = `1. One opening sentence giving an overall impression of what this reading is about${openingContext}.\n\n2.`;

        const attentionSectionInstruction = combosCount > 0
            ? combosCount === 1
                ? `3. After all the individual card paragraphs, add a section starting with the EXACT heading below on its own line (do not translate or change it, even when writing in Hebrew — it will be translated separately):\n**Things You Should Pay Attention To**\nUnder this heading, write one paragraph noting that the combination of [cards] appearing together is worth paying attention to, and explain in 2-3 sentences what it points to in the querent's life. Keep the tone observational and grounding, not alarming or urgent.\n\n`
                : `3. After all the individual card paragraphs, add a section starting with the EXACT heading below on its own line (do not translate or change it, even when writing in Hebrew — it will be translated separately):\n**Things You Should Pay Attention To**\nUnder this heading, write EXACTLY ${combosCount} separate paragraphs — ONE PARAGRAPH PER COMBINATION, in the order listed above. Each paragraph should note that the combination of [cards] appearing together is worth paying attention to, and explain in 2-3 sentences what it points to in the querent's life. Keep the tone observational and grounding, not alarming or urgent. Do NOT merge or skip any combination.\n\n`
            : "";

        const questionAddressInstruction = question?.trim()
            ? `Immediately after the marker, before anything else described below, open with one to two direct sentences that answer or address the querent's actual question — "${question.trim()}" — do not just restate the question, answer it. Specifically address whatever the question is actually about:\n- If it specifies or implies a particular timeframe (e.g. "next week", "next month", "this year", "soon", "by [some date]"), explicitly address that specific timeframe, connecting it to what the relevant position(s) in this spread show for that period (Near Future / Far Future in a Celtic Cross, or Future in a shorter spread).\n- If it specifies a life domain (e.g. love, relationships, money, career, health, family), explicitly address that domain directly — give a real answer about that specific area of the querent's life, not a generic statement.\nA question can combine both (e.g. "will I find love next month") — address every part it asks about. This must be the very first thing after the marker.\n\n`
            : "";

        const conclusionStep = combosCount > 0 ? "4." : "3.";
        const conclusionInstruction = combosCount > 0
            ? `2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals, tying back to ${combosCount > 1 ? "the combinations noted above" : "the combination noted above"} where relevant.`
            : "2-3 sentences telling the querent what they should focus on or do to fulfil the potential this spread reveals. Give direct, personal, actionable guidance.";

        const energyNote = spreadType === "celtic"
            ? "\n\nIMPORTANT: Positions 1 (Positive Energy) and 2 (Negative Energy) are NOT events, NOT feelings, NOT emotions, and NOT internal states of the querent. They are impersonal forces or energies that exist and operate in the querent's life — like currents in the air around them. Do NOT say things like \"you feel\", \"you sense\", \"you are experiencing\", \"you are afraid\", \"you hope\", or any language implying this is about the querent's inner emotional world. Instead speak about the energy itself as a living force: what it is doing, how it is acting, what it is pushing or pulling. Use language like: \"The energy at work here is...\", \"A force of [quality] is operating in your life...\", \"This current is shaping your circumstances by...\", \"The momentum driving your situation is...\". All other positions should still include clear time-frame language." +
              "\n\nSPECIAL RULE FOR POSITION 1 (Positive Energy): If the card here is traditionally difficult or dark (e.g. Death, The Tower, The Devil, 10 of Swords, 9 of Swords, 3 of Swords, 5 of Cups, 8 of Swords, etc.), do NOT soften it, reframe it as gentle, or search for hidden silver linings in the card itself. The card remains exactly as dark and difficult as it is — keep its full weight. The correct interpretation is: the difficult situation or force this card describes is exactly what is working IN the querent's favour. The bad thing that is happening IS the positive energy. The collapse, the loss, the pain, the conflict — whatever this card literally means — THAT is what is benefiting the querent right now, as strange as it sounds. State this plainly: tell the querent that the difficult situation described by this card is the positive force in their life, and explain WHY this particular hardship is actually serving or advancing them." +
              "\n\nRULE FOR POSITION 2 (Negative Energy) — applies to ALL cards: Whatever card appears here, its energy is working AGAINST the querent. This is non-negotiable regardless of whether the card is traditionally good or bad. Crucially: the advantage or benefit this card normally provides is NOT available to the querent — it is being directed against them, or is simply out of reach. If the card is a dark or difficult card, its harsh energy is an opposing force — straightforward. If the card is a positive or fortunate card (e.g. The Star, The Sun, 10 of Cups, Ace of any suit, etc.), do NOT celebrate it. The card's positive power is real, but the querent is on the wrong side of it — it is not helping them, it is working against them. Tell the querent plainly: this energy is opposing you, and whatever advantage this card represents is not yours to use right now." +
              "\n\nPOSITION 10 (Potential) IS THE DESTINATION OF POSITIONS 1 AND 2: Both the positive energy (position 1) and the negative energy (position 2) are active forces driving toward the outcome shown in position 10. When interpreting position 10, explicitly reference both energies and show how each one is pushing toward this potential. Then encourage the querent to consciously amplify the positive energy — because that is the lever that determines whether the best or worst version of this potential is realised."
            : "";

        // Master Spread reads as ONE story per row (not one paragraph per
        // card): cards 1-3 (Past), 4-6 (Present), and 7-9 (Future) are each
        // synthesized into a single continuous paragraph, plus a fourth
        // paragraph for card 10 (Potential) alone — four paragraphs total.
        const masterBodyInstruction = `${formatOpening} Then write exactly FOUR paragraphs, in this order — do not write more or fewer, and do not give any of them a bold heading or card-name title line:\n\n- PAST: Read cards 1-3 (the Past row — Beginning, Middle, End) together as ONE continuous story, not three separate mini-descriptions stitched together. Trace how this past chapter begins, develops, and resolves, naming each of the three cards naturally within the flowing story as you reach it.\n- PRESENT: Read cards 4-6 (the Present row) together the same way, as one continuous story of the present moment. Card 5 (the center card) is THE MOST IMPORTANT CARD IN THE ENTIRE SPREAD — the whole reading revolves around it. It must state plainly and concretely where the querent stands RIGHT NOW, at this exact point in their life — their current situation, named directly, not a vague feeling. Card 4 is how this present chapter opened into that situation, and card 6 is where it is now moving from it — but card 5 itself is the anchor of the whole paragraph (and of the whole reading) and must read as the centerpiece, not as one of three equal beats.\n- FUTURE: Read cards 7-9 (the Future row) together the same way, as one continuous story of what is coming — how it begins, develops, and resolves.\n- POTENTIAL: One paragraph on card 10 alone. Open by stating clearly what the potential IS — name it directly in one sentence (e.g. "The potential here is [X]"). Then show both the best and worst this three-part story (Past → Present → Future) can ultimately produce, and close with direct encouragement toward the best version of that potential.\n\nEach of these four paragraphs must open by making clear which chapter it is (Past / Present / Future / Potential) — using that word naturally in the response language (translate it into Hebrew when responding in Hebrew: Past→עבר, Present→הווה, Future→עתיד, Potential→פוטנציאל) as part of the opening sentence's prose, NOT as a bold heading or standalone label line. Each paragraph must be a single unbroken block of prose with no internal line breaks.\n\n`;

        const positionDescriptions = spreadType === "celtic"
            ? isThirdPerson
                ? `- Positive Energy → what energy or force is actively operating in their life right now, carrying or propelling their situation? Describe the energy itself as a living force — NOT their feelings about it.\n- Negative Energy → what energy or force is opposing, obstructing, or creating friction in their life right now? Describe the energy itself as a living force — NOT their feelings about it.\n- Past → what already happened that started or shaped this situation for them?\n- Present → what are they experiencing or facing right now?\n- Near Future → what is concretely coming for them in the short term?\n- Far Future → where is this heading long-term for them?\n- Inside → what is their private, unspoken emotional truth?\n- Outside → how do they appear to others; how do they present themselves to the world?\n- Fears → what do they dread, and how is that fear showing up?\n- Potential → open by stating clearly what the potential IS — name it directly in one sentence (e.g. "The potential here is [X]"). Then expand: show both the best and worst this situation can produce. Connect it to the two energy positions — both the positive force (position 1) and the negative force (position 2) are pushing toward this outcome. Close with a direct encouragement to lean into the positive energy, because that is what unlocks the best version of this potential.`
                : `- Positive Energy → what energy or force is actively operating in your life right now, carrying or propelling your situation? Describe the energy itself as a living force — NOT your feelings about it.\n- Negative Energy → what energy or force is working against you right now? Whatever card is here — good or bad — its power is opposing you and its advantage is not available to you. Describe this opposing force plainly and directly.\n- Past → what already happened that started or shaped this situation?\n- Present → what are you experiencing or facing right now?\n- Near Future → what is concretely coming for you in the short term?\n- Far Future → where is this heading long-term; what is the ultimate direction?\n- Inside → what is your private, unspoken emotional truth that you may not be voicing?\n- Outside → how do you appear to others; how do you present yourself to the world?\n- Fears → what do you dread, and how is that fear showing up in this situation?\n- Potential → open by stating clearly what the potential IS — name it directly in one sentence (e.g. "The potential here is [X]"). Then expand: show both the best and worst this situation can produce. Connect it to the two energy positions — both the positive force (position 1) and the negative force (position 2) are pushing toward this outcome. Close with a direct encouragement to lean into the positive energy, because that is what unlocks the best version of this potential.`
            : isThirdPerson
                ? `- Past → what already happened that started or shaped this situation for them?\n- Present → what are they experiencing or facing right now?\n- Future → what is coming for them?`
                : `- Past → what already happened that started or shaped this situation?\n- Present → what are you experiencing or facing right now?\n- Future → what is coming for you?`;

        const bodyInstruction = spreadType === "master-spread"
            ? masterBodyInstruction
            : `${formatOpening} For each card, one paragraph. Open with a sentence (in the response language) saying: in the [position name] position, the card is [card name]. Then write 2–3 sentences interpreting the card through the angle of its position — the position name defines the narrative frame and the specific question the paragraph must answer:\n${positionDescriptions}\nEach paragraph must feel like it is answering the specific question its position poses — not a generic card description with a label attached.\n\n${positionInstruction}${energyNote}\n\n`;

        const userMessage = `${questionLine}${pastAnchorSection}${confirmedComboSection}${eventBasedSection}${thirdPersonSection}${healthSection}${majorArcanaSection}${suitDominanceSection}${courtMeetingsSection}${courtCardsSection}${majorArcanaFigureSection}${combinationsSection}${personalNotesSection}I have drawn a ${spreadName} tarot spread. Here are the cards:\n\n${cardList}${positionGuide}\n\nWrite the interpretation as a flowing personal narrative in exactly this structure:\n\n${bodyInstruction}${attentionSectionInstruction}${conclusionStep} End with the EXACT marker below on its own line (do not translate or change it, even when writing in Hebrew), followed by the conclusion text:\n**Conclusion**\n${questionAddressInstruction}${eventStoriesInstruction}[${conclusionInstruction}]`;

        const system = `${language === "he" ? "CRITICAL — LANGUAGE RULE: You MUST write your ENTIRE response in Hebrew. Every sentence, every structural phrase, every opening line must be in Hebrew. Do NOT write any sentence in English. The ONLY exception: keep card names in English (e.g. 'The Fool', 'Nine of Wands'). If an instruction gives you an example sentence in English, translate that sentence into Hebrew — do not copy it literally.\n\n" : ""}You are a wise and insightful tarot reader who speaks in vivid, concrete terms about real life events. Never describe what a card "symbolizes" or "represents" in abstract terms. Instead describe what is actually happening or has happened or will happen in the person's life — real situations, relationships, decisions, turning points. Always anchor each card to a clear time frame: past events that shaped the situation, what is happening right now, what is coming soon, and what lies further ahead. Be explicit: "This happened in your past...", "Right now you are facing...", "In the near future...", "Further down the road...". Ground everything in human experience: heartbreak, career shifts, family tensions, personal growth, financial pressure, new beginnings, loss. Be direct, warm, and personal — speak as if you know their story.${gender === "male" ? " The querent is male. Always speak to them directly in second person — in English say 'you', 'your'; in Hebrew say 'אתה' (you, masculine) and NEVER 'הוא' (he). All Hebrew verbs, adjectives, and participles addressing the querent must be in masculine grammatical form (לשון זכר). Example: say 'אתה עומד בפני' NOT 'הוא עומד בפני'." : gender === "female" ? " The querent is female. Always speak to them directly in second person — in English say 'you', 'your'; in Hebrew say 'את' (you, feminine) and NEVER 'היא' (she). All Hebrew verbs, adjectives, and participles addressing the querent must be in feminine grammatical form (לשון נקבה). Example: say 'את עומדת בפני' NOT 'היא עומדת בפני'." : ""} Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`;

        return { system, user: userMessage };
    }

    private async callChat(system: string, user: string): Promise<string> {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o",
                messages: [
                    { role: "system", content: system },
                    { role: "user", content: user },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${appConfig.openAiApiKey}`,
                },
                timeout: 60000,
            }
        );

        return response.data.choices[0].message.content as string;
    }

    public async interpretSpread(spreadType: string, cards: ISpreadCard[], language: "en" | "he" = "en", question?: string, isThirdPerson?: boolean, confirmedCombination?: import("../dto/tarot.dto").ICombinationMatch, gender?: "male" | "female", isEventBased?: boolean): Promise<string> {
        const { system, user } = this.buildInterpretationMessages(spreadType, cards, language, question, isThirdPerson, confirmedCombination, gender, isEventBased);
        return this.callChat(system, user);
    }

    public async translateInterpretation(text: string, gender?: "male" | "female"): Promise<string> {
        const genderRule = gender === "male"
            ? " The querent is male. Address them as 'אתה' (masculine 'you') — never 'הוא'. Every Hebrew verb, adjective, and participle addressing the querent must be in masculine grammatical form (לשון זכר)."
            : gender === "female"
                ? " The querent is female. Address them as 'את' (feminine 'you') — never 'היא'. Every Hebrew verb, adjective, and participle addressing the querent must be in feminine grammatical form (לשון נקבה)."
                : "";

        const systemPrompt = `You are a professional translator specializing in tarot readings. Translate the following English tarot reading into Hebrew.\n\nRules — follow exactly, this is a faithful translation, not a new composition:\n- Keep every tarot card name in English exactly as written (e.g. 'The Fool', 'Nine of Wands', 'Queen of Cups'). Do not translate card names.\n- Translate every position name into Hebrew using this mapping: Past→עבר, Present→הווה, Future→עתיד, Positive Energy→אנרגיה חיובית, Negative Energy→אנרגיה שלילית, Near Future→עתיד קרוב, Far Future→עתיד רחוק, Inside→עולם פנימי, Outside→עולם חיצוני, Fears→פחדים, Potential→פוטנציאל.\n- When translating a phrase like "in the X position", use the word 'מיקום' (NOT 'מצב').\n- If the heading '**Things You Should Pay Attention To**' appears, translate it EXACTLY as '**דברים שכדאי לשים לב אליהם**' — do not paraphrase it, do not leave it in English.\n- Preserve the exact structure of the original: the same paragraphs, in the same order, covering exactly the same content. Do not add, remove, or reinterpret anything — including which card combinations are mentioned.\n- Keep the literal marker '**Conclusion**' unchanged, on its own line, exactly as written — do not translate it.${genderRule}\n\nRespond with ONLY the Hebrew translation — no preamble, no notes, nothing else.`;

        return this.callChat(systemPrompt, text);
    }

    public async followupQuestion(question: string, interpretation: string, language: "en" | "he" = "en"): Promise<string> {
        const langRule = language === "he"
            ? "CRITICAL — LANGUAGE RULE: You MUST write your ENTIRE response in Hebrew. The ONLY exception: keep tarot card names in English.\n\n"
            : "";

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `${langRule}You are a tarot reader who has just completed a reading. The querent has a follow-up question. Answer it based ONLY on what the cards in the reading revealed — do not invent new meanings beyond the reading. Be direct, warm, and personal. 2–3 sentences maximum. Respond entirely in ${language === "he" ? "Hebrew" : "English"}.`,
                    },
                    {
                        role: "user",
                        content: `Here is the tarot reading that was given:\n\n${interpretation}\n\nThe querent now asks: "${question}"\n\nAnswer in 2–3 sentences, drawing only from what this reading revealed.`,
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${appConfig.openAiApiKey}`,
                },
                timeout: 60000,
            }
        );

        return response.data.choices[0].message.content as string;
    }

    public checkCombinations(cardNames: string[], question?: string): import("../dto/tarot.dto").ICombinationMatch[] {
        const nameSet = new Set(cardNames.map(n => n.toLowerCase()));
        const matches: import("../dto/tarot.dto").ICombinationMatch[] = [];
        const q = question?.trim() ?? '';

        const HEALTH_CATEGORY_HE: Record<string, string> = { health: "בריאות", mental_health: "בריאות נפשית" };

        for (const category of tarotCombinations) {
            for (const combo of category.combinations) {
                if (combo.cards.every(c => nameSet.has(c.toLowerCase()))) {
                    if (isAllMajorArcana(combo.cards) || (q && isCategoryRelevant(category.category, q))) {
                        matches.push({ cards: combo.cards, meaning: combo.meaning, meaning_he: combo.meaning_he, source: "general", category: category.category, category_he: category.category_he });
                    }
                }
            }
        }

        for (const combo of healthCombinations) {
            if (combo.cards.every(c => nameSet.has(c.replace(/ Rx$/i, "").toLowerCase()))) {
                if (isAllMajorArcana(combo.cards) || (q && isCategoryRelevant(combo.category, q))) {
                    matches.push({ cards: combo.cards, meaning: combo.meaning, meaning_he: combo.meaning_he, source: "health", category: combo.category, category_he: HEALTH_CATEGORY_HE[combo.category] ?? combo.category });
                }
            }
        }

        return matches;
    }
}

export const tarotService = new TarotService();
