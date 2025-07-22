import { CompanionPresetDefinitions, LogLevel } from '@companion-module/base'
import { PlaydeckInstance } from '../../index.js'
import { PLaydeckPresetsFactory } from './Items/PlaydeckPresetsFactory.js'

export class PlaydeckPresets {
	#instance: PlaydeckInstance
	#presetDefinitions: CompanionPresetDefinitions = {}
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#init()
	}
	#init() {
		this.#log('debug', `Let's make some presets for you...`)
		this.#presetDefinitions = PLaydeckPresetsFactory.create(this.#instance)
		this.#instance?.setPresetDefinitions(this.#presetDefinitions)
	}
	#log(level: LogLevel, message: string) {
		this.#instance.log(level, `Playdeck Presets: ${message}`)
	}
}
