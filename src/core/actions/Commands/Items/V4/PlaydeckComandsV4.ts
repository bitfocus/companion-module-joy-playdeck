import { PlaydeckVersion } from '../../../../version/PlaydeckVersion.js'
import { PlaydeckCommand, PlaydeckCommands } from '../../PlaydeckCommands.js'
import { Regex, SomeCompanionActionInputField } from '@companion-module/base/dist'
import { PlaydeckUtils } from '../../../../../utils/PlaydeckUtils.js'
import { PlayoutCommands } from './PlayoutCommands/PlayoutCommands.js'
import { AssetsCommands } from './AssetsCommands/AssetsCommands.js'
export type argNamesV4 =
	| 'CHANNEL'
	| 'BLOCK'
	| 'CLIP'
	| 'LIST'
	| 'ID'
	| 'PATTERN'
	| 'UID'
	| 'TIMESTAMP'
	| 'OVERLAY'
	| 'ACTION'
	| 'DESKTOP'
	| 'STREAM'
	| 'RECORD'
	| 'FILENAME'
	| 'INPUT'
	| 'COMMAND'
	| 'TIME'
export interface PlaydeckCommandV4 extends PlaydeckCommand {
	arg1?: argNamesV4
	arg2?: argNamesV4
	arg3?: argNamesV4
}
export class PlaydeckCommandsV4 extends PlaydeckCommands {
	constructor(version: PlaydeckVersion) {
		super(version, PlaydeckCommandsV4.commands)
	}

	#getField(arg: argNamesV4, index: number): SomeCompanionActionInputField {
		const dropdownPlaylists: SomeCompanionActionInputField = {
			type: 'dropdown',
			id: `arg${index}`,
			label: 'PLAYLIST:',
			default: '1',
			choices: [
				{ id: '1', label: 'Left Playlist' },
				{ id: '2', label: 'Right Playlist' },
			],
		}
		const itemNumberField = (maxNum: number): SomeCompanionActionInputField => {
			return {
				type: 'number',
				id: `arg${index}`,
				label: `${arg} ID:`,
				min: 1,
				max: maxNum,
				default: 1,
				required: true,
				range: false,
			}
		}
		const timeNumberField = (): SomeCompanionActionInputField => {
			return {
				type: 'number',
				id: `arg${index}`,
				label: `${arg} (MS):`,
				min: 0,
				max: 100000,
				default: 0,
				required: true,
				range: false,
			}
		}
		const textInputField: (regex: string, tooltip: string) => SomeCompanionActionInputField = (regex, tooltip) => {
			return {
				type: 'textinput',
				id: `arg${index}`,
				label: `${arg}:`,
				required: true,
				regex: regex,
				useVariables: true,
				tooltip: tooltip,
			}
		}

		if (arg === 'LIST') {
			return dropdownPlaylists
		}
		if (arg === 'CHANNEL') {
			return itemNumberField(8)
		}
		if (arg === 'RECORD') {
			return itemNumberField(4)
		}
		if (arg === 'STREAM') {
			return itemNumberField(15)
		}
		if (arg === 'TIME') {
			return timeNumberField()
		}
		if (arg === 'COMMAND') {
			return textInputField(
				`${PlaydeckUtils.RC_REGEX}`,
				`Write custom command like <{command}|{playlist_id}|?{block_id}|?{clip_id}`,
			)
		}
		if (arg.includes('PATTERN')) {
			return textInputField(
				`${Regex.SOMETHING}`,
				`PATTERN is a flexible naming construction.\n- b#5 (Block 5)\n- b:myname (First Blockname containing "myname")\n- c#5 OR c:myname (Same for Clips)\n- p:HH:MM:SS:FF (Clip Position as Timestamp)\n- b#5 c:myname p:0:05:31:00 (Clip "*myname*" in Block 5 at Clip Pos 0:05:31:00)\nTip 1: Use "c:name1 c:name2 c:name3" for multisearch aka "Use name1 if exist, else ..."\nTip 2: Use negative Clip Position to jump to Clip Duration minus Position eg "p:-30:00"`,
			)
		}
		if (arg.includes('TIMESTAMP')) {
			return textInputField(`${Regex.SOMETHING}`, `TIMESTAMP format is HH:MM:SS:FF, but can be shortened to SS:FF`)
		}

		return textInputField(`${Regex.SOMETHING}`, `Here might be any string value...`)
	}

	getOptions(command: PlaydeckCommandV4): SomeCompanionActionInputField[] {
		const args = [command.arg1, command.arg2, command.arg3]
		const options: SomeCompanionActionInputField[] = []

		for (let i = 0; i < args.length; i++) {
			const argument = args[i]
			if (argument !== undefined) {
				const newOpt = this.#getField(argument, i + 1)
				if (newOpt) options.push(newOpt)
			}
		}
		return options
	}
	static commands: PlaydeckCommandV4[] = [
		{
			version: '4.1b11',
			deprecated: null,
			commandName: `UTILS - Custom Command`,
			command: `customcommand`,
			description: `Send custom command...`,
			arg1: `COMMAND`,
		},
		{
			version: '4.1b16',
			deprecated: null,
			commandName: `UTILS - WAIT`,
			command: `wait`,
			description: `Will halt execution of upcoming Commands for the duration of TIME`,
			arg1: 'TIME',
		},
		...PlayoutCommands,
		...AssetsCommands,
	]
}
