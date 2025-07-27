export class Dice {
    constructor(faces) {
        if (!Array.isArray(faces) || faces.length !== 6) {
            throw new Error('Each dice must have exactly 6 integer values.');
        }
        this.faces = faces;
    }

    getFace(index) {
        if (index < 0 || index >= this.faces.length) {
            throw new Error('Invalid index for dice face.');
        }
        return this.faces[index];
    }

    toString() {
        return `[${this.faces.join(',')}]`;
    }

    getLength() {
        return this.faces.length;
    }

}
