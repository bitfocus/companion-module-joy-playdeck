import { DropdownChoice } from '@companion-module/base'
import { ConnectionDirection, ConnectionType } from '../connections/PlaydeckConnection.js'

export class PlaydeckVersion {
	#version: Version
	static holyBooly: boolean = false
	static #LEGACY_CHANNELS = 2
	static #FIRST_MODERN = '4.1b2' as Version
	static #CHANNELS = 8
	static #FIRST_TCP_EVENTS: Version = `3.5b3`
	static #FIRST_WS_CONNECTION: Version = `3.6b18`
	static configVersions = [
		{ id: '4.1b8', label: '4.1b8' },
		{ id: '3.8b13', label: '3.8b13' },
		{ id: '3.8b8', label: '3.8b8' },
		{ id: '3.8b4', label: '3.8b4' },
		{ id: '3.7b11', label: '3.7b11' },
		{ id: '3.7b4', label: '3.7b4' },
		{ id: '3.6b18', label: '3.6b18' },
		{ id: '3.5b12', label: '3.5b12' },
		{ id: '3.5b3', label: '3.5b3' },
		{ id: '3.4b8', label: '3.4b8' },
		{ id: '3.2b12', label: '3.2b12' },
		{ id: '3.2b11', label: '3.2b11' },
		{ id: '3.2b8', label: '3.2b8' },
		{ id: '3.2b2', label: '3.2b2' },
	] as const satisfies DropdownChoice[]
	static noEvents: Version[] = ['3.4b8', '3.2b12', '3.2b11', '3.2b8', '3.2b2']
	static noWS: Version[] = this.noEvents.concat(['3.5b12', '3.5b3'])

	static #isVersion(version: Version): boolean {
		if (!version) return false
		const bSplitted = version.split('b')
		if (bSplitted === undefined) return false
		if (!Number.isInteger(Number(bSplitted[1]))) return false
		const vSplitted = bSplitted[0].split('.')
		if (vSplitted === undefined) return false
		if (!(Number.isInteger(Number(vSplitted[0])) && Number.isInteger(Number(vSplitted[0])))) return false
		return true
	}

	/**
	 * Parses string of version into array like [major, minor, build]
	 * @param version - string of version like `3.1b12`
	 * @returns array representation of version
	 */
	static #parseVersion(version: Version): number[] {
		const bSplit = version.split('b')
		const vSplit = bSplit[0].split('.')
		const major = Number(vSplit[0])
		const minor = Number(vSplit[1])
		const build = Number(bSplit[1])
		return [major, minor, build]
	}

	/**
	 * Indicates is there a `connection` in this `version`
	 */
	static hasConnection(version: Version, connection: ConnectionType, direction?: ConnectionDirection): boolean {
		if (connection === ConnectionType.TCP && direction === ConnectionDirection.Outgoing) return true
		if (connection === ConnectionType.WS && this.isGreaterOrEqual(version, this.#FIRST_WS_CONNECTION)) return true
		if (
			connection === ConnectionType.TCP &&
			direction === ConnectionDirection.Incoming &&
			this.isGreaterOrEqual(version, this.#FIRST_TCP_EVENTS)
		)
			return true
		return false
	}

	/**
	 * Compares two versions and returns
	 * - `0` if version are equal
	 * - `1` if first version is greater (newer)
	 * - `-1` if first version is lower (older)
	 * - `null` if one of arguments is a proper version
	 */
	static compareTwoVersions(version1: Version, version2: Version): VersionCompare {
		if (!this.#isVersion(version1) || !this.#isVersion(version2)) return VersionCompare.Error
		const parsed1 = this.#parseVersion(version1)
		const parsed2 = this.#parseVersion(version2)
		for (let i = 0; i < parsed1.length; i++) {
			if (parsed1[i] === parsed2[i]) continue
			return parsed1[i] > parsed2[i] ? VersionCompare.Greater : VersionCompare.Lower
		}
		return VersionCompare.Equal
	}
	static isGreaterOrEqual(version1: Version, version2: Version): boolean | null {
		switch (this.compareTwoVersions(version1, version2)) {
			case VersionCompare.Greater:
				return true
			case VersionCompare.Equal:
				return true
			case VersionCompare.Error:
				return null
		}
		return false
	}
	static isLowerThan(version1: Version, version2: Version): boolean | null {
		switch (this.compareTwoVersions(version1, version2)) {
			case VersionCompare.Lower:
				return true
			case VersionCompare.Error:
				return null
		}
		return false
	}
	static availableChannels(version: Version): number {
		if (PlaydeckVersion.isGreaterOrEqual(version, PlaydeckVersion.#FIRST_MODERN)) return PlaydeckVersion.#CHANNELS
		return PlaydeckVersion.#LEGACY_CHANNELS
	}
	constructor(version: Version) {
		this.#version = version
	}
	availableChannels(): number {
		return PlaydeckVersion.availableChannels(this.#version)
	}
	isGreaterOrEqualualTo(version: Version): boolean | null {
		return PlaydeckVersion.isGreaterOrEqual(this.#version, version)
	}
	isLowerThan(version: Version): boolean | null {
		return PlaydeckVersion.isLowerThan(this.#version, version)
	}
	hasConnection(connection: ConnectionType, direction?: ConnectionDirection): boolean {
		return PlaydeckVersion.hasConnection(this.#version, connection, direction)
	}
	isLegacy(): boolean | null {
		return PlaydeckVersion.isLowerThan(this.#version, PlaydeckVersion.#FIRST_MODERN)
	}
}
export type Version = (typeof PlaydeckVersion.configVersions)[number]['id']
export enum VersionCompare {
	Greater = 1,
	Equal = 0,
	Lower = -1,
	Error = -99,
}
