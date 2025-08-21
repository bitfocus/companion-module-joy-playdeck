import {
	combineRgb,
	CompanionPresetDefinition,
	CompanionPresetDefinitions,
	CompanionVariableValue,
} from '@companion-module/base'
import { PlaydeckPresetsDefinitions } from '../PlaydeckPresetsFactory.js'
import { PlaydeckCommands } from '../../../actions/Commands/PlaydeckCommands.js'

import { PlaybackState, PlaydeckUtils } from '../../../../utils/PlaydeckUtils.js'
import { CheckStateOptionValues } from '../../../state/Feedbacks/Items/V4/PlaydeckFeebacksItemsV4.js'
import { PlaydeckInstance } from '../../../../index.js'
import { StateableTargets } from '../../../../core/data/PlaydeckStatusManager/Versions/V4/v41b16/PlaydeckStatusMessageV41b16.js'
export class PlaydeckPresetsDefinitionsV416 implements PlaydeckPresetsDefinitions {
	#presetDefinitions: Map<string, CompanionPresetDefinition> = new Map()
	#commands: PlaydeckCommands | null = null
	#fontSize = 10
	#instance?: PlaydeckInstance
	constructor(commands?: PlaydeckCommands | null, instance?: PlaydeckInstance) {
		if (commands === undefined) return
		this.#commands = commands
		this.#instance = instance
		console.log(this.#instance?.label) // USE IT TO GET VARIABLES IN FEEDBACK
		this.#init()
	}
	getDefinitions(): CompanionPresetDefinitions {
		return Object.fromEntries([...this.#presetDefinitions.entries()].sort(([a], [b]) => a.localeCompare(b)))
	}
	#init() {
		if (this.#commands === null) return
		this.#updatePresetDefinitions()
	}

	#updatePresetDefinitions(): void {
		if (this.#commands === null) return
		this.#commands.forEach((playdeckCommand) => {
			const command = playdeckCommand.command
			const category = this.#getCategory(command)
			if (this.#commands === null) return
			const listNames = ['left', 'right']
			let presetCategory
			let presetChannelCategory
			let presetSubCategory
			const feedbackState = this.#getFeedbackState(command)
			switch (category) {
				case CommandCategory.Assets:
					presetCategory = category
					presetSubCategory = this.#getAssetsSubCategory(command)
					switch (presetSubCategory) {
						case CommandAssetsSubCategory.Audio:
							this.#makeDescription({
								id: `preset_${presetCategory}_${presetSubCategory}`,
								category: `${PlaydeckUtils.capitalizeFirstLetter(presetCategory)}`,
								name: 'Audio',
								text: '',
							})
							break
						case CommandAssetsSubCategory.Project:
							this.#makeDescription({
								id: `preset_${presetCategory}_${presetSubCategory}`,
								category: `${PlaydeckUtils.capitalizeFirstLetter(presetCategory)}`,
								name: 'Project',
								text: '',
							})
							break
						case CommandAssetsSubCategory.Record:
							this.#makeDescription({
								id: `preset_${presetCategory}_${presetSubCategory}`,
								category: `${PlaydeckUtils.capitalizeFirstLetter(presetCategory)}`,
								name: 'Record',
								text: '',
							})
							break
						case CommandAssetsSubCategory.Stream:
							this.#makeDescription({
								id: `preset_${presetCategory}_${presetSubCategory}`,
								category: `${PlaydeckUtils.capitalizeFirstLetter(presetCategory)}`,
								name: 'Stream',
								text: '',
							})
							break
					}
					this.#makePreset({
						id: `preset_${presetCategory}_${presetSubCategory}_${command}`,
						category: `${PlaydeckUtils.capitalizeFirstLetter(presetCategory)}`,
						text: `${this.#getButtonTextFromCommand(playdeckCommand.commandName)}`,
						action: {
							actionId: command,
							options: {
								arg1: '',
							},
						},
						feedback: undefined,
					})
					break
				case CommandCategory.List:
					listNames.forEach((listName, listIndex) => {
						presetCategory = category
						presetSubCategory = listName
						this.#makeDescription({
							id: `preset_${presetCategory}_${presetSubCategory}`,
							category: `${PlaydeckUtils.capitalizeFirstLetter(presetCategory)}s`,
							name: PlaydeckUtils.capitalizeFirstLetter(listName),
							text: '',
						})
						this.#makePreset({
							id: `preset_${presetCategory}_${presetSubCategory}_${command}`,
							category: `${PlaydeckUtils.capitalizeFirstLetter(presetCategory)}s`,
							text: `${PlaydeckUtils.capitalizeFirstLetter(listName)}\n${this.#getButtonTextFromCommand(playdeckCommand.commandName)}`,
							action: {
								actionId: command,
								options: {
									arg1: `${listIndex + 1}`,
								},
							},
							feedback: undefined,
						})
					})
					break
				case CommandCategory.UID:
					presetCategory = `${category.toUpperCase()}`
					this.#makeDescription({
						id: `preset_${category}`,
						category: `${presetCategory}`,
						name: 'Actions by UID',
						text: `Don't forget to change UID for your action`,
					})
					this.#makePreset({
						id: `preset_${category}_${command}`,
						category: `${presetCategory}`,
						text: `${this.#getButtonTextFromCommand(playdeckCommand.commandName)}`,
						action: {
							actionId: command,
							options: {
								arg1: '',
							},
						},
						feedback: feedbackState
							? {
									isChanString: false,
									channelNum: 2,
									channelString: '',
									state: feedbackState ?? PlaybackState.Play,
									block: 1,
									clip: 1,
									item: 0,
									isUID: true,
								}
							: undefined,
					})
					break
				case CommandCategory.Channel:
					for (let channelID = 1; channelID <= 8; channelID++) {
						presetCategory = `${category}_${channelID}`
						presetSubCategory = this.#getChannelSubCategory(command)
						presetChannelCategory = PlaydeckUtils.capitalizeFirstLetter(presetCategory.replace('_', ' '))
						switch (presetSubCategory) {
							case CommandChannelSubCategory.Standard:
								this.#makeDescription({
									id: `preset_${presetCategory}_${presetSubCategory}`,
									category: `${presetChannelCategory}`,
									name: 'Standard',
									text: '',
								})
								break
							case CommandChannelSubCategory.Flex:
								this.#makeDescription({
									id: `preset_${presetCategory}_${presetSubCategory}`,
									category: `${presetChannelCategory}`,
									name: 'Flex',
									text: '',
								})
								break
							case CommandChannelSubCategory.Action:
								this.#makeDescription({
									id: `preset_${presetCategory}_${presetSubCategory}`,
									category: `${presetChannelCategory}`,
									name: `Actions`,
									text: '',
								})
								break
							case CommandChannelSubCategory.Overlay:
								this.#makeDescription({
									id: `preset_${presetCategory}_${presetSubCategory}`,
									category: `${presetChannelCategory}`,
									name: `Overlays`,
									text: '',
								})
								break
							case CommandChannelSubCategory.Desktop:
								this.#makeDescription({
									id: `preset_${presetCategory}_${presetSubCategory}`,
									category: `${presetChannelCategory}`,
									name: `Desktop`,
									text: '',
								})
								break
							case CommandChannelSubCategory.Position:
								this.#makeDescription({
									id: `preset_${presetCategory}_${presetSubCategory}`,
									category: `${presetChannelCategory}`,
									name: `Position`,
									text: '',
								})
								break
							case CommandChannelSubCategory.Audio:
								this.#makeDescription({
									id: `preset_${presetCategory}_${presetSubCategory}`,
									category: `${presetChannelCategory}`,
									name: `Audio`,
									text: '',
								})
								break
						}
						this.#makePreset({
							id: `preset_${presetCategory}_${presetSubCategory}_${command}`,
							category: `${presetChannelCategory}`,
							text: `#${channelID}\n${this.#getButtonTextFromCommand(playdeckCommand.commandName)}`,
							action: {
								actionId: command,
								options: {
									arg1: channelID,
								},
							},
							feedback: feedbackState
								? {
										isChanString: false,
										channelNum: channelID,
										channelString: `${channelID}`,
										state: feedbackState ?? PlaybackState.Play,
										block: 0,
										clip: 0,
										item: 0,
										isUID: false,
									}
								: undefined,
						})
					}
					break
				case CommandCategory.Utils:
					presetCategory = `${PlaydeckUtils.capitalizeFirstLetter(category)}`
					presetSubCategory = `scripting`
					this.#makeDescription({
						id: `preset_${category}_${presetSubCategory}`,
						category: `${presetCategory}`,
						name: 'Scripting and Custom Commands',
						text: '',
					})
					this.#makePreset({
						id: `preset_${category}_${presetSubCategory}_${command}`,
						category: `${presetCategory}`,
						text: `${this.#getButtonTextFromCommand(playdeckCommand.commandName)}`,
						action: {
							actionId: command,
							options: {
								arg1: '',
							},
						},
						feedback: undefined,
					})
					break
				default:
					return
			}
		})
	}
	#getButtonTextFromCommand(commandName: string): string {
		return commandName.split(' - ')[1]
	}
	#makeDescription(preset: PlaydeckPresetDescriptionItem) {
		const newPreset: CompanionPresetDefinition = {
			category: `${preset.category}`,
			type: 'text',
			name: `${preset.name}`,
			text: `${preset.text}`,
		}
		this.#presetDefinitions.set(preset.id, newPreset)
	}

	#getCategory(command: string): CommandCategory | undefined {
		if (!command) return
		if (this.#isUtils(command)) return CommandCategory.Utils
		if (this.#isAssets(command)) return CommandCategory.Assets
		if (this.#isList(command)) return CommandCategory.List
		if (this.#isUID(command)) return CommandCategory.UID
		if (this.#getChannelSubCategory(command) !== undefined) return CommandCategory.Channel
		return
	}
	#getChannelSubCategory(command: string): CommandChannelSubCategory | undefined {
		if (!command) return
		const listCategories = [
			CommandChannelSubCategory.Flex,
			CommandChannelSubCategory.Action,
			CommandChannelSubCategory.Overlay,
			CommandChannelSubCategory.Desktop,
			CommandChannelSubCategory.Position,
			CommandChannelSubCategory.Audio,
		]
		const category = listCategories.find((category) => {
			return command.includes(category)
		})
		if (category) return category
		return CommandChannelSubCategory.Standard
	}
	#getAssetsSubCategory(command: string): CommandAssetsSubCategory | undefined {
		if (!command) return
		const category = Object.values(CommandAssetsSubCategory).find((category) => {
			return command.includes(category)
		})
		if (category) return category
		return
	}
	#getFeedbackState(command: string): PlaybackState | undefined {
		return Object.values(PlaybackState).find((state) => {
			return String(command) === String(state)
		})
	}
	#isUID(command: string): boolean {
		return command.includes('id')
	}
	#isUtils(command: string): boolean {
		return command === 'customcommand'
	}
	#isList(command: string): boolean {
		const listStrings = ['list', 'switchchannel']
		return listStrings.some((value) => command.includes(value))
	}

	#isAssets(command: string): boolean {
		const assets = Object.values(CommandAssetsSubCategory)

		return assets.some((value) => command.includes(value))
	}
	#makePreset(preset: PlaydeckPresetDefinitionItem) {
		const icon = PlaydeckUtils.ICONS[preset.action.actionId as keyof typeof PlaydeckUtils.ICONS]
		const stateableObjectFromCommands = {
			startdesktop: StateableTargets.Output.toLowerCase(),
			startstream: StateableTargets.Stream.toLowerCase(),
			startrecord: StateableTargets.Recording.toLowerCase(),
		}
		const stateableObject =
			stateableObjectFromCommands[preset.action.actionId as keyof typeof stateableObjectFromCommands]
		const newPreset: CompanionPresetDefinition = {
			category: preset.category,
			type: 'button',
			name: preset.text,
			style: {
				text: preset.text,
				size: icon ? 10 : this.#fontSize,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
				png64: icon,
				alignment: icon ? 'center:bottom' : undefined,
				pngalignment: icon ? 'center:top' : undefined,
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
								isChanString: preset.feedback.isChanString,
								channelNum: preset.feedback.channelNum,
								channelString: preset.feedback.channelString,
								state: preset.feedback.state,
								block: preset.feedback.block,
								clip: preset.feedback.clip,
								item: preset.feedback.item,
								isUID: preset.feedback.isUID,
							},
							style: {
								color: combineRgb(255, 255, 255),
								bgcolor: combineRgb(255, 0, 0),
								text:
									preset.feedback.state === PlaybackState.Play
										? `#${preset.feedback.channelNum}\nPLAY\n$(${this.#instance?.label}:channel_${preset.feedback.channelNum}_clip_remain)`
										: undefined,
							},
						},
					]
				: stateableObject
					? [
							{
								feedbackId: `checkObjectsState`,
								options: {
									stateableObject: stateableObject,
									isNumberString: false,
									objectNumber: preset.action.options.arg1 !== '' ? preset.action.options.arg1 : 1,
									objectNumberString: preset.action.options.arg1 !== '' ? preset.action.options.arg1 : '1',
								},
								style: {
									color: combineRgb(255, 255, 255),
									bgcolor: combineRgb(255, 0, 0),
								},
							},
						]
					: [],
		}

		this.#presetDefinitions.set(preset.id, newPreset)
	}
}
type PlaydeckPresetDescriptionItem = {
	id: string
	category: string
	text: string
	name: string
}

type PlaydeckPresetDefinitionItem = {
	id: string
	category: string
	text: string
	action: {
		actionId: string
		options: {
			arg1?: CompanionVariableValue
			arg2?: CompanionVariableValue
			arg3?: CompanionVariableValue
		}
	}
	feedback: CheckStateOptionValues | undefined
}

enum CommandCategory {
	Channel = 'channel',
	UID = 'uid',
	List = 'list',
	Assets = 'assets',
	Utils = 'utils',
}

enum CommandChannelSubCategory {
	Standard = '0_Standard',
	Flex = 'flex',
	Position = 'position',
	Action = 'action',
	Overlay = 'overlay',
	Desktop = 'desktop',
	Audio = 'mutechannel',
}

enum CommandAssetsSubCategory {
	Stream = 'stream',
	Record = 'record',
	Audio = 'muteinput',
	Project = 'project',
}
