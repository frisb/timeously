"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pad(num, size = 2) {
    if (typeof (num) === 'number')
        num = '' + num;
    if (num.length === size)
        return num;
    let s = `000000000${num}`;
    return s.substr(s.length - size);
}
exports.pad = pad;
//# sourceMappingURL=pad.js.map