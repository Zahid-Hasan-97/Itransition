export class ProbabilityCalculator {
    static winProbability(diceA, diceB) {
        let wins = 0;
        let total = 0;

        for (let faceA of diceA.faces) {
            for (let faceB of diceB.faces) {
                if (faceA > faceB) wins++;
                total++;
            }
        }

        return (wins / total).toFixed(4);
    }

    static calculateMatrix(diceList) {
        const matrix = [];
        for (let i = 0; i < diceList.length; i++) {
            const row = [];
            for (let j = 0; j < diceList.length; j++) {
                if (i === j) {
                    row.push('—'); // no self-play
                } else {
                    const prob = this.winProbability(diceList[i], diceList[j]);
                    row.push(prob);
                }
            }
            matrix.push(row);
        }
        return matrix;
    }
}
