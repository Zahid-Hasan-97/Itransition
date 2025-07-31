import crypto from 'crypto';
import readline from 'readline';

export class CollaborativeRandom {
    constructor(range) {
        if (!Number.isInteger(range) || range <= 0) {
            throw new Error('Range must be a positive integer.');
        }

        this.range = range;


        this.key = crypto.randomBytes(32); // 256-bit key

        let byte;
        do {
            byte = crypto.randomBytes(1)[0]; // 0-255
        } while (byte >= Math.floor(256 / this.range) * this.range);

        this.computerNumber = byte % this.range;
        this.hmac = this.computeHMAC(this.computerNumber);
    }

    async runProtocol(phaseName) {
        console.log(`\nFair number generation for ${phaseName}:`);
        console.log(`I selected a random value in the range 0..${this.range - 1} (HMAC=${this.hmac}).`);

        const userInput = await this.askUserNumber();

        const result = (userInput + this.computerNumber) % this.range;
        console.log(`My number is ${this.computerNumber} (KEY=${this.key.toString('hex')}).`);
        console.log(`The fair number generation result is ${this.computerNumber} + ${userInput} = ${result} (mod ${this.range}).`);
        return result;
    }

    computeHMAC(value) {
        const hmac = crypto.createHmac('sha3-256', this.key);
        hmac.update(value.toString());
        return hmac.digest('hex');
    }

    askUserNumber() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const prompt = () => {
            return new Promise((resolve) => {
                rl.question(this.getPromptText(), (input) => {
                    input = input.trim().toUpperCase();

                    if (input === 'X') {
                        console.log('👋 Exiting...');
                        process.exit(0);
                    } else if (input === '?') {
                        console.log('ℹ Please enter a number between 0 and', this.range - 1);
                        return resolve(prompt());
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
        let text = `Add your number modulo ${this.range}:\n`;
        for (let i = 0; i < this.range; i++) {
            text += `${i} - ${i}\n`;
        }
        text += 'X - exit\n? - help\nYour selection: ';
        return text;
    }
}
