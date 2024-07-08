class BHA {
    unitCount = 16;
    unitLength = 16;
    basicNumbers = [];
    defaultKeys = [];
    constructor({ unitCount = 16, unitLength = 16, defaultKeys = [] } = {}) {
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

        if(this.unitLength % 2 != 0){
            this.unitLength += 1;
        }
    }
    encrypt(input, ...key) {
        if (!input) throw new TypeError('Input cannot be converted into a true string!');
        key.unshift(...this.defaultKeys);
        let keys = [...this.basicNumbers], calcRange = this.unitCount + key.length + 1;
        key.filter(v => Number.isInteger(v)).forEach(v => keys.splice(v % this.unitCount, 0, v));
        let cutted = input.toString(), basix = keys[cutted.length % keys.length], symbols = [], index = 0;
        [...cutted].forEach(v => basix += v.charCodeAt(0) + cutted.charCodeAt(basix % cutted.length));
        keys.push(basix);
        for (let i = 0; i < this.unitCount; i++) symbols[i] = 0;
        let cutLen = this.unitLength * this.unitCount << 1;
        for (let i = 0; cutted.length < cutLen; i++) {
            let sectionStart = cutted.slice(0, i);
            let sectionEnd = cutted.slice(i);
            let section = (basix * i / Math.E << 10).toString(16);
            cutted = i % 2 == 0
                ? sectionEnd + section + sectionStart
                : sectionStart + section + sectionEnd;
        }
        [...[...cutted].reverse()].forEach((v, i) => {
            let charCode = Math.ceil(v.charCodeAt(0) * (i ** Math.SQRT2));
            basix += ~charCode;
            if (index >= this.unitCount) index = 0;
            symbols[index] += Math.abs(basix % charCode + Math.floor(keys[i % calcRange] / ++index));
        });
        return [...symbols.splice(basix % this.unitCount).reverse(), ...symbols].map(v => {
            let append = (Math.sqrt((keys[v % calcRange] + v)) ** Math.E << 10).toString(16);
            while (append.length < this.unitLength) append = append.slice(0, 4) + Math.abs(Math.round(Math.sin(v * ++index) * (1 << 10))).toString(16) + append.slice(4);
            let cutIndex = Math.ceil(append.length / 2), halfLength = this.unitLength / 2;
            return append.slice(cutIndex - halfLength, cutIndex + halfLength);
        });
    }
}

export default BHA;