const { SomeCompanionConfigField, Regex } = require('@companion-module/base');
const { TestClass } = require('./TestClass');
class PlaydeckConfig {
  /** @type { string }  */
  version;
  /** @type { string }  */
  host;
  /** @type { string }  */
  wsPort;
  /**  @type { string } */
  tcpPortCommands;
  /** @type { boolean } */
  isTCPCommands;
  /** @type { string } */
  tcpPortEvents;
  /** @type { boolean }  */
  isTCPEvents;
}

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
      width: 9,
      value:
        'Since version 3.6b6 module uses bidirectional WebSocket connection with Playdeck. If some troubles => you can use TCP connection. You can see WebSockets port in your playdeck installation directory .\\html\\WebSocketSDK\\Version.js ',
    },
    {
      type: 'dropdown',
      id: 'version',
      label: 'Version',
      width: 3,
      allowCustom: false,
      choices: TestClass.getFields(),
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
    {
      type: 'checkbox',
      label: 'Hide Option',
      id: 'isHidden',
      width: 12,
      default: false,
      required: true,
    },
    {
      type: 'number',
      label: 'Some hidden option',
      isVisible: TestClass.FLSEE,
      id: 'hiddenNum',
      width: 6,
      default: 11376,
      required: false,
    },
    {
      type: 'checkbox',
      label: 'Hide Option',
      isVisible: (configValues) => configValues.isHidden,
      id: 'someCheck',
      width: 6,
      default: false,
      required: true,
    },
  ];
}

// const CHOICES_VERSIONS = [
//   { id: '4.1b3', label: '4.1b3' },
//   { id: '3.8b13', label: '3.8b13' },
//   { id: '3.8b8', label: '3.8b8' },
//   { id: '3.8b4', label: '3.8b4' },
//   { id: '3.7b11', label: '3.7b11' },
//   { id: '3.7b4', label: '3.7b4' },
//   { id: '3.6b18', label: '3.6b18' },
//   { id: '3.5b12', label: '3.5b12 ONLY TCP' },
//   { id: '3.5b3', label: '3.5b3 ONLY TCP' },
//   { id: '3.4b8', label: '3.4b8 ONLY TCP COMMANDS' },
//   { id: '3.2b12', label: '3.2b12 ONLY TCP COMMANDS' },
//   { id: '3.2b11', label: '3.2b11 ONLY TCP COMMANDS' },
//   { id: '3.2b8', label: '3.2b8 ONLY TCP COMMANDS' },
//   { id: '3.2b2', label: '3.2b2 ONLY TCP COMMANDS' },
// ];
module.exports = { getPlaydeckConfigFields, PlaydeckConfig };
