import {
	combineRgb,
	CompanionFeedbackDefinitions,
	CompanionOptionValues,
	InputValue,
	SomeCompanionFeedbackInputField,
} from '@companion-module/base'
import { PlaydeckState } from '../../../../../core/state/PlaydeckState.js'
import { PlaydeckValuesV3 } from '../../../../../core/data/PlaydeckStatusManager/Versions/V3/PlaydeckStatusV3.js'
import { PlaybackState } from '../../../../../utils/PlaydeckUtils.js'

export const PlaydeckFeedbacksDefinitionsV3 = (state: PlaydeckStateV3): CompanionFeedbackDefinitions => {
	return {
		checkState: {
			type: 'boolean',
			name: `Check playback state`,
			description: `Returns the state CLIP in BLOCK (0 for any) in selected playlist`,
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'dropdown',
					id: 'playlist',
					label: 'Playlist',
					default: '1',
					choices: [
						{ id: 1, label: 'Left Playlist' },
						{ id: 2, label: 'Right Playlist' },
					],
				},
				{
					type: 'dropdown',
					id: 'state',
					label: 'State',
					default: PlaybackState.Play,
					choices: [
						{ id: PlaybackState.Play, label: 'PLAY' },
						{ id: PlaybackState.Pause, label: 'PAUSE' },
						{ id: PlaybackState.Stop, label: 'STOP' },
						{ id: PlaybackState.Cue, label: 'CUE' },
					],
				},
				utils.checkState.textInput('Block'),
				utils.checkState.textInput('Clip'),
			],

			callback: async (feedback, context): Promise<boolean> => {
				if (!state) return false

				const options = feedback.options as CheckStateOptionValues
				let isState = false
				let isClip = false
				let isBlock = false
				const fState = options.state
				const fChannel = options.playlist
				const fClip = await context.parseVariablesInString(options.clip.toString())
				const fBlock = await context.parseVariablesInString(options.block.toString())
				const isName = isNaN(Number(fClip)) || isNaN(Number(fBlock))
				const isAnyClip = Number(fClip) === 0
				const isAnyBlock = Number(fBlock) === 0
				const isAny = isAnyClip && isAnyBlock

				if (state.lastState && isName === false) {
					const lastStateChannels = state.lastState.playlist
					if (lastStateChannels) {
						const lastChannelState = lastStateChannels[Number(fChannel)]
						if (lastChannelState) {
							const lastChannelBlock = [String(lastChannelState.blockName), String(lastChannelState.blockNumber)]
							const lastChannelClip = [String(lastChannelState.clipName), String(lastChannelState.clipNumber)]
							if (fState !== undefined) {
								isState = String(lastChannelState.state) === String(fState)
							}

							if (fBlock !== undefined) {
								isBlock = lastChannelBlock.indexOf(String(fBlock)) > -1
							}
							if (fClip !== undefined) {
								isClip = lastChannelClip.indexOf(String(fClip)) > -1
							}
							if (isAny) return isState
							if (isAnyBlock || isAnyClip) return (isAnyBlock && isState && isClip) || (isAnyClip && isState && isBlock)
							return isState && isClip && isBlock
						}
					}
				}

				if (state.status === null || state.status === undefined) return false

				const status = state.status.getValues()

				if (status === null || status === undefined) return false

				const stateChannels = status.channel

				if (stateChannels === null || stateChannels === undefined) return false

				const stateChannel = stateChannels[Number(fChannel) - 1]

				if (stateChannel === null || stateChannel === undefined) return false

				if (fState !== undefined) {
					isState = String(stateChannel.state) === String(fState)
					if (isState === false) return false
				}

				if (String(stateChannel.state) === String(PlaybackState.Stop)) return isState

				const stateChannelBlock = [String(stateChannel.blockName), String(stateChannel.blockID)]
				const stateChannelClip = [String(stateChannel.clipName), String(stateChannel.blockID)]

				if (fBlock !== undefined) {
					isBlock = stateChannelBlock.indexOf(String(fBlock)) > -1
				}
				if (fClip !== undefined) {
					isClip = stateChannelClip.indexOf(String(fClip)) > -1
				}

				if (isAny) return isState
				if (isAnyBlock || isAnyClip) return (isAnyBlock && isState && isClip) || (isAnyClip && isState && isBlock)
				return isState && isClip && isBlock
			},
		},
	}
}

const utils = {
	checkState: {
		textInput: (source: string): SomeCompanionFeedbackInputField => {
			return {
				type: 'textinput',
				label: `${source} Number/Name (0 for any)`,
				id: `${source.toLowerCase()}`,
				default: `0`,
				useVariables: true,
			}
		},
	},
}

interface CheckStateOptionValues extends CompanionOptionValues {
	playlist: number
	state: PlaybackState
	block: InputValue
	clip: InputValue
}
export interface PlaydeckStateV3 extends Omit<PlaydeckState, 'status'> {
	status: Omit<PlaydeckState['status'], 'getValues'> & {
		getValues: () => PlaydeckValuesV3
	}
}
