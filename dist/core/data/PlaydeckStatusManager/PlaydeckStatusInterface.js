"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatusInterface = void 0;
class PlaydeckStatusInterface {
    #common;
    #channel;
    getValues() {
        return {
            common: this.#common,
            channel: [this.#channel],
        };
    }
}
exports.PlaydeckStatusInterface = PlaydeckStatusInterface;
//# sourceMappingURL=PlaydeckStatusInterface.js.map