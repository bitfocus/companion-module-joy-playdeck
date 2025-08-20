import { combineRgb, CompanionFeedbackDefinitions, CompanionOptionValues, InputValue } from '@companion-module/base'
import { PlaydeckState } from '../../../../../core/state/PlaydeckState.js'
import { PlaybackState } from '../../../../../utils/PlaydeckUtils.js'
import { PlaydeckValuesV4 } from '../../../../data/PlaydeckStatusManager/Versions/V4/v40b00/PlaydeckStatusV4.js'

export const PlaydeckFeedbacksDefinitionsV4 = (state: PlaydeckStateV4): CompanionFeedbackDefinitions => {
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
				{
					type: 'checkbox',
					label: 'Use Item UID',
					id: 'isUID',
					default: false,
				},
				{
					type: 'checkbox',
					label: 'Use variables for Channel',
					id: 'isChanString',
					default: false,
					isVisible: (opt) => opt.isUID === false,
				},
				{
					type: 'number',
					id: 'channelNum',
					label: 'Channel',
					min: 1,
					max: 8,
					default: 1,
					isVisible: (opt) => opt.isChanString === false && opt.isUID === false,
				},
				{
					type: 'textinput',
					label: `Channel`,
					id: `channelString`,
					default: `0`,
					useVariables: true,
					isVisible: (opt) => opt.isChanString === true && opt.isUID === false,
				},

				{
					type: 'textinput',
					label: `Block Number/Name`,
					id: `block`,
					default: ``,
					useVariables: true,
					isVisible: (opt) => opt.isUID === false,
				},
				{
					type: 'textinput',
					label: `Clip Number/Name (0 for any)`,
					id: `clip`,
					default: `0`,
					useVariables: true,
					isVisible: (opt) => opt.isUID === false,
				},

				{
					type: 'textinput',
					label: `Item UID (0 for any)`,
					id: `item`,
					default: `0`,
					useVariables: true,
					isVisible: (opt) => opt.isUID === true,
				},
			],

			callback: async (feedback, context): Promise<boolean> => {
				if (!state) return false

				const options = feedback.options as CheckStateOptionValues
				let isState = false
				let isClip = false
				let isBlock = false
				const fState = options.state
				const fChannel = options.isChanString
					? await context.parseVariablesInString(options.channelString.toString())
					: options.channelNum
				const fClip = await context.parseVariablesInString(options.clip.toString())
				const fBlock = await context.parseVariablesInString(options.block.toString())
				const fItem = Number(await context.parseVariablesInString(options.item.toString()))
				const isAnyClip = Number(fClip) === 0
				const isAnyBlock = Number(fBlock) === 0
				const isAny = isAnyClip && isAnyBlock
				if (state.lastState) {
					const lastStateChannels = state.lastState.channel

					if (lastStateChannels) {
						const lastChannelState = lastStateChannels[Number(fChannel)]

						if (lastChannelState) {
							const lastChannelBlock = [String(lastChannelState.blockName), String(lastChannelState.blockNumber)]
							const lastChannelClip = [String(lastChannelState.clipName), String(lastChannelState.clipNumber)]

							if (options.isUID) {
								if (fState !== undefined && fItem !== undefined) {
									const ID = Number(fItem)
									const byID = state.lastState.byID
									if (byID) {
										const IDState = byID[ID]
										if (IDState) {
											isState = String(IDState) === String(fState)
											return isState
										}
									}
								}
							} else {
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
								if (isAnyBlock || isAnyClip)
									return (isAnyBlock && isState && isClip) || (isAnyClip && isState && isBlock)
								return isState && isClip && isBlock
							}
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

				if (options.isUID) {
					/// By now (v.4.0b11 there is no way to get 'pause' and 'stop' for ID's because there pause/stop events is only for channels
					if (state.data) {
						const UIDChannelNumber = state.data.getChannelByID(Number(fItem))
						if (UIDChannelNumber !== null) {
							const stateUIDChannel = stateChannels[UIDChannelNumber - 1]
							if (stateUIDChannel !== null || stateUIDChannel !== undefined) {
								isState = String(stateUIDChannel.playState) === String(fState)
								if (String(stateUIDChannel.clipID) === String(fItem)) return isState
								if (String(stateUIDChannel.playState) === String(PlaybackState.Stop)) return isState
							}
						}
						return false
					}
				}
				if (fState !== undefined) {
					isState = String(stateChannel.playState) === String(fState)
					if (isState === false) return false
				}

				if (String(stateChannel.playState) === String(PlaybackState.Stop)) return isState

				const stateChannelBlock = [String(stateChannel.blockName), String(stateChannel.blockNumber)]
				const stateChannelClip = [String(stateChannel.clipName), String(stateChannel.blockNumber)]

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

export interface CheckStateOptionValues extends CompanionOptionValues {
	isChanString: boolean
	channelNum: number
	channelString: InputValue
	state: PlaybackState
	block: InputValue
	clip: InputValue
	item: number
	isUID: boolean
}
export interface PlaydeckStateV4 extends Omit<PlaydeckState, 'status'> {
	status: Omit<PlaydeckState['status'], 'getValues'> & {
		getValues: () => PlaydeckValuesV4
	}
}
