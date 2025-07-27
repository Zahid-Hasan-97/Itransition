import { CollaborativeRandom } from './CollaborativeRandom.js';

export class DiceRoller {
    constructor(userDice, computerDice) {
        this.userDice = userDice;
        this.computerDice = computerDice;
    }

    async roll() {
        console.log('\nLet’s roll the dice... Fairly!');
        const userRoll = await new CollaborativeRandom(this.userDice.getLength()).runProtocol('user roll');
        const computerRoll = await new CollaborativeRandom(this.computerDice.getLength()).runProtocol('computer roll');


        const userFace = this.userDice.getFace(userRoll);
        const computerFace = this.computerDice.getFace(computerRoll);

        console.log(`You rolled: ${userFace}`);
        console.log(`I rolled: ${computerFace}`);

        let winner = null;
        if (userFace > computerFace) {
            winner = 'user';
        } else if (userFace < computerFace) {
            winner = 'computer';
        } else {
            winner = 'draw';
        }

        return {
            userRoll,
            userFace,
            computerRoll,
            computerFace,
            winner,
        };
    }
}
