import {
	CompanionActionDefinitions,
	CompanionActionEvent,
	CompanionFeedbackContext,
	InputValue,
	LogLevel,
} from '@companion-module/base'
import { PlaydeckInstance } from '../../index.js'
import { PlaydeckUtils } from '../../utils/PlaydeckUtils.js'
import { PlaydeckCommandsFactory } from './Commands/Items/PlaydeckComandsFactory.js'
import { PlaydeckCommand } from './Commands/PlaydeckCommands.js'
export class PlaydeckActions {
	#instance: PlaydeckInstance
	#actionDefinitions: CompanionActionDefinitions
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#actionDefinitions = this.#getActionDefinitions()
		this.#init()
	}
	#init() {
		this.#log('debug', `Initializing...`)
		if (!this.#instance) {
			this.#log('error', `No main instance`)
			return
		}
		this.#instance.setActionDefinitions(this.#actionDefinitions)
	}
	#getActionDefinitions(): CompanionActionDefinitions {
		const result: CompanionActionDefinitions = {}
		const commands = PlaydeckCommandsFactory.create(this.#instance.version)
		if (commands === null) {
			this.#log('warn', `No command to load`)
			return result
		}
		commands.forEach((playdeckCommand: PlaydeckCommand) => {
			const commanndID = playdeckCommand.command
			result[commanndID] = {
				name: playdeckCommand.commandName,
				callback: async (action, ctx) => {
					await this.#doAction(action, ctx)
				},
				options: commands.getOptions(playdeckCommand),
				description: playdeckCommand.description,
			}
		})
		return result
	}
	async #doAction(action: PlaydeckAction, ctx: CompanionFeedbackContext) {
		const outgoingConnection = this.#instance.connectionManager?.outgoing
		const args = this.#getArguments(action.options)
		for (let i = 0; i < args.length; i++) {
			const arg = args[i]
			if (arg !== undefined) args[i] = await ctx.parseVariablesInString(arg.toString())
		}

		const command = this.#makeRCCommand(action.actionId, args)
		if (outgoingConnection) {
			if (command !== ``) {
				if (action.actionId) outgoingConnection.send(command)
			} else {
				this.#log(`warn`, `Empty command!`)
			}
		}
	}
	#getArguments(options: Partial<Record<`arg${number}`, InputValue>>): (InputValue | undefined)[] {
		return Object.keys(options)
			.filter((key) => /^arg\d+$/.test(key))
			.sort((a, b) => {
				return Number(a.slice(3)) - Number(b.slice(3))
			})
			.map((key) => options[key as keyof typeof options])
	}
	#makeRCCommand(command: string, args: (InputValue | undefined)[]): string {
		if (command === `customcommand`) return args[0] ? args[0].toString() : ``
		if (command === `selectNext`) return `<moveselect|${args[0] ? args[0].toString() : ``}|1>`
		if (command === `selectPrevious`) return `<moveselect|${args[0] ? args[0].toString() : ``}|-1>`
		return PlaydeckUtils.makeRCMessage(command, args)
	}
	#log(level: LogLevel, message: string) {
		this.#instance.log(level, `Playdeck Actions: ${message}`)
	}
}

export interface PlaydeckAction extends CompanionActionEvent {
	options: Partial<Record<`arg${number}`, InputValue>>
}
