const { InstanceBase, runEntrypoint, InstanceStatus, CompanionActionDefinitions, CompanionVariableDefinition } = require('@companion-module/base');
const { getPlaydeckConfigFields, PlaydeckConfig } = require('../PlaydeckConfig');
const UpgradeScripts = require('../upgrades');
const { PlaydeckFeedbacks } = require('../PlaydeckFeedbacks');
const { PlaydeckVersion } = require('../PlaydeckVersion');
const { PlaydeckActions } = require('../PlaydeckActions');
const { PlaydeckPresets } = require('../PlaydeckPresets');
const { PlaydeckState } = require('../PlaydeckState');

const { PlaydeckConnectionManager } = require('../PlaydeckConnections/PlaydeckConnectionManager');
class PlaydeckInstance extends InstanceBase {
  /** @type { PlaydeckConfig } */
  config;
  /** @type { PlaydeckVersion } */
  version;
  /** @type { PlaydeckState } */
  state;
  /** @type { CompanionVariableDefinition[] } */
  variableDefinitions = [];
  /** @type { CompanionActionDefinitions } */
  actionDefinitions = {};

  constructor(internal) {
    super(internal);
  }

  async init(config) {
    this.config = config;
    this.version = new PlaydeckVersion(this.config.version);
    this.state = new PlaydeckState(this);
    this.updateStatus(InstanceStatus.Connecting);
    this.connectionManager = new PlaydeckConnectionManager(this);
    this.actions = new PlaydeckActions(this);
    this.feedbacks = new PlaydeckFeedbacks(this);
    this.presets = new PlaydeckPresets(this);
  }

  // When module gets deleted
  async destroy() {
    this.log('debug', 'Playdeck Instance: destroying...');
    this.connectionManager.destroy();
  }

  async configUpdated(config) {
    this.log('debug', 'Playdeck Instance: Updating config...');
    this.destroy();
    this.config = config;
    this.init(config);
  }
  getConfigFields() {
    return getPlaydeckConfigFields();
  }
}

runEntrypoint(PlaydeckInstance, UpgradeScripts);

module.exports = PlaydeckInstance;
