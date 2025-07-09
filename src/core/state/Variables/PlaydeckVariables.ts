import {
	CompanionVariableDefinition,
	CompanionVariableValue,
	CompanionVariableValues,
	LogLevel,
} from '@companion-module/base/dist'
import { PlaydeckInstance } from '../../../index.js'
import { PlaydeckStatusValues } from '../../../core/data/PlaydeckStatus.js'
import { PlaydeckVariableItem, variableItems } from './Items/PlaydeckVariableItems.js'

import { PlaydeckEvent } from '../../../core/data/PlaydeckEvents.js'
import { PlaydeckData } from '../../../core/data/PlaydeckData.js'
export class PlaydeckVariables {
	#variables: PlaydeckVariable[] = []
	#variableDifinitions: Set<CompanionVariableDefinition> = new Set()
	#variableValues: CompanionVariableValues = {}
	#instance: PlaydeckInstance
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#log('debug', `Initializing...`)
		this.#initVariables(variableItems)
	}
	#initVariables(variableItems: PlaydeckVariableItem[]): void {
		this.#instance.setVariableDefinitions([])
		variableItems.forEach((variableItem: PlaydeckVariableItem) => {
			if (this.#isDeprecated(variableItem)) return
			const newVar = this.#covertToVariable(variableItem) // need shallow copy because we change `channel` field
			if (newVar.channel === true) {
				const channelCount = this.#instance?.version?.availableChannels()
				if (channelCount) {
					for (let i = 0; i < channelCount; i++) {
						newVar.channel = i
						this.#addVariable(this.#covertToVariable(newVar))
					}
				}
			} else {
				this.#addVariable(newVar)
			}
		})
	}
	#covertToVariable(variableItem: PlaydeckVariableItem): PlaydeckVariable {
		const channel = typeof variableItem.channel === 'number' ? variableItem.channel : undefined
		return {
			variableDefinition: variableItem.getVariableDefinition(channel),
			value: undefined,
			getVariableDefinition: variableItem.getVariableDefinition,
			getCurrentValue: variableItem.getCurrentValue,
			getFromData: variableItem.getFromData,
			getValueFromEvent: variableItem.getValueFromEvent,
			channel: variableItem.channel,
			version: variableItem.version,
			deprecated: variableItem.deprecated,
		}
	}
	#isDeprecated(variable: PlaydeckVariableItem): boolean {
		if (variable.version === null) return true
		if (this.#instance.version?.isLowerThan(variable.version)) return true
		if (variable.deprecated !== null) {
			if (this.#instance.version?.isGreaterOrEqualualTo(variable.deprecated)) return true
		}
		return false
	}
	#addVariable(variable: PlaydeckVariable): void {
		if (variable.variableDefinition !== null) {
			this.#variableDifinitions.add(variable.variableDefinition)
		}
		this.#variables.push(variable)
	}

	/** Removes a variable from the list of active ones in a module */
	#deleteVariable(variable: PlaydeckVariable) {
		if (variable.variableDefinition === null) return
		this.#variableDifinitions.delete(variable.variableDefinition)
	}

	setCurrent(current: PlaydeckStatusValues<any, any> | null): void {
		this.#setVariables(current, 'getCurrentValue')
	}
	onEvent(event: PlaydeckEvent): void {
		this.#setVariables(event, 'getValueFromEvent')
	}
	checkData(data: PlaydeckData | null, current?: PlaydeckStatusValues<any, any> | null): void {
		if (data === null) return
		this.#setVariables({ data: data, current: current }, 'getFromData')
	}
	#setVariables(data: any, methodName: keyof PlaydeckVariable): void {
		this.#variableValues = {}
		this.#variables.forEach((variable: PlaydeckVariable) => {
			if (variable.value === undefined) {
				this.#deleteVariable(variable)
			}
			if (data === undefined || data === null) return
			const сhannelIndex = typeof variable.channel === 'number' ? variable.channel : undefined
			const method =
				variable[methodName] && typeof variable[methodName] === 'function' ? variable[methodName] : undefined
			if (method === undefined) return
			const value = method(data, сhannelIndex)
			if (value === null) return

			if (variable.value !== value) {
				variable.value = value as CompanionVariableValue
				this.#updateVariables(variable)
			}
		})

		if (Object.keys(this.#variableValues).length > 0) {
			this.#instance?.setVariableDefinitions(Array.from(this.#variableDifinitions))
			this.#instance?.setVariableValues(this.#variableValues)
		}
	}

	#updateVariables(variable: PlaydeckVariable): void {
		if (variable.variableDefinition === null) return
		if (variable.value === undefined) {
			if (this.#variableDifinitions.has(variable.variableDefinition)) {
				this.#log('warn', `Deleting ${variable.variableDefinition.variableId}: ${variable.value}`)
				this.#variableDifinitions.delete(variable.variableDefinition)
			}
			return
		}
		this.#variableValues[variable.variableDefinition.variableId] = variable.value
		if (!this.#variableDifinitions.has(variable.variableDefinition)) {
			this.#variableDifinitions.add(variable.variableDefinition)
		}
	}
	#log(level: LogLevel, message: string) {
		this.#instance?.log(level, `Playdeck Variables: ${message}`)
	}
}

export interface PlaydeckVariable extends PlaydeckVariableItem {
	variableDefinition: CompanionVariableDefinition | null
	value: CompanionVariableValue | undefined
}
