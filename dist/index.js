"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckInstance = void 0;
const base_1 = require("@companion-module/base");
const PlaydeckConfig_js_1 = require("./config/PlaydeckConfig.js");
const PlaydeckUpgrades_js_1 = require("./upgrades/PlaydeckUpgrades.js");
class PlaydeckInstance extends base_1.InstanceBase {
    #config;
    get сonfig() {
        return this.#config; // returns readonly copy (should be {...this.#config} as shalow copy otherwise it will be just ref)
    }
    constructor(internal) {
        super(internal);
    }
    async destroy() {
        this.log('debug', 'Playdeck Instance: Destroying...');
    }
    async configUpdated(config) {
        this.log('debug', 'Playdeck Instance: Updating config...');
        this.#config = config;
    }
    getConfigFields() {
        this.log('debug', 'Playdeck Instance: Reading config...');
        return (0, PlaydeckConfig_js_1.getPlaydeckConfigFields)();
    }
    async init(config) {
        this.log('debug', 'Playdeck Instance: Initializing...');
        this.#config = config;
        this.updateStatus(base_1.InstanceStatus.Connecting);
    }
}
exports.PlaydeckInstance = PlaydeckInstance;
(0, base_1.runEntrypoint)(PlaydeckInstance, PlaydeckUpgrades_js_1.UpgradeScripts);
//# sourceMappingURL=index.js.map