const { InstanceBase, Regex, runEntrypoint, InstanceStatus, CompanionVariableDefinition, CompanionActionDefinition } = require('@companion-module/base');
const { getPlaydeckConfigFields } = require('./src/PlaydeckConfig');
const { PlaydeckConfig } = require('./src/PlaydeckTypes');
const UpgradeScripts = require('./src/upgrades');
// const { PlaydeckConnections } = require('./src/PlaydeckConnections');
// const { PlaydeckFeedbacks } = require('./src/PlaydeckFeedbacks');
// const { PlaydeckActions } = require('./src/PlaydeckActions');
// const { PlaydeckPresets } = require('./src/PlaydeckPresets');
const { PlaydeckState } = require('./src/PlaydeckState');
const { PlaydeckWSConnection } = require('./src/PlaydeckWSConnection');

class PlaydeckInstance extends InstanceBase {
  constructor(internal) {
    super(internal);
  }

  async init(config) {
    /**
     * @type { PlaydeckConfig }
     */
    this.config = config;
    /**
     * @type { PlaydeckState }
     */
    this.state = new PlaydeckState(this);
    /**
     * @type { CompanionVariableDefinition[] }
     */
    this.variableDefinitions = [];
    /**
     * @type { CompanionActionDefinition[] }
     */
    this.actionDefinitions = [];

    this.updateStatus(InstanceStatus.Connecting);
    this.ws = new PlaydeckWSConnection(this);
    // this.connections = new PlaydeckConnections(this);
    // this.feedbacks = new PlaydeckFeedbacks(this);
    // this.actions = new PlaydeckActions(this);
    // this.presets = new PlaydeckPresets(this);
  }
  // When module gets deleted
  async destroy() {
    // this.connections.destroy();
    this.log('debug', 'destroy');
  }

  async configUpdated(config) {
    this.config = config;
    // this.connections.destroy();
    this.init(config);
  }
  getConfigFields() {
    return getPlaydeckConfigFields();
  }
}

runEntrypoint(PlaydeckInstance, UpgradeScripts);

module.exports = PlaydeckInstance;
