import { integer, float, UNIXTimestamp, TimestampString } from '../../../../../utils/PlaydeckUtils.js'

export class StatusUtilsV3 {
	/** Converts UNIX Timestamp in seconds in string formatted HH:mm:ss padded with 0 */
	static convertTimestamp(unixSecTimestamp: UNIXTimestamp): TimestampString {
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
}
