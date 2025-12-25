import { PlaydeckUtils } from '../../../../../../utils/PlaydeckUtils.js'
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
	all.push(toggleoverlay)
	return all
}
const commandsInternal = ['start', 'stop', 'stopall']
const targetsInternal: argNamesV4[] = ['OVERLAY', 'ACTION']

const commandsExternal = ['start', 'stop']
const targetsExternals: argNamesV4[] = ['DESKTOP', 'STREAM', 'RECORD']

const commandsAudio = ['mute', 'unmute']
const targetsAudio: argNamesV4[] = ['CHANNEL', 'INPUT']

function startStopInternalDefinition(isStart: boolean, type: string, command: string): string {
	return `${isStart ? 'START' : 'STOP'} ${!command.includes('all') ? `one or more ${type}S. You can define multiple ${PlaydeckUtils.capitalizeFirstLetter(type.toLowerCase())}s with "3+7+12"` : ` all ${type}`}`
}

function startStopInternal(command: string, target: argNamesV4): PlaydeckCommandV4 {
	const isAll = command.includes('all')
	const curCommand = command.split('all')[0]
	const isStart = curCommand.toLocaleLowerCase() === 'start'
	const realTarget = `${target}${isAll ? 'S' : ``}`
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `ASSETS - ${`${curCommand} ${realTarget}`.toUpperCase()}`,
		command: `${command}${realTarget.toLowerCase()}`,
		description: startStopInternalDefinition(isStart, realTarget, command),
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
		arg1: isDesk ? 'CHANNEL' : target,
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

const toggleoverlay: PlaydeckCommandV4 = {
	version: '4.2b9',
	deprecated: null,
	commandName: `ASSETS - TOGGLE OVERLAY`,
	command: `toggleoverlay`,
	description: `TOGGLE one or more OVERLAYS. You can define multiple Overlays with "3+7+12"`,
	arg1: 'CHANNEL',
	arg2: 'OVERLAY',
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
