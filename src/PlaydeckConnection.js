const EventEmitter = require('events');
const { InstanceStatus, TCPHelper } = require('@companion-module/base');

class PlayDeckConnection extends EventEmitter {
  constructor(instance) {
    super();
    this.instance = instance;
    this.status = InstanceStatus.Disconnected;
    this.init();
  }
  init() {
    this.log('info', `Connecting to Playdeck Commands...`);
    this.updateStatus(InstanceStatus.Connecting);
    this.actions = new TCPHelper(this.instance.config.host, this.instance.config.port);

    this.actions.on('status_change', (status, message) => {
      this.instance.log('debug', `Commands socket - Status: ${status}${message ? ' - Message: ' + message : ''}`);

      if (status === 'ok') {
        this.log('info', `Connected to Playdeck Commands!`);
        this.updateStatus(InstanceStatus.Ok);
      } else if (status === 'connecting') {
        this.updateStatus(InstanceStatus.Connecting);
      } else if (status === 'disconnected') {
        this.updateStatus(InstanceStatus.Disconnected);
      } else if (status === 'unknown_error') {
        this.updateStatus(InstanceStatus.UnknownError);
      }
      this.actions.on('error', (err) => {
        this.instance.updateStatus(InstanceStatus.UnknownError);
        if (err.message != this.actions.errMessage) {
          this.instance.log(this.instance.config.connectionErrorLog ? 'error' : 'debug', 'Commands Socket err: ' + err.message);
        }
        this.actions.errMessage = err.message;
      });

      this.instance.variables?.updateVariables();
    });

    if (this.instance.config.eventsPort && this.instance.config.isFeedbacks) {
      this.log('info', `Connecting to Playdeck Events...`);
      this.events = new TCPHelper(this.instance.config.host, this.instance.config.eventsPort);
      this.events.on('data', (data) => {
        // this.log('debug', `Recieved event: ${data}`);
      });
      this.events.on('error', (err) => {
        this.updateStatus(InstanceStatus.Connecting);
        if (err.message != this.events.errMessage) {
          this.instance.log(this.instance.config.connectionErrorLog ? 'error' : 'debug', 'Events Socket err: ' + err.message);
        }
        this.events.errMessage = err.message;
      });
      this.events.on('status_change', (status, message) => {
        this.instance.log('debug', `Events socket - Status: ${status}${message ? ' - Message: ' + message : ''}`);

        if (status === 'ok') {
          this.log('info', `Connected to Playdeck Events!`);
          this.updateStatus(InstanceStatus.Ok);
        }
      });
    }
  }
  log(level, message) {
    this.instance.log(level, message);
  }
  updateStatus(status) {
    this.instance.updateStatus(status);
    this.status = status;
  }
  destroy() {
    this.actions.destroy();
    this.events?.destroy();
  }
}

module.exports = {
  PlayDeckConnection,
};
