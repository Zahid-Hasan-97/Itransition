import crypto from 'crypto';

export class FairRandomGenerator {
    constructor(range) {
        if (!Number.isInteger(range) || range <= 0) {
            throw new Error('Range must be a positive integer.');
        }
        this.range = range; // যেমন 2 → 0,1 || 6 → 0-5
        this.key = crypto.randomBytes(32); // 256-bit secure key
        this.number = this.generateUniformNumber(range); // secure random number
        this.hmac = this.computeHMAC(this.number);
    }

    generateUniformNumber(range) {
        // Uniform random number in 0..(range - 1)
        const max = 256;
        const min = 0;
        let rand;

        // Reject numbers that would cause bias
        do {
            rand = crypto.randomBytes(1)[0]; // 0–255
        } while (rand >= Math.floor(256 / range) * range);

        return rand % range;
    }

    computeHMAC(value) {
        const hmac = crypto.createHmac('sha3-256', this.key);
        hmac.update(value.toString());
        return hmac.digest('hex');
    }

    getHMAC() {
        return this.hmac;
    }

    getKeyHex() {
        return this.key.toString('hex');
    }

    getComputerNumber() {
        return this.number;
    }
}
