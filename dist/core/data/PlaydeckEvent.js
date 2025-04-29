"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckEvent = void 0;
class PlaydeckEvent {
    #sData;
    constructor(sData) {
        this.#sData = sData;
    }
    getPlaydeckValues() {
        return [];
    }
    log() {
        console.log(this.#sData);
    }
}
exports.PlaydeckEvent = PlaydeckEvent;
//# sourceMappingURL=PlaydeckEvent.js.map