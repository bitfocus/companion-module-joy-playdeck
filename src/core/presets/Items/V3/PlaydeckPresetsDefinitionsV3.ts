import { combineRgb, CompanionPresetDefinitions, CompanionVariableValue } from '@companion-module/base'
import { PlaydeckPresetsDefinitions } from '../PlaydeckPresetsFactory.js'
import { PlaydeckCommand, PlaydeckCommands } from '../../../../core/actions/Commands/PlaydeckCommands.js'

import { PlaybackState, PlaydeckUtils } from '../../../../utils/PlaydeckUtils.js'

export class PlaydeckPresetsDefinitionsV3 implements PlaydeckPresetsDefinitions {
	#presetDefinitions = {}
	#commands: PlaydeckCommands | null = null
	#fontSize = 10
	constructor(commands?: PlaydeckCommands | null) {
		if (commands === undefined) return
		this.#commands = commands
		this.#init()
	}
	getDefinitions(): CompanionPresetDefinitions {
		return this.#presetDefinitions
	}
	#init() {
		if (this.#commands === null) return
		this.#updatePresetDefinitions(this.#commands)
	}

	#updatePresetDefinitions(commands: PlaydeckCommand[]) {
		for (let playlistNum = 1; playlistNum <= 2; playlistNum++) {
			commands.forEach((command) => {
				this.#addPresetForCommand(command, playlistNum)
			})
		}
	}

	#addPresetForCommand(command: PlaydeckCommand, playlistNum: number) {
		const category = this.#getCategory(command)
		const playlistSide = playlistNum === 1 ? 'left' : 'right'
		const isPlayList = category === 'playlist'
		const presetCategory = isPlayList ? `${playlistSide}_${category}` : category
		if (this.#commands === null) return
		const commandOptions = this.#commands.getOptions(command)
		const arg1Options = commandOptions[0]
		let arg1Default: CompanionVariableValue = ''
		if (arg1Options) {
			if (arg1Options.type === 'dropdown') {
				if (arg1Options.choices[0]) {
					arg1Default = arg1Options.choices[0].id
				}
			}
		}

		this.#makePreset({
			id: `preset_${presetCategory}_${command.command}`,
			category: `${PlaydeckUtils.capitalizeFirstLetter(presetCategory.replace('_', ' '))}`,
			text: `${isPlayList ? `${PlaydeckUtils.capitalizeFirstLetter(playlistSide)} ` : ``}${command.commandName.replace(' - ', ' ')}`,
			action: {
				actionId: command.command,
				options: {
					arg1: isPlayList ? playlistNum : arg1Default,
					arg2: isPlayList ? 1 : ``,
					arg3: 1,
				},
			},
			feedback: this.#isStateCommand(command.command)
				? {
						state: command.command as PlaybackState,
						playlist: playlistNum,
						block: 0,
						clip: 0,
					}
				: command.command.includes(PlaybackState.Play)
					? {
							state: PlaybackState.Play,
							playlist: playlistNum,
							block: 0,
							clip: 0,
						}
					: undefined,
		})
	}

	#getCategory(command: PlaydeckCommand): string {
		const isRec = command.command.includes('rec')
		const isSync = command.command.includes('sync')
		const isPlayList = command.arg1 === 'PLAYLIST'
		if (isRec) return 'record'
		if (isSync) return 'sync'
		if (isPlayList) return 'playlist'
		return 'common'
	}

	#isStateCommand(command: string) {
		return PlaydeckUtils.isInEnum(command, PlaybackState)
	}

	#makePreset(preset: PlaydeckPresetDefinitionItem) {
		const newPreset = {
			[`${preset.id}`]: {
				category: preset.category,
				type: 'button',
				style: {
					text: preset.text,
					size: this.#fontSize,
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: preset.action.actionId,
								options: preset.action.options,
							},
						],
						up: [],
					},
				],
				feedbacks: preset.feedback
					? [
							{
								feedbackId: `checkState`,
								options: {
									playlist: preset.feedback.playlist,
									state: preset.feedback.state,
									block: preset.feedback.block,
									clip: preset.feedback.clip,
								},
								style: {
									color: combineRgb(255, 255, 255),
									bgcolor: combineRgb(255, 0, 0),
								},
							},
						]
					: [],
			},
		}
		Object.assign(this.#presetDefinitions, newPreset)
	}
}

type PlaydeckPresetDefinitionItem = {
	id: string
	category: string
	text: string
	action: {
		actionId: string
		options: {
			arg1: CompanionVariableValue
			arg2: CompanionVariableValue
			arg3: CompanionVariableValue
		}
	}
	feedback:
		| {
				state: PlaybackState
				playlist: number
				block: number
				clip: number
		  }
		| undefined
}
