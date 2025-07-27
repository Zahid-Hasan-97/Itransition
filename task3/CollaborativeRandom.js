import readline from 'readline';
import { FairRandomGenerator } from './FairRandomGenerator.js';

export class CollaborativeRandom {
    constructor(range) {
        this.range = range;
    }

    async runProtocol(phaseName) {
        console.log(`\n Fair number generation for ${phaseName}:`);
        const fairGen = new FairRandomGenerator(this.range);

        // Step 1: Show HMAC
        console.log(`I selected a random value in the range 0..${this.range - 1} (HMAC=${fairGen.getHMAC()}).`);

        // Step 2: Ask user for their number
        const userInput = await this.askUserNumber();

        // Step 3: Reveal result
        const compNum = fairGen.getComputerNumber();
        const keyHex = fairGen.getKeyHex();

        const result = (userInput + compNum) % this.range;
        console.log(`My number is ${compNum} (KEY=${keyHex}).`);
        console.log(`The fair number generation result is ${compNum} + ${userInput} = ${result} (mod ${this.range}).`);

        return result;
    }

    askUserNumber() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const prompt = () => {
            return new Promise((resolve) => {
                rl.question(this.getPromptText(), (input) => {
                    input = input.trim();
                    if (input.toUpperCase() === 'X') {
                        console.log('Exiting...');
                        process.exit(0);
                    } else if (input === '?') {
                        console.log('Please enter a number between 0 and', this.range - 1);
                        return resolve(prompt()); // re-ask
                    }

                    const num = parseInt(input);
                    if (isNaN(num) || num < 0 || num >= this.range) {
                        console.log('Invalid input.');
                        return resolve(prompt());
                    }

                    rl.close();
                    resolve(num);
                });
            });
        };

        return prompt();
    }

    getPromptText() {
        let text = 'Add your number modulo ' + this.range + ':\n';
        for (let i = 0; i < this.range; i++) {
            text += `${i} - ${i}\n`;
        }
        text += 'X - exit\n? - help\nYour selection: ';
        return text;
    }
}
