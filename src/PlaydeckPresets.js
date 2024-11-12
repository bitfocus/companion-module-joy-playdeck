class PlaydeckPresets {
  constructor(instance) {
    this.instance = instance;
    this.init();
  }
  init() {}

  log(level, message) {
    return this.instance.log(level, message);
  }

  updateStatus(status) {
    this.instance.updateStatus(status);
  }
}

module.exports = {
  PlaydeckPresets,
};
