"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatusV4 = void 0;
const PlaydeckStatusInterface_js_1 = require("../../PlaydeckStatusInterface.js");
class PlaydeckStatusV4 extends PlaydeckStatusInterface_js_1.PlaydeckStatusInterface {
    #common;
    #channel;
    #json;
    #rawData = null;
    constructor(json) {
        super();
        this.#json = json;
        try {
            this.#rawData = JSON.parse(this.#json);
        }
        catch (error) {
            console.log(`PlaydeckStatusV3 Parsing error: ${error.message}`);
        }
        this.#common = {
            d: 12,
        };
        this.#channel = [{ g: 53 }],
        ;
    }
    getValues() {
        if (this.#rawData === null)
            return null;
        return {
            common: this.#common,
            channel: this.#channel,
        };
    }
}
exports.PlaydeckStatusV4 = PlaydeckStatusV4;
//# sourceMappingURL=PlaydeckStatusV4.js.map