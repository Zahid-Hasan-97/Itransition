import { Dice } from './Dice.js';

export class DiceParser {
    static parse(args) {
        if (!args || args.length < 3) {
            throw new Error(
                'Invalid number of dice. Provide at least 3 dice.\nExample: node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3'
            );
        }

        const diceList = [];

        for (let i = 0; i < args.length; i++) {
            const parts = args[i].split(',');
            if (parts.length !== 6) {
                throw new Error(
                    `Dice ${i} has ${parts.length} faces. Each dice must have exactly 6 faces.`
                );
            }

            const numbers = parts.map((p) => {
                const num = parseInt(p, 10);
                if (isNaN(num)) {
                    throw new Error(
                        `Dice ${i} contains non-integer value: ${p}\nExample: node game.js 2,2,4,4,9,9`
                    );
                }
                return num;
            });

            diceList.push(new Dice(numbers));
        }

        return diceList;
    }
}
