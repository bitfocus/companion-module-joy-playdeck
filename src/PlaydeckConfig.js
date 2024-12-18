const { SomeCompanionConfigField, Regex } = require('@companion-module/base');

/**
 *
 * @returns { SomeCompanionConfigField[] }
 */
function getPlaydeckConfigFields() {
  return [
    {
      type: 'static-text',
      id: 'disclaimer',
      label: 'Information',
      width: 12,
      value:
        'Since version 3.8 module uses bidirectional WebSocket connection with Playdeck (maybe some earlier versions are working with WebSockets too, but it tested with 3.8). If some troubles => you can use TCP connection. You can see WebSockets port in your playdeck installation directory .\\html\\WebSocketSDK\\Version.js ',
    },
    {
      type: 'textinput',
      label: 'Playdeck IP',
      id: 'host',
      width: 6,
      default: '127.0.0.1',
      required: true,
      regex: Regex.HOSTNAME,
    },
    {
      type: 'number',
      label: 'WebSocket Port (Default: 11411)',
      id: 'wsPort',
      width: 6,
      default: 11411,
      required: false,
    },
    {
      type: 'static-text',
      id: 'disclaimerTCP',
      label: 'TCP CONNECTION',
      width: 12,
      value:
        'If you want to use TCP instead of Websocket connection to send Commands and/or recieve events please turn it on. When one of them is turned on module will not use Websocket connection to implement corresponding functionality',
    },
    {
      type: 'static-text',
      id: 'infoCommands',
      label: 'COMMANDS',
      width: 12,
      value: 'To enable remote control in Playdeck, go to: Settings -> All Settings -> Remote Control -> Incoming. And enable "Remote control via TCP"',
    },

    {
      type: 'number',
      label: 'TCP Port (Default: 11375)',
      id: 'tcpPortCommands',
      width: 6,
      default: 11375,
      required: true,
    },
    {
      type: 'checkbox',
      label: 'Enable TCP Commands',
      id: 'isTCPCommands',
      width: 6,
      default: true,
      required: true,
    },
    {
      type: 'static-text',
      id: 'eventInfo',
      label: 'EVENTS',
      width: 12,
      value: 'To enable feedback in Playdeck, go to: Settings -> All Settings -> Remote Control -> Outgoing. And enable "TCP Events"',
    },
    {
      type: 'number',
      label: 'TCP Port (Default: 11376)',
      id: 'tcpPortEvents',
      width: 6,
      default: 11376,
      required: false,
    },
    {
      type: 'checkbox',
      label: 'Enable TCP Events',
      id: 'isTCPEvents',
      width: 6,
      default: true,
      required: true,
    },
  ];
}
module.exports = { getPlaydeckConfigFields };
