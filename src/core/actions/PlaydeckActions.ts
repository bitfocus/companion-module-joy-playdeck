import { CompanionActionDefinitions, CompanionActionEvent, InputValue, LogLevel } from '@companion-module/base'
import { PlaydeckInstance } from '../../index.js'
import { PlaydeckUtils } from '../../utils/PlaydeckUtils.js'
import { playdeckCommandsFactory } from './Commands/Items/PlaydeckComandsFactory.js'
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
		const commands = playdeckCommandsFactory.create(this.#instance.version)
		if (commands === null) {
			this.#log('warn', `No command to load`)
			return result
		}
		commands.forEach((playdeckCommand: PlaydeckCommand) => {
			const commanndID = playdeckCommand.command
			result[commanndID] = {
				name: playdeckCommand.commandName,
				callback: async (action) => {
					await this.#doAction(action)
				},
				options: commands.getOptions(playdeckCommand),
				description: playdeckCommand.description,
			}
		})
		return result
	}
	async #doAction(action: PlaydeckAction) {
		const outgoingConnection = this.#instance.connectionManager?.outgoing
		let { arg1, arg2, arg3 } = action.options
		if (arg1 !== undefined) arg1 = await this.#instance.parseVariablesInString(arg1.toString())
		if (arg2 !== undefined) arg2 = await this.#instance.parseVariablesInString(arg2.toString())
		if (arg3 !== undefined) arg3 = await this.#instance.parseVariablesInString(arg3.toString())
		const command = this.#makeRCCommand(action.actionId, [arg1, arg2, arg3])
		if (outgoingConnection) {
			if (command !== ``) {
				if (action.actionId) outgoingConnection.send(command)
			} else {
				this.#log(`warn`, `Empty command!`)
			}
		}
	}
	#makeRCCommand(command: string, args: (InputValue | undefined)[]): string {
		if (command === `customcommand`) return args[0] ? args.toString() : ``
		return PlaydeckUtils.makeRCMessage(command, args)
	}
	#log(level: LogLevel, message: string) {
		this.#instance.log(level, `Playdeck Actions: ${message}`)
	}
}

export interface PlaydeckAction extends CompanionActionEvent {
	options: {
		arg1?: InputValue
		arg2?: InputValue
		arg3?: InputValue
	}
}
