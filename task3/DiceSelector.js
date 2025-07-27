import readline from 'readline';
import { ProbabilityCalculator } from './ProbabilityCalculator.js';
import { TableRenderer } from './TableRenderer.js';

export class DiceSelector {
    constructor(diceList) {
        this.diceList = diceList;
    }

    async userSelect(excludeIndex = null) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const menu = () => {
            console.log('\nChoose your dice:');
            this.diceList.forEach((dice, idx) => {
                if (idx !== excludeIndex) {
                    console.log(`${idx} - ${dice.toString()}`);
                }
            });
            console.log('X - exit');
            console.log('? - help');

            return new Promise((resolve) => {
                rl.question('Your selection: ', (input) => {
                    input = input.trim().toUpperCase();

                    if (input === 'X') {
                        console.log('Exiting...');
                        process.exit(0);
                    } else if (input === '?') {
                        // Show help table
                        const matrix = ProbabilityCalculator.calculateMatrix(this.diceList);
                        TableRenderer.render(this.diceList, matrix);
                        return resolve(menu()); // re-show menu
                    }

                    const num = parseInt(input);
                    if (
                        isNaN(num) ||
                        num < 0 ||
                        num >= this.diceList.length ||
                        num === excludeIndex
                    ) {
                        console.log('Invalid selection.');
                        return resolve(menu());
                    }

                    rl.close();
                    resolve(num);
                });
            });
        };

        return await menu();
    }

    computerSelect(excludeIndex = null) {
        const available = this.diceList
            .map((_, idx) => idx)
            .filter((idx) => idx !== excludeIndex);

        const choice = available[Math.floor(Math.random() * available.length)];
        console.log(`I choose the ${this.diceList[choice].toString()} dice.`);
        return choice;
    }
}
