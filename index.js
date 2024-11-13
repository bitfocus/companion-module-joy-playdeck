const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base');
const configs = require('./src/configs');
const UpgradeScripts = require('./src/upgrades');
const { PlayDeckConnection } = require('./src/PlaydeckConnection');
const { PlaydeckFeedbacks } = require('./src/PlaydeckFeedbacks');
const { PlaydeckActions } = require('./src/PlaydeckActions');
const { PlaydeckPresets } = require('./src/PlaydeckPresets');
class PlaydeckModuleInstance extends InstanceBase {
  constructor(internal) {
    super(internal);

    // Assign the methods from the listed files to this class
    Object.assign(this, {
      ...configs,
      // ...actions,
      // ...feedbacks,
      // ...variables,
      // ...connection,
      //...presets,
    });
  }

  async init(config) {
    this.config = config;
    this.updateStatus(InstanceStatus.Connecting);
    this.connection = new PlayDeckConnection(this);
    this.feedbacks = new PlaydeckFeedbacks(this);
    this.actions = new PlaydeckActions(this);
    this.presets = new PlaydeckPresets(this);
  }
  // When module gets deleted
  async destroy() {
    this.connection.destroy();
    this.log('debug', 'destroy');
  }

  async configUpdated(config) {
    this.config = config;
    this.connection.destroy();
    this.init(config);
  }
}

runEntrypoint(PlaydeckModuleInstance, UpgradeScripts);
