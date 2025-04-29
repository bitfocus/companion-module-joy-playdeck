import { PlaydeckStateItem } from '../PlaydeckState'

export class PlaydeckChannelStateItems {
	#channel: number
	constructor(channel: number) {
		this.#channel = channel
	}
	getItems(): Array<PlaydeckStateItem> {
		return [
			{
				value: null,
				version: null,
				deprecated: null,
				stateField: '',
				variableDefinition: {
					variableId: '',
					name: '',
				},
			},
		]
	}
}
