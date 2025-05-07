"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatusV3 = void 0;
const PlaydeckStatusInterface_js_1 = require("../PlaydeckStatusInterface.js");
class PlaydeckStatusV3 extends PlaydeckStatusInterface_js_1.PlaydeckStatusInterface {
    #common;
    #channel;
    #rawData = null;
    constructor(playdeckStatusObject) {
        super();
        this.#rawData = playdeckStatusObject;
    }
    getValues() {
        if (this.#rawData === null)
            return null;
        this.#common = this.#getCommon();
        this.#channel = this.#getChannel();
        if (this.#common === null)
            return null;
        if (this.#channel === null)
            return null;
        return {
            common: this.#common,
            channel: this.#channel,
        };
    }
    #getCommon() {
        if (this.#rawData === null)
            return null;
        if (this.#rawData.General === undefined)
            return null;
        const general = this.#rawData.General;
        return {
            playlistFile: general.PlaylistFile,
            activeChannels: general.ActiveChannels,
            productionMode: Boolean(general.ProductionMode),
            isRecording: general.IsRecording,
            recordingDuration: this.convertFloat(general.RecordingDuration),
            recordingTimeStart: this.convertTimestamp(general.RecordingTimeStart),
        };
    }
    #getChannel() {
        return null;
    }
    convertPlaylistStatusMessage(plstNum) {
        const playListArray = this.sMessage.Playlist;
        if (playListArray === undefined)
            return null;
        const playlistState = playListArray[plstNum];
        const playlistStateValues = {
            channelName: playlistState.ChannelName,
            tallyStatus: playlistState.TallyStatus,
            previewNote: playlistState.PreviewNote,
            stageWidth: playlistState.StageWidth,
            stageHeight: playlistState.StageHeight,
            state: this.getStateForPlaylist(plstNum),
            blockCount: playlistState.BlockCount,
            blockScheduleActive: playlistState.BlockScheduleActive,
            blockScheduleMethod: playlistState.BlockScheduleMethod,
            blockScheduleRemaining: this.convertFloat(playlistState.BlockScheduleRemaining),
            blockScheduleAlert: this.convertFloat(playlistState.BlockScheduleAlert),
            blockScheduleOvertime: playlistState.BlockScheduleOvertime,
            blockAutoplayActive: playlistState.BlockAutoplayActive,
            blockAutoplayRemaining: this.convertFloat(playlistState.BlockAutoplayRemaining),
            blockAutoplayAlert: playlistState.BlockAutoplayAlert,
            blockName: playlistState.BlockName,
            blockDuration: this.convertFloat(playlistState.BlockDuration),
            blockProgress: this.convertFloat(playlistState.BlockProgress),
            blockPosition: this.convertFloat(playlistState.BlockPosition),
            blockRemaining: this.convertFloat(playlistState.BlockRemaining),
            blockRemainingAlert: playlistState.BlockRemainingAlert,
            blockTimeStart: this.convertTimestamp(playlistState.BlockTimeStart),
            blockTimeEnd: this.convertTimestamp(playlistState.BlockTimeEnd),
            blockIsClock: playlistState.BlockIsClock,
            blockID: playlistState.BlockID,
            clipID: playlistState.ClipID,
            clipFile: playlistState.ClipFile,
            clipWidth: playlistState.ClipWidth,
            clipHeight: playlistState.ClipHeight,
            clipName: playlistState.ClipName,
            clipDuration: this.convertFloat(playlistState.ClipDuration),
            clipProgress: this.convertFloat(playlistState.ClipProgress),
            clipPosition: Math.max(this.convertFloat(playlistState.ClipPosition) - 1, 0), // it equals `0` only if stopped, and on que it is `1`
            clipRemaining: this.convertFloat(playlistState.ClipRemaining),
            clipRemainingAlert: playlistState.ClipRemainingAlert,
            clipTimeStart: this.convertTimestamp(playlistState.ClipTimeStart),
            clipTimeEnd: this.convertTimestamp(playlistState.ClipTimeEnd),
            clipType: this.getClipType(plstNum),
        };
        return playlistStateValues;
    }
    /**
     *
     * @param { number } plstNum
     * @returns { PlaybackState }
     */
    getStateForPlaylist(plstNum) {
        const playlistState = this.sMessage.Playlist[plstNum];
        if (playlistState.StatusPlaying && !playlistState.StatusPaused)
            return PlaybackState.Play;
        if (playlistState.StatusPaused && !playlistState.StatusCued)
            return PlaybackState.Pause;
        if (playlistState.StatusCued)
            return PlaybackState.Cue;
        if (!playlistState.StatusPlaying && !playlistState.StatusPaused)
            return PlaybackState.Stop;
        return null;
    }
    /**
     *
     * @param { number } plstNum
     * @returns  { ClipType }
     */
    getClipType(plstNum) {
        const playlistState = this.sMessage.Playlist[plstNum];
        if (playlistState.ClipIsAction)
            return ClipType.Action;
        if (playlistState.ClipIsAudio)
            return ClipType.Audio;
        if (playlistState.ClipIsClock)
            return ClipType.Clock;
        if (playlistState.ClipIsHighlight)
            return ClipType.Highlight;
        if (playlistState.ClipIsImage)
            return ClipType.Image;
        if (playlistState.ClipIsInput)
            return ClipType.Input;
        if (playlistState.ClipIsTube)
            return ClipType.Tube;
        if (playlistState.ClipIsVideo)
            return ClipType.Video;
        return null;
    }
    /**
     * Converts float value in seconds to trimmed duration in seconds
     * @private
     * @param { number } floatValue
     * @returns { number }
     */
    convertFloat(floatValue) {
        if (floatValue > 0) {
            return Math.floor(+floatValue);
        }
        return 0;
    }
    /**
     * Converts UNIX Timestamp in seconds in string formatted HH:mm:ss
     * @private
     * @param { number } unixSecTimestamp
     * @returns { string } Value formatted HH:mm:ss padded with 0
     */
    convertTimestamp(unixSecTimestamp) {
        const date = new Date(unixSecTimestamp * 1000);
        if (unixSecTimestamp > 0) {
            return `${this.padWithZero(date.getHours())}:${this.padWithZero(date.getMinutes())}:${this.padWithZero(date.getSeconds())}`;
        }
        return `00:00:00`;
    }
    padWithZero(num) {
        return `0${num}`.slice(-2);
    }
}
exports.PlaydeckStatusV3 = PlaydeckStatusV3;
-1, 0;
clipRemaining: this.convertFloat(playlistState.ClipRemaining),
    clipRemainingAlert;
playlistState.ClipRemainingAlert,
    clipTimeStart;
this.convertTimestamp(playlistState.ClipTimeStart),
    clipTimeEnd;
this.convertTimestamp(playlistState.ClipTimeEnd),
    clipType;
this.getClipType(plstNum),
;
var BlockAutoplayAlert;
(function (BlockAutoplayAlert) {
    BlockAutoplayAlert[BlockAutoplayAlert["Alert0"] = 0] = "Alert0";
    BlockAutoplayAlert[BlockAutoplayAlert["Alert1"] = 1] = "Alert1";
    BlockAutoplayAlert[BlockAutoplayAlert["Alert2"] = 2] = "Alert2";
})(BlockAutoplayAlert || (BlockAutoplayAlert = {}));
var ProductionMode;
(function (ProductionMode) {
    ProductionMode[ProductionMode["Off"] = 0] = "Off";
    ProductionMode[ProductionMode["On"] = 1] = "On";
})(ProductionMode || (ProductionMode = {}));
var Tally;
(function (Tally) {
    Tally[Tally["None"] = 0] = "None";
    Tally[Tally["Preview"] = 1] = "Preview";
    Tally[Tally["Program"] = 2] = "Program";
})(Tally || (Tally = {}));
var BlockScheduleMethod;
(function (BlockScheduleMethod) {
    BlockScheduleMethod[BlockScheduleMethod["None"] = 0] = "None";
    /** Always Play, independent of Playlist status */
    BlockScheduleMethod[BlockScheduleMethod["AlwaysPlay"] = 1] = "AlwaysPlay";
    /** Play only, if first Clip is in CUE */
    BlockScheduleMethod[BlockScheduleMethod["PlayOnly"] = 2] = "PlayOnly";
    /** Don't play, only show countdown, if first Clip is in CUE */
    BlockScheduleMethod[BlockScheduleMethod["DontPlay"] = 3] = "DontPlay";
})(BlockScheduleMethod || (BlockScheduleMethod = {}));
var PlaybackState;
(function (PlaybackState) {
    PlaybackState["Stop"] = "stop";
    PlaybackState["Pause"] = "pause";
    PlaybackState["Play"] = "play";
    PlaybackState["Cue"] = "cue";
})(PlaybackState || (PlaybackState = {}));
//# sourceMappingURL=PlaydeckStatusV3.js.map