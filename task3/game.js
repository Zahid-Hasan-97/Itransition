import { DiceParser } from './DiceParser.js';
import { CollaborativeRandom } from './CollaborativeRandom.js';
import { DiceSelector } from './DiceSelector.js';
import { DiceRoller } from './DiceRoller.js';

function validateDiceArgs(args) {
    if (args.length === 0) {
        throw new Error("No dice provided.\nExample: node game.js 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7");
    }

    // Validate dice one by one
    for (const arg of args) {
        const faces = arg.split(',');

        // Check if any face is non-integer BEFORE checking total dice
        for (const face of faces) {
            const num = Number(face.trim());
            if (!Number.isInteger(num)) {
                throw new Error(`Non-integer value in dice "${arg}": "${face.trim()}"`);
            }
        }

        if (faces.length !== 6) {
            throw new Error(`Dice "${arg}" has ${faces.length} sides. Each dice must have exactly 6 sides.`);
        }
    }

    // Now check total dice
    if (args.length < 3) {
        throw new Error(`Only ${args.length} dice provided. At least 3 required.`);
    }
}



try {
    const args = process.argv.slice(2);

    // First validate the input args with specific messages
    validateDiceArgs(args);

    const diceList = DiceParser.parse(args);

    console.log('Dice successfully loaded:');
    diceList.forEach((dice, idx) => {
        console.log(`${idx}: [${dice.faces.join(',')}]`);
    });

    const chooser = new CollaborativeRandom(2);
    const result = await chooser.runProtocol('Fair number generation for who chooses dice first');

    const selector = new DiceSelector(diceList);
    let userIndex, computerIndex;

    if (result === 1) {
        console.log('\nI go first.');
        computerIndex = selector.computerSelect(); // Computer chooses first
        userIndex = await selector.userSelect(computerIndex); // User can't select same dice
    } else {
        console.log('\nYou go first.');
        userIndex = await selector.userSelect(); // User chooses first
        computerIndex = selector.computerSelect(userIndex); // Computer can't select same dice
    }

    console.log(`\nFinal Selection:`);
    console.log(`You chose: [${diceList[userIndex].faces.join(',')}]`);
    console.log(`I chose: [${diceList[computerIndex].faces.join(',')}]`);

    // Fair Dice Rolling
    const roller = new DiceRoller(diceList[userIndex], diceList[computerIndex]);
    const resultObj = await roller.roll();

    console.log('\nResult:');
    if (resultObj.winner === 'user') {
        console.log('You win!');
    } else if (resultObj.winner === 'computer') {
        console.log('I win!');
    } else {
        console.log('It’s a draw.');
    }
} catch (err) {
    console.error('\nError:', err.message);
}
