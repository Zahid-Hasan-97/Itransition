import Table from 'cli-table3';

export class TableRenderer {
    static render(diceList, matrix) {
        console.log('\nProbability of the win for the user:\n');

        const headers = diceList.map(d => d.toString());
        const table = new Table({
            head: ['User dice vs', ...headers],
            style: {
                head: ['cyan'],
                border: ['grey']
            },
            colWidths: [20, ...headers.map(h => Math.max(h.length + 2, 16))],
        });

        for (let i = 0; i < diceList.length; i++) {
            const row = [];
            for (let j = 0; j < diceList.length; j++) {
                if (i === j) {
                    row.push('—');
                } else {
                    const prob = matrix[i][j];
                    row.push(prob);
                }
            }
            table.push([headers[i], ...row]);
        }

        console.log(table.toString());
    }
}