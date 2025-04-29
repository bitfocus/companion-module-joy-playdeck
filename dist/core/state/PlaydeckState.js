"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckState = void 0;
class PlaydeckState {
    #instance;
    constructor(instance) {
        this.#instance = instance;
        this.#log('debug', 'Star was born!');
    }
    // #current: { global: any; channel: any } // here will be current classes of state
    // #globalState: any
    // #channelState: any
    // #items: Set<any> // items by unique ID
    // updateState(newValues: { global: any; channel: any }): void {}
    #log(level, message) {
        this.#instance?.log(level, `Playdeck State: ${message}`);
    }
}
exports.PlaydeckState = PlaydeckState;
//# sourceMappingURL=PlaydeckState.js.map