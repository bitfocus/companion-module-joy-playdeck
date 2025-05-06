"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatus = void 0;
const PlaydeckStatusFactory_js_1 = require("./PlaydeckStatusManager/PlaydeckStatusFactory.js");
class PlaydeckStatus {
    #instance;
    #values = null;
    constructor(instance, sData) {
        this.#instance = instance;
        try {
            const jsonData = JSON.parse(sData);
            this.#values = PlaydeckStatusFactory_js_1.PlaydeckStatusFactory.create(this.#instance.version, jsonData).getValues();
        }
        catch (e) {
            this.#log('error', `${e}`);
        }
    }
    getValues() {
        return this.#values;
    }
    #log(logLevel, message) {
        this.#instance?.log(logLevel, `PlaydeckStatusHandler: ${message}`);
    }
}
exports.PlaydeckStatus = PlaydeckStatus;
//# sourceMappingURL=PlaydeckStatus.js.map