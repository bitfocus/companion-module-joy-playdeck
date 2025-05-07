import { CompanionVariableDefinition, CompanionVariableValue, CompanionVariableValues } from '@companion-module/base'

import { LogLevel } from '@companion-module/base'
import { PlaydeckInstance } from '../../index.js'
import { PlaydeckValues } from '../data/PlaydeckStatus.js'

export class PlaydeckState {
	#instance?: PlaydeckInstance
	#values: PlaydeckValues<any, any> | null = null
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#log('debug', 'Star was born!')
	}
	// #current: { global: any; channel: any } // here will be current classes of state
	// #globalState: any
	// #channelState: any
	// #items: Set<any> // items by unique ID
	// updateState(newValues: { global: any; channel: any }): void {}
	setValues(newValues: PlaydeckValues<any, any>): void {
		this.#log('info', `Updating Values`)
		this.#values = newValues
	}
	#log(level: LogLevel, message: string) {
		this.#instance?.log(level, `Playdeck State: ${message}`)
	}
}

export interface PlaydeckStateItem {
	value: CompanionVariableValue | null
	version: string | null
	deprecated: string | null
	stateField: string
	variableDefinition: CompanionVariableDefinition
}
