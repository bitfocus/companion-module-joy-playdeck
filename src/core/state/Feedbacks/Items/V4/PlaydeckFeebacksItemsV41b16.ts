import { combineRgb, CompanionFeedbackDefinitions, CompanionOptionValues, InputValue } from '@companion-module/base'
import { PlaydeckState } from '../../../PlaydeckState.js'

import { PlaydeckValuesV41b16 } from '../../../../data/PlaydeckStatusManager/Versions/V4/v41b16/PlaydeckStatusV41b16.js'
import {
	State,
	StateableTargets,
} from '../../../../data/PlaydeckStatusManager/Versions/V4/v41b16/PlaydeckStatusMessageV41b16.js'
import { PlaydeckFeedbacksDefinitionsV4 } from './PlaydeckFeebacksItemsV4.js'

export const PlaydeckFeedbacksDefinitionsV41b16 = (state: PlaydeckStateV41b16): CompanionFeedbackDefinitions => {
	return {
		...PlaydeckFeedbacksDefinitionsV4(state),
		...{
			checkObjectsState: {
				type: 'boolean',
				name: `Check object started`,
				description: `Returns the 'Started' state of selected object (channel, input, output (desktop), recording, directors view, stream)) in selected playlist`,
				defaultStyle: {
					bgcolor: combineRgb(255, 0, 0),
					color: combineRgb(255, 255, 255),
				},
				options: [
					{
						type: 'dropdown',
						id: 'stateableObject',
						label: 'State',
						default: StateableTargets.Channel.toLowerCase(),
						choices: [
							{ id: StateableTargets.Channel.toLowerCase(), label: 'CHANNEL' },
							{ id: StateableTargets.Output.toLowerCase(), label: 'OUTPUT (DESKTOP)' },
							{ id: StateableTargets.Input.toLowerCase(), label: 'INPUT' },
							{ id: StateableTargets.Stream.toLowerCase(), label: 'STREAM' },
							{ id: StateableTargets.Director.toLowerCase(), label: 'DIRECTOR VIEW' },
							{ id: StateableTargets.Recording.toLowerCase(), label: 'RECORDING' },
						],
					},
					{
						type: 'checkbox',
						label: 'Use variables for object number',
						id: 'isNumberString',
						default: false,
					},
					{
						type: 'number',
						id: 'objectNumber',
						label: 'Object Number',
						min: 1,
						max: 15,
						default: 1,
						isVisible: (opt) => opt.isNumberString === false,
					},
					{
						type: 'textinput',
						label: `Object Number`,
						id: `objectNumberString`,
						default: `1`,
						useVariables: true,
						isVisible: (opt) => opt.isNumberString === true,
					},
				],

				callback: async (feedback, context): Promise<boolean> => {
					const options = feedback.options as CheckObjectsStateOptionValues

					if (!state) return false
					if (!state.status) return false
					const values = state.status.getValues()
					if (!values) return false
					const states = values.states
					if (!states) return false

					let objectNum = options.objectNumber
					if (options.isNumberString) {
						objectNum = Number(await context.parseVariablesInString(options.objectNumberString.toString()))
					}
					const objectStates = states[options.stateableObject]
					if (!Array.isArray(objectStates)) return false
					return objectStates[objectNum - 1] === String(State[State.Started])
				},
			},
		},
	}
}

export interface CheckObjectsStateOptionValues extends CompanionOptionValues {
	stateableObject: Lowercase<StateableTargets>
	isNumberString: boolean
	objectNumber: number
	objectNumberString: InputValue
}
export interface PlaydeckStateV41b16 extends Omit<PlaydeckState, 'status'> {
	status: Omit<PlaydeckState['status'], 'getValues'> & {
		getValues: () => PlaydeckValuesV41b16
	}
}
