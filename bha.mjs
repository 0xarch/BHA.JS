class BHA {
    unitCount = 16;
    unitLength = 16;
    basicNumbers = [];
    defaultKeys = [];
    constructor({unitCount=16,unitLength=16,defaultKeys=[]}={}){
        this.unitCount = unitCount;
        this.unitLength = unitLength;
        this.defaultKeys = defaultKeys;
        this.basicNumbers = (() => {
            let hashBasicNumbers = [];
            for (let i = 0; i < unitCount; i++) {
                let number = Math.PI * i * (unitCount * 2 % Math.E) ** Math.E;
                number -= number % 1;
                hashBasicNumbers[i] = number;
            }
            return hashBasicNumbers;
        })();
    }
    encrypt(input,...key){
        key.unshift(...this.defaultKeys);
        let hashes = [...this.basicNumbers], calcRange = this.unitCount + key.length;
        key.filter(v => Number.isInteger(v)).forEach(v => hashes.splice(v % this.unitCount, 0, v));
        let cutted = input, basix = 0, symbols = [], index = 0;
        [...cutted].forEach(v => basix += v.charCodeAt(0));
        for (let i = 0; i < this.unitCount; i++) symbols[i] = 0;
        for (let i = 0; cutted.length < 4 * this.unitCount + input.length; i++) cutted = cutted.slice(0, i) + Math.sin(basix * i).toString(16).charAt(3) + cutted.slice(i);
        [...cutted].forEach((v, i) => {
            let charCode = v.charCodeAt(0);
            basix += charCode;
            if (index >= this.unitCount) index = 0;
            symbols[index] += basix % charCode + Math.floor(hashes[i % calcRange] / ++index);
        });
        return [...symbols.splice(basix % this.unitCount).reverse(), ...symbols].map(v => {
            let append = (Math.sqrt((hashes[v % calcRange] + v) * Math.SQRT2) ** Math.E % 1).toString(16).substring(2);
            while (append.length < this.unitLength) append = append.slice(0, 4) + Math.abs(Math.round(Math.sin(v * ++index) * (1 << 10))).toString(16) + append.slice(4);
            let cutIndex = Math.ceil(append.length / 2), halfLength = Math.round(this.unitLength / 2);
            return append.substring(cutIndex - halfLength, cutIndex + halfLength);
        });
    }
}

export default BHA;