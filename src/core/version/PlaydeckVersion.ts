import { DropdownChoice } from '@companion-module/base'
import { ConnectionDirection, ConnectionType } from '../connections/PlaydeckConnection.js'

export class PlaydeckVersion {
	#version: Version
	static holyBooly: boolean = false

	static #FIRST_TCP_EVENTS: Version = `3.5b3`
	static #FIRST_WS_CONNECTION: Version = `3.6b18`
	static configVersions = [
		{ id: '4.1b3', label: '4.1b3' },
		{ id: '3.8b13', label: '3.8b13' },
		{ id: '3.8b8', label: '3.8b8' },
		{ id: '3.8b4', label: '3.8b4' },
		{ id: '3.7b11', label: '3.7b11' },
		{ id: '3.7b4', label: '3.7b4' },
		{ id: '3.6b18', label: '3.6b18' },
		{ id: '3.5b12', label: '3.5b12 ONLY TCP' },
		{ id: '3.5b3', label: '3.5b3 ONLY TCP' },
		{ id: '3.4b8', label: '3.4b8 ONLY TCP COMMANDS' },
		{ id: '3.2b12', label: '3.2b12 ONLY TCP COMMANDS' },
		{ id: '3.2b11', label: '3.2b11 ONLY TCP COMMANDS' },
		{ id: '3.2b8', label: '3.2b8 ONLY TCP COMMANDS' },
		{ id: '3.2b2', label: '3.2b2 ONLY TCP COMMANDS' },
	] as const satisfies DropdownChoice[]
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
		if (
			connection === ConnectionType.WS &&
			PlaydeckVersion.isGreaterOrEqual(version, PlaydeckVersion.#FIRST_WS_CONNECTION)
		)
			return true
		if (
			connection === ConnectionType.TCP &&
			direction === ConnectionDirection.Incoming &&
			PlaydeckVersion.isGreaterOrEqual(version, PlaydeckVersion.#FIRST_TCP_EVENTS)
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
		if (!PlaydeckVersion.#isVersion(version1) || !PlaydeckVersion.#isVersion(version2)) return VersionCompare.Error
		const parsed1 = PlaydeckVersion.#parseVersion(version1)
		const parsed2 = PlaydeckVersion.#parseVersion(version2)
		for (let i = 0; i < parsed1.length; i++) {
			if (parsed1[i] === parsed2[i]) continue
			return parsed1[i] > parsed2[i] ? VersionCompare.Greater : VersionCompare.Lower
		}
		return VersionCompare.Equal
	}
	static isGreaterOrEqual(version1: Version, version2: Version): boolean | null {
		switch (PlaydeckVersion.compareTwoVersions(version1, version2)) {
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
		switch (PlaydeckVersion.compareTwoVersions(version1, version2)) {
			case VersionCompare.Lower:
				return true
			case VersionCompare.Error:
				return null
		}
		return false
	}
	constructor(version: Version) {
		this.#version = version
	}

	isEqisGreaterOrEqualualTo(version: Version): boolean | null {
		return PlaydeckVersion.isGreaterOrEqual(this.#version, version)
	}
	isLowerThan(version: Version): boolean | null {
		return PlaydeckVersion.isLowerThan(this.#version, version)
	}
	hasConnection(connection: ConnectionType, direction?: ConnectionDirection): boolean {
		return PlaydeckVersion.hasConnection(this.#version, connection, direction)
	}
}
export type Version = (typeof PlaydeckVersion.configVersions)[number]['id']
export enum VersionCompare {
	Greater = 1,
	Equal = 0,
	Lower = -1,
	Error = -99,
}
