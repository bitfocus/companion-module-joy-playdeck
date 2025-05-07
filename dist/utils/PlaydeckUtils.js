"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tally = exports.PlaybackState = exports.PlaydeckUtils = void 0;
class PlaydeckUtils {
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
exports.PlaydeckUtils = PlaydeckUtils;
var PlaybackState;
(function (PlaybackState) {
    PlaybackState["None"] = "";
    PlaybackState["Stop"] = "stop";
    PlaybackState["Pause"] = "pause";
    PlaybackState["Play"] = "play";
    PlaybackState["Cue"] = "cue";
})(PlaybackState || (exports.PlaybackState = PlaybackState = {}));
var Tally;
(function (Tally) {
    Tally[Tally["None"] = 0] = "None";
    Tally[Tally["Preview"] = 1] = "Preview";
    Tally[Tally["Program"] = 2] = "Program";
})(Tally || (exports.Tally = Tally = {}));
//# sourceMappingURL=PlaydeckUtils.js.map