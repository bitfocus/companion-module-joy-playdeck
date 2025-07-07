import { argNamesV4, PlaydeckCommandV4 } from '../PlaydeckComandsV4.js'

function assetsAll(): PlaydeckCommandV4[] {
	const all: PlaydeckCommandV4[] = []
	commandsInternal.forEach((command) => {
		targetsInternal.forEach((target) => {
			all.push(startStopInternal(command, target))
		})
	})
	commandsExternal.forEach((command) => {
		targetsExternals.forEach((target) => {
			all.push(startStopExternal(command, target))
		})
	})
	all.push(loadproject)
	all.push(appendproject)
	commandsAudio.forEach((command) => {
		targetsAudio.forEach((target) => {
			all.push(audio(command, target))
		})
	})
	return all
}
const commandsInternal = ['start', 'stop', 'stopall']
const targetsInternal: argNamesV4[] = ['OVERLAY', 'ACTION']

const commandsExternal = ['start', 'stop']
const targetsExternals: argNamesV4[] = ['DESKTOP', 'STREAM', 'RECORD']

const commandsAudio = ['mute', 'unmute']
const targetsAudio: argNamesV4[] = ['CHANNEL', 'INPUT']

function startStopInternalDefinition(isStart: boolean, type: string, command: string): string {
	return `- ${isStart ? 'START' : 'STOP'} one ${!command.includes('all') ? ` or all ${type}. You can define multiple ${type.toLowerCase()}s at once e.g. "<${command}${type.toLowerCase()}|1|3+7+12>"}` : `${type}`}`
}

function startStopInternal(command: string, target: argNamesV4): PlaydeckCommandV4 {
	const isAll = command.includes('all')
	const realTarget = `${target}${isAll ? 'S' : ``}`
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `ASSETS - ${`${command.split('all')[0]} ${realTarget}`.toUpperCase()}`,
		command: `${command}${realTarget.toLowerCase()}`,
		description: startStopInternalDefinition(true, realTarget, command),
		arg1: 'CHANNEL',
		arg2: !isAll ? target : undefined,
	}
}

function startStopExternal(command: string, target: argNamesV4): PlaydeckCommandV4 {
	const isDesk = target === 'DESKTOP'
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `ASSETS - ${`${command} ${target}`.toUpperCase()}`,
		command: `${command}${target.toLowerCase()}`,
		description: `${command.toUpperCase()} the ${isDesk ? `Channel Desktop Output` : `${target.toUpperCase()}`}`,
		arg1: target,
	}
}

const loadproject: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `ASSETS - LOAD PROJECT`,
	command: `loadproject`,
	description: `Loads a new Project File`,
	arg1: 'FILENAME',
}

const appendproject: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `ASSETS - APPEND PROJECT`,
	command: `appendproject`,
	description: `Appends all Blocks to the current Project`,
	arg1: 'FILENAME',
}

function audio(command: string, target: argNamesV4): PlaydeckCommandV4 {
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `ASSETS - ${`${command} ${target}`.toUpperCase()}`,
		command: `${command}${target.toLowerCase()}`,
		description: `${command.toUpperCase()} the ${target} Audio`,
		arg1: target,
	}
}

export const AssetsCommands: PlaydeckCommandV4[] = [...assetsAll()]
