import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	CompanionVariableDefinition,
	CompanionActionDefinitions,
	LogLevel,
} from '@companion-module/base'
import { getPlaydeckConfigFields, PlaydeckConfig } from './config/PlaydeckConfig.js'
import { UpgradeScripts } from './upgrades/PlaydeckUpgrades.js'
import { PlaydeckVersion } from './core/version/PlaydeckVersion.js'
import { PlaydeckState } from './core/state/PlaydeckState.js'
import { PlaydeckConnectionManager } from './core/connections/PlaydeckConnectionManager.js'
export class PlaydeckInstance extends InstanceBase<PlaydeckConfig> {
	#config!: PlaydeckConfig
	/**
	 * returns readonly copy of config
	 */
	get config(): PlaydeckConfig {
		return {
			version: this.#config?.version,
			host: this.#config?.host,
			isAdvanced: this.#config?.isAdvanced,
			wsPort: this.#config?.wsPort,
			isWS: this.#config?.isWS,
			isTCPCommands: this.#config?.isTCPCommands,
			tcpPortCommands: this.#config?.tcpPortCommands,
			isTCPEvents: this.#config?.isTCPEvents,
			tcpPortEvents: this.#config?.tcpPortEvents,
		}
	}
	version?: PlaydeckVersion
	variableDefinitions: CompanionVariableDefinition[] = []
	actionDefinitions: CompanionActionDefinitions = {}
	state?: PlaydeckState
	connectionManager?: PlaydeckConnectionManager
	#lastLazyLogTimestamp: number | null = null
	#lastLazyStatusTimestamp: number | null = null
	#lazyLogInterval: number = 3000
	constructor(internal: unknown) {
		super(internal)
	}
	async destroy(): Promise<void> {
		this.log('debug', 'Playdeck Instance: Destroying...')
		await this.connectionManager?.destroy()
	}
	async configUpdated(config: PlaydeckConfig): Promise<void> {
		this.log('debug', 'Playdeck Instance: Updating config...')
		await this.destroy()
		await this.init(config)
	}
	getConfigFields(): SomeCompanionConfigField[] {
		this.log('debug', 'Playdeck Instance: Reading config...')
		return getPlaydeckConfigFields()
	}
	async init(config: PlaydeckConfig): Promise<void> {
		this.log('debug', 'Playdeck Instance: Initializing...')
		this.#config = config
		this.updateStatus(InstanceStatus.Connecting, `Playdeck Instance: starting...`)
		this.version = new PlaydeckVersion(this.#config.version)
		this.connectionManager = new PlaydeckConnectionManager(this)
		this.state = new PlaydeckState(this)
	}
	/** for log fast events not so fast (one time per `#lazyLogInterval`)*/
	lazyLog(logLevel: LogLevel, message: string): void {
		const newLastTimestamp = this.#updateLastLazyTimestamp(this.#lastLazyLogTimestamp)
		if (newLastTimestamp) {
			this.#lastLazyLogTimestamp = newLastTimestamp
			this.log(logLevel, `Lazy: ${message}`)
		}
	}
	#updateLastLazyTimestamp(lastLazyTimestamp: number | null): number | null {
		const timestamp = Date.now()
		if (lastLazyTimestamp === null || timestamp - lastLazyTimestamp > this.#lazyLogInterval) return timestamp
		return null
	}
	/** for log fast events not so fast (one time per `#lazyLogInterval`) */
	lazyUpdateStatus(status: InstanceStatus, message: string | null): void {
		const newLastTimestamp = this.#updateLastLazyTimestamp(this.#lastLazyStatusTimestamp)
		if (newLastTimestamp) {
			this.#lastLazyStatusTimestamp = newLastTimestamp
			this.updateStatus(status, message)
		}
	}
}

runEntrypoint(PlaydeckInstance, UpgradeScripts)
