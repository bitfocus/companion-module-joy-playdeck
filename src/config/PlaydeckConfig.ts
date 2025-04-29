import { SomeCompanionConfigField, Regex, CompanionOptionValues } from '@companion-module/base'
import { PlaydeckVersion, Version } from '../core/version/PlaydeckVersion.js'
import { PlaydeckLogo } from './PlaydeckLogo.js'
export interface PlaydeckConfig extends CompanionOptionValues {
	version: Version
	host: string
	isAdvanced: boolean
	wsPort: number
	isWS: boolean
	isTCPCommands: boolean
	tcpPortCommands: number
	isTCPEvents: boolean
	tcpPortEvents: number
}

export function getPlaydeckConfigFields(): SomeCompanionConfigField[] {
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
			choices: PlaydeckVersion.configVersions,
			default: PlaydeckVersion.configVersions[0].id,
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
			value:
				'For more detailed settings, use the "Advanced" switch. This is manual mode! Make changes only if you are sure that they are necessary. These settings will override the default settings for the version you selected (if a particular connection type is not supported in the selected version, it will be ignored).',
			isVisible: (configOptions) => {
				const config = configOptions as PlaydeckConfig
				return config.isAdvanced === false
			},
		},
		{
			type: 'static-text',
			id: 'infoWS',
			label: 'WebSockets',
			width: 12,
			value: 'WebSockets enabled by default',
			isVisible: (configOptions, data: { notSupported: Version[] }) => {
				const config = configOptions as PlaydeckConfig
				const supported: boolean = data.notSupported.indexOf(config.version) === -1
				return config.isAdvanced === true && supported
			},
			isVisibleData: {
				notSupported: PlaydeckVersion.noWS,
			},
		},
		{
			type: 'checkbox',
			label: 'Enable WS Connection',
			id: 'isWS',
			width: 6,
			default: true,
			isVisible: (configOptions, data: { notSupported: Version[] }) => {
				const config = configOptions as PlaydeckConfig
				const supported: boolean = data.notSupported.indexOf(config.version) === -1
				return config.isAdvanced === true && supported
			},
			isVisibleData: {
				notSupported: PlaydeckVersion.noWS,
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
			isVisible: (configOptions, data: { notSupported: Version[] }) => {
				const config = configOptions as PlaydeckConfig
				const supported: boolean = data.notSupported.indexOf(config.version) === -1
				return config.isAdvanced === true && supported && config.isWS === true
			},
			isVisibleData: {
				notSupported: PlaydeckVersion.noWS,
			},
		},
		{
			type: 'static-text',
			id: 'infoCommands',
			label: 'TCP COMMANDS',
			width: 12,
			value:
				'To enable remote control in Playdeck, go to: Settings -> All Settings -> Remote Control -> Incoming. And enable "Remote control via TCP"',
			isVisible: (configOptions) => {
				const config = configOptions as PlaydeckConfig
				return config.isAdvanced === true
			},
		},
		{
			type: 'checkbox',
			label: 'Enable TCP Commands',
			id: 'isTCPCommands',
			width: 6,
			default: false,
			isVisible: (configOptions) => {
				const config = configOptions as PlaydeckConfig
				return config.isAdvanced === true
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
				const config = configOptions as PlaydeckConfig
				return config.isAdvanced === true && config.isTCPCommands === true
			},
		},
		{
			type: 'static-text',
			id: 'eventInfo',
			label: 'TCP EVENTS',
			width: 12,
			value:
				'To enable feedback in Playdeck, go to: Settings -> All Settings -> Remote Control -> Outgoing. And enable "TCP Events"',
			isVisible: (configOptions, data: { notSupported: Version[] }) => {
				const config = configOptions as PlaydeckConfig
				const supported: boolean = data.notSupported.indexOf(config.version) === -1
				return config.isAdvanced === true && supported
			},
			isVisibleData: {
				notSupported: PlaydeckVersion.noEvents,
			},
		},
		{
			type: 'checkbox',
			label: 'Enable TCP Events',
			id: 'isTCPEvents',
			width: 6,
			default: false,
			isVisible: (configOptions, data: { notSupported: Version[] }) => {
				const config = configOptions as PlaydeckConfig
				const supported: boolean = data.notSupported.indexOf(config.version) === -1
				return config.isAdvanced === true && supported
			},
			isVisibleData: {
				notSupported: PlaydeckVersion.noEvents,
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
			isVisible: (configOptions, data: { notSupported: Version[] }) => {
				const config = configOptions as PlaydeckConfig
				const supported: boolean = data.notSupported.indexOf(config.version) === -1
				return config.isAdvanced === true && supported && config.isTCPEvents === true
			},
			isVisibleData: {
				notSupported: PlaydeckVersion.noEvents,
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
				<img loading="lazy" decoding="async" src="${PlaydeckLogo}" width="30" height="30">   Approved by <a href="https://playdeck.tv/"">Playdeck</a></img>			
			</div>
			`,
		},
	]
}
