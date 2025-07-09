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
						{ id: 0, label: 'Left Playlist' },
						{ id: 1, label: 'Right Playlist' },
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
				const options = feedback.options as CheckStateOptionValues
				const status = state.status.getValues()
				if (!status) return false

				const playlist = status.channel[Number(options.playlist)]
				const isState = playlist.state === feedback.options.state
				if (!isState) return false

				const fClip = await context.parseVariablesInString(options.clip.toString())
				const fBlock = await context.parseVariablesInString(options.block.toString())

				const isAny = Number(fClip) === 0 && Number(fBlock) === 0
				if (isAny) return isState

				const blockID = playlist.blockID
				const blockName = playlist.blockName
				const isBlock = [`${blockID}`, `${blockName}`].indexOf(fBlock) > -1
				const clipID = playlist.clipID
				const clipName = playlist.clipName
				const isClip = [`${clipID}`, `${clipName}`].indexOf(fClip) > -1
				if (Number(fBlock) === 0) return isClip && isState

				if (Number(fClip) === 0) return isBlock && isState

				return isClip && isBlock && isState
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
