"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaydeckConfigFields = getPlaydeckConfigFields;
const base_1 = require("@companion-module/base");
const PlaydeckVersion_js_1 = require("../core/version/PlaydeckVersion.js");
const PlaydeckLogo_js_1 = require("./PlaydeckLogo.js");
function getPlaydeckConfigFields() {
    return [
        {
            type: 'static-text',
            id: 'disclaimer',
            label: 'Information',
            width: 9,
            value: 'Since version 3.6b6 module uses bidirectional WebSocket connection with Playdeck. If some troubles => you can use TCP connection. You can see WebSockets port in your playdeck installation directory .\\html\\WebSocketSDK\\Version.js ',
        },
        {
            type: 'dropdown',
            id: 'version',
            label: 'Version',
            width: 3,
            allowCustom: false,
            choices: PlaydeckVersion_js_1.PlaydeckVersion.configVersions,
            default: PlaydeckVersion_js_1.PlaydeckVersion.configVersions[0].id,
        },
        {
            type: 'textinput',
            label: 'Playdeck IP',
            id: 'host',
            width: 6,
            default: '127.0.0.1',
            required: true,
            regex: base_1.Regex.HOSTNAME,
        },
        {
            type: 'checkbox',
            label: 'Advanced (Manual Mode)',
            id: 'isAdvanced',
            width: 12,
            default: false,
        },
        {
            type: 'static-text',
            id: 'advancedDisclaimer',
            label: 'Disclaimer',
            width: 9,
            value: 'For more fine-tuning, use the "Advanced" switch. This is manual mode! Make changes only if you are sure they are necessary.',
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === false;
            },
        },
        {
            type: 'static-text',
            id: 'infoWS',
            label: 'WebSockets',
            width: 12,
            value: 'WebSockets enabled by default',
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true;
            },
        },
        {
            type: 'checkbox',
            label: 'Enable WS Connection',
            id: 'isWS',
            width: 6,
            default: true,
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true;
            },
        },
        {
            type: 'number',
            label: 'WebSocket Port (Default: 11411)',
            id: 'wsPort',
            width: 6,
            default: 11411,
            required: false,
            min: 0,
            max: 65535,
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true;
            },
        },
        {
            type: 'static-text',
            id: 'infoCommands',
            label: 'TCP COMMANDS',
            width: 12,
            value: 'To enable remote control in Playdeck, go to: Settings -> All Settings -> Remote Control -> Incoming. And enable "Remote control via TCP"',
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true;
            },
        },
        {
            type: 'checkbox',
            label: 'Enable TCP Commands',
            id: 'isTCPCommands',
            width: 6,
            default: false,
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true;
            },
        },
        {
            type: 'number',
            label: 'TCP Port (Default: 11375)',
            id: 'tcpPortCommands',
            width: 6,
            default: 11375,
            required: false,
            min: 0,
            max: 65535,
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true && config.isTCPCommands === true;
            },
        },
        {
            type: 'static-text',
            id: 'eventInfo',
            label: 'TCP EVENTS',
            width: 12,
            value: 'To enable feedback in Playdeck, go to: Settings -> All Settings -> Remote Control -> Outgoing. And enable "TCP Events"',
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true;
            },
        },
        {
            type: 'checkbox',
            label: 'Enable TCP Events',
            id: 'isTCPEvents',
            width: 6,
            default: false,
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true;
            },
        },
        {
            type: 'number',
            label: 'TCP Port (Default: 11376)',
            id: 'tcpPortEvents',
            width: 6,
            default: 11376,
            required: false,
            min: 0,
            max: 65535,
            isVisible: (configOptions) => {
                const config = configOptions;
                return config.isAdvanced === true && config.isTCPEvents === true;
            },
        },
        {
            type: 'static-text',
            id: 'footer',
            label: '',
            width: 9,
            value: `
			<div>
				<p>Found a bug or have suggestions for improvement? Open an issue on <a href="https://github.com/bitfocus/companion-module-joy-playdeck/issues"">GitHub</a></p>
				<img loading="lazy" decoding="async" src="${PlaydeckLogo_js_1.PlaydeckLogo}" width="30" height="30">   Approved by <a href="https://playdeck.tv/"">Playdeck</a></img>			
			</div>
			`,
        },
    ];
}
// const CHOICES_VERSIONS = [
// 	{ id: '4.1b3', label: '4.1b3' },
// 	{ id: '3.8b13', label: '3.8b13' },
// 	{ id: '3.8b8', label: '3.8b8' },
// 	{ id: '3.8b4', label: '3.8b4' },
// 	{ id: '3.7b11', label: '3.7b11' },
// 	{ id: '3.7b4', label: '3.7b4' },
// 	{ id: '3.6b18', label: '3.6b18' },
// 	{ id: '3.5b12', label: '3.5b12 ONLY TCP' },
// 	{ id: '3.5b3', label: '3.5b3 ONLY TCP' },
// 	{ id: '3.4b8', label: '3.4b8 ONLY TCP COMMANDS' },
// 	{ id: '3.2b12', label: '3.2b12 ONLY TCP COMMANDS' },
// 	{ id: '3.2b11', label: '3.2b11 ONLY TCP COMMANDS' },
// 	{ id: '3.2b8', label: '3.2b8 ONLY TCP COMMANDS' },
// 	{ id: '3.2b2', label: '3.2b2 ONLY TCP COMMANDS' },
// ]
//# sourceMappingURL=PlaydeckConfig.js.map