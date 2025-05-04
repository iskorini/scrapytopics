export interface ParsedQuestion {
    question: string;
    answers: Record<string, string>;
    community_answer: string[];
    proposed_answer: string[];
    community_answer_score: string;
}

export type ParsedQuestions = Record<string, ParsedQuestion>;

/**
 * Funzione principale da esportare: riceve il testo estratto dal PDF e restituisce le domande parsate.
 */
export function parsePdfTextToQuestions(text: string): ParsedQuestions {
    const questionBlocks = splitIntoQuestionBlocks(text);
    const questionNumbers = extractQuestionNumbers(text);

    const questions: ParsedQuestions = {};

    questionBlocks.forEach((block, i) => {
        const qNumber = questionNumbers[i];
        if (qNumber) {
            questions[qNumber] = parseSingleQuestionBlock(block);
        }
    });

    return questions;
}

/**
 * Divide il testo in blocchi relativi a ogni domanda.
 */
function splitIntoQuestionBlocks(text: string): string[] {
    const blocks = text.split(/Question\s+\d+/).map(block => block.trim());
    // Remove the first block if it doesn't contain a valid question
    if (blocks[0] === '' || !blocks[0].startsWith('Question')) {
        blocks.shift();
    }
    return blocks.filter(block => block.length > 0);
}

/**
 * Estrae i numeri delle domande dal testo completo.
 */
function extractQuestionNumbers(text: string): string[] {
    return [...text.matchAll(/Question\s+(\d+)/g)].map(match => match[1]);
}

/**
 * Parsea un singolo blocco di domanda e lo trasforma in oggetto strutturato.
 */
function parseSingleQuestionBlock(block: string): ParsedQuestion {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);

    const answerIndex = lines.findIndex(line => /^A\.\s/.test(line));
    const questionText = extractQuestionText(lines, answerIndex);

    const answerEndIndex = lines.findIndex((line, idx) =>
        idx > answerIndex && /^(Answer by the community|Answer proposed)/.test(line)
    );

    const answerLines = lines.slice(
        answerIndex,
        answerEndIndex === -1 ? undefined : answerEndIndex
    );

    const answers = extractAnswers(answerLines);
    const { answers: communityAnswer, score: communityAnswerScore } = extractCommunityAnswer(lines);
    const proposedAnswer = extractProposedAnswer(lines);

    return {
        question: questionText,
        answers,
        community_answer: communityAnswer,
        proposed_answer: proposedAnswer,
        community_answer_score: communityAnswerScore,
    };
}


/**
 * Unisce le righe iniziali per formare il testo della domanda.
 */
function extractQuestionText(lines: string[], answerIndex: number): string {
    return lines
        .slice(0, answerIndex)
        .join(' ')
        .trim();
}

/**
 * Estrae le risposte multiple da un blocco di righe.
 */
function extractAnswers(lines: string[]): Record<string, string> {
    const answers: Record<string, string> = {};
    let currentLetter = '';

    lines.forEach(line => {
        const match = line.match(/^([A-E])\.\s+(.*)/);
        if (match) {
            currentLetter = match[1];
            answers[currentLetter] = match[2];
        } else if (currentLetter) {
            answers[currentLetter] += ' ' + line;
        }
    });

    return answers;
}

/**
 * Estrae le risposte della community.
 */
function extractCommunityAnswer(lines: string[]): { answers: string[]; score: string } {
    const line = lines.find(l => l.startsWith('Answer by the community'));
    if (!line) return { answers: [], score: '' };

    const match = line.match(/: ([A-E, ]+)(?:\s*\((\d+%)\))?/);
    if (!match) return { answers: [], score: '' };

    const raw = match[1].trim();
    const score = match[2];

    let answers: string[];
    if (raw.includes(',')) {
        answers = raw.split(',').map(a => a.trim());
    } else if (/^[A-E]{2,}$/.test(raw)) {
        answers = raw.split('');
    } else {
        answers = [raw];
    }

    return { answers, score };
}



/**
 * Estrae le risposte proposte.
 */
function extractProposedAnswer(lines: string[]): string[] {
    const line = lines.find(l => l.startsWith('Answer proposed'));
    if (!line) return [];
    const match = line.match(/: (.+)/);
    return match ? match[1].split(/,\s*/).map(a => a.trim()) : [];
}
