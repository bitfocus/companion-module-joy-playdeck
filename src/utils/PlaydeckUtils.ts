import { InputValue } from '@companion-module/base/dist'

/** rounded down `number` */
export type integer = number
/** floaty number */
export type float = number
/** UNIX Timestamp in seconds in string formatted `HH:mm:ss` */
export type TimestampString = string
/** UNIX Timestamp in seconds */
export type TimestampUNIX = number

export class PlaydeckUtils {
	static RC_REGEX = /\<(.*?)\>/
	/** Converts UNIX Timestamp in seconds in string formatted HH:mm:ss padded with 0 */
	static convertTimestamp(unixSecTimestamp: TimestampUNIX): TimestampString {
		const date = new Date(unixSecTimestamp * 1000)
		if (unixSecTimestamp > 0) {
			return `${this.#padWithZero(date.getHours())}:${this.#padWithZero(date.getMinutes())}:${this.#padWithZero(date.getSeconds())}`
		}
		return `00:00:00`
	}
	/** Converts float value in seconds to trimmed duration in seconds */
	static convertFloat(floatValue: float): integer {
		if (floatValue > 0) {
			return Math.floor(+floatValue)
		}
		return 0
	}
	static #padWithZero(num: integer): string {
		return `0${num}`.slice(-2)
	}
	static isInEnum<T extends Record<string, string | number>>(value: string | number, enumObject: T): boolean {
		return Object.values(enumObject).includes(value)
	}
	static trimFloat(num: float, trim: integer): float {
		return Number(num.toFixed(trim))
	}
	static makeRCMessage(message: string, args: (InputValue | undefined | null)[]): string {
		if (!message) return `<>`
		if (!Array.isArray(args)) return `<${message}>`
		for (let i = 0; i < args.length; i++) {
			if (!args[i]) return `<${message}>`
			message = `${message}|${args[i]}`
		}
		return `<${message}>`
	}
}

export enum PlaybackState {
	None = '',
	Stop = 'stop',
	Pause = 'pause',
	Play = 'play',
	Cue = 'cue',
}

export enum Tally {
	None = 0,
	Preview = 1,
	Program = 2,
}
