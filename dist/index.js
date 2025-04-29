"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckInstance = void 0;
const base_1 = require("@companion-module/base");
const PlaydeckConfig_js_1 = require("./config/PlaydeckConfig.js");
const PlaydeckUpgrades_js_1 = require("./upgrades/PlaydeckUpgrades.js");
const PlaydeckVersion_js_1 = require("./core/version/PlaydeckVersion.js");
const PlaydeckState_js_1 = require("./core/state/PlaydeckState.js");
const PlaydeckConnectionManager_js_1 = require("./core/connections/PlaydeckConnectionManager.js");
class PlaydeckInstance extends base_1.InstanceBase {
    #config;
    /**
     * returns readonly copy of config
     */
    get config() {
        if (this.#config === undefined)
            return null;
        return {
            version: this.#config.version,
            host: this.#config.host,
            isAdvanced: this.#config.isAdvanced,
            wsPort: this.#config.wsPort,
            isWS: this.#config.isWS,
            isTCPCommands: this.#config.isTCPCommands,
            tcpPortCommands: this.#config.tcpPortCommands,
            isTCPEvents: this.#config.isTCPEvents,
            tcpPortEvents: this.#config.tcpPortEvents,
        };
    }
    version;
    variableDefinitions = [];
    actionDefinitions = {};
    state;
    connectionManager;
    constructor(internal) {
        super(internal);
    }
    async destroy() {
        this.log('debug', 'Playdeck Instance: Destroying...');
    }
    async configUpdated(config) {
        this.log('debug', 'Playdeck Instance: Updating config...');
        await this.destroy();
        await this.init(config);
    }
    getConfigFields() {
        this.log('debug', 'Playdeck Instance: Reading config...');
        return (0, PlaydeckConfig_js_1.getPlaydeckConfigFields)();
    }
    async init(config) {
        this.log('debug', 'Playdeck Instance: Initializing...');
        this.#config = config;
        this.updateStatus(base_1.InstanceStatus.Connecting, `Playdeck Instance: starting...`);
        this.version = new PlaydeckVersion_js_1.PlaydeckVersion(this.#config.version);
        this.state = new PlaydeckState_js_1.PlaydeckState(this);
        this.connectionManager = new PlaydeckConnectionManager_js_1.PlaydeckConnectionManager(this);
    }
}
exports.PlaydeckInstance = PlaydeckInstance;
(0, base_1.runEntrypoint)(PlaydeckInstance, PlaydeckUpgrades_js_1.UpgradeScripts);
//# sourceMappingURL=index.js.map