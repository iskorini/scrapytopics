const labels = ["A", "B", "C", "D", "E"];

const labelIndexMap = Object.fromEntries(labels.map((label, index) => [label, index]));

function fromLabelsToOneHot(labelsArray: string[]): number[] {
    const oneHot = new Array(labels.length).fill(0);
    for (const label of labelsArray) {
        const index = labelIndexMap[label];
        oneHot[index] = 1;
    }
    return oneHot;
}

export function validateQuestion(correctAnswers: string[], proposedAnswers: string[]): boolean {
    const correctOneHot = fromLabelsToOneHot(correctAnswers);
    const proposedOneHot = fromLabelsToOneHot(proposedAnswers);
    return correctOneHot.every((value, index) => value === proposedOneHot[index]);
}