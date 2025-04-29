import { CompanionVariableDefinition, CompanionVariableValue, CompanionVariableValues } from '@companion-module/base'
export class PlaydeckState {
	// #current: { global: any; channel: any } // here will be current classes of state
	// #globalState: any
	// #channelState: any
	// #items: Set<any> // items by unique ID
	// updateState(newValues: { global: any; channel: any }): void {}
}

export interface PlaydeckStateItem {
	value: CompanionVariableValue | null
	version: string | null
	deprecated: string | null
	stateField: string
	variableDefinition: CompanionVariableDefinition
}
