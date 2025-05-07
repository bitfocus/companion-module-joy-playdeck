"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusUtilsV3 = void 0;
class StatusUtilsV3 {
    /** Converts UNIX Timestamp in seconds in string formatted HH:mm:ss padded with 0 */
    static convertTimestamp(unixSecTimestamp) {
        const date = new Date(unixSecTimestamp * 1000);
        if (unixSecTimestamp > 0) {
            return `${this.#padWithZero(date.getHours())}:${this.#padWithZero(date.getMinutes())}:${this.#padWithZero(date.getSeconds())}`;
        }
        return `00:00:00`;
    }
    /** Converts float value in seconds to trimmed duration in seconds */
    static convertFloat(floatValue) {
        if (floatValue > 0) {
            return Math.floor(+floatValue);
        }
        return 0;
    }
    static #padWithZero(num) {
        return `0${num}`.slice(-2);
    }
}
exports.StatusUtilsV3 = StatusUtilsV3;
//# sourceMappingURL=PlaydeckStatusUtilsV3.js.map