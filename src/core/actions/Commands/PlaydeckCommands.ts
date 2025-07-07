import { SomeCompanionActionInputField } from '@companion-module/base'
import { PlaydeckVersion, Version } from '../../../core/version/PlaydeckVersion.js'

export interface PlaydeckCommand {
	version: Version | null
	deprecated: Version | null
	commandName: string
	command: string
	description?: string
	arg1?: string
	arg2?: string
	arg3?: string
}

export abstract class PlaydeckCommands extends Array<PlaydeckCommand> {
	constructor(version: PlaydeckVersion, commands: PlaydeckCommand[]) {
		let actualCommands = commands
		actualCommands = actualCommands.filter((command: PlaydeckCommand) => {
			if (command.version !== null) {
				return (
					version.isGreaterOrEqualualTo(command.version) &&
					(command.deprecated === null || version.isLowerThan(command.deprecated))
				)
			}
		})

		super(...actualCommands)
	}
	/** This is an array of available commands with descriptions etc. Add/edit commands only here */
	static commands: PlaydeckCommand[]

	abstract getOptions(command: PlaydeckCommand): SomeCompanionActionInputField[]
}
