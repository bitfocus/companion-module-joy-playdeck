module.exports = {
  getConfigFields: function () {
    return [
      {
        type: 'static-text',
        id: 'info',
        label: 'Information',
        width: 12,
        value: 'To enable remote control in Playdeck, go to: Settings -> All Settings -> Remote Connection. And enable "Remote control via TCP"',
      },

      {
        type: 'textinput',
        label: 'Target IP',
        id: 'host',
        width: 6,
        regex: this.REGEX_IP,
        default: '127.0.0.1',
        required: true,
      },
      {
        type: 'static-text',
        id: 'PortInfo',
        label: 'Commands',
        width: 12,
        value: '',
      },
      {
        type: 'textinput',
        label: 'TCP Port (Default: 11375)',
        id: 'port',
        width: 6,
        regex: this.REGEX_IP,
        default: '11375',
        required: true,
      },
      {
        type: 'static-text',
        id: 'eventInfo',
        label: 'Feedbacks',
        width: 12,
        value: 'To enable feedback in Playdeck, go to: Settings -> All Settings -> Remote Control -> Outgoing. And enable "TCP Events"',
      },
      {
        type: 'textinput',
        label: 'TCP Port (Default: 11376)',
        id: 'eventsPort',
        width: 6,
        regex: this.REGEX_IP,
        default: '11376',
        required: false,
      },
      {
        type: 'checkbox',
        label: 'Enable Feedbacks',
        id: 'isFeedbacks',
        width: 6,
        default: true,
        required: true,
      },
    ];
  },
};
