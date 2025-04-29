import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { getPlaydeckConfigFields, PlaydeckConfig } from './config/PlaydeckConfig.js'
import { UpgradeScripts } from './upgrades/PlaydeckUpgrades.js'

export class PlaydeckInstance extends InstanceBase<PlaydeckConfig> {
	#config!: PlaydeckConfig
	get сonfig(): PlaydeckConfig {
		return this.#config // returns readonly copy (should be {...this.#config} as shalow copy otherwise it will be just ref)
	}
	constructor(internal: unknown) {
		super(internal)
	}
	async destroy(): Promise<void> {
		this.log('debug', 'Playdeck Instance: Destroying...')
	}
	async configUpdated(config: PlaydeckConfig): Promise<void> {
		this.log('debug', 'Playdeck Instance: Updating config...')
		this.#config = config
	}
	getConfigFields(): SomeCompanionConfigField[] {
		this.log('debug', 'Playdeck Instance: Reading config...')
		return getPlaydeckConfigFields()
	}
	async init(config: PlaydeckConfig): Promise<void> {
		this.log('debug', 'Playdeck Instance: Initializing...')
		this.#config = config
		this.updateStatus(InstanceStatus.Connecting)
	}
}

runEntrypoint(PlaydeckInstance, UpgradeScripts)
