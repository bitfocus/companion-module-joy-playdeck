"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatusV3 = void 0;
const PlaydeckStatusInterface_js_1 = require("../../PlaydeckStatusInterface.js");
const PlaydeckUtils_js_1 = require("../../../../../utils/PlaydeckUtils.js");
const PlaydeckStatusMesageV3_js_1 = require("./PlaydeckStatusMesageV3.js");
class PlaydeckStatusV3 extends PlaydeckStatusInterface_js_1.PlaydeckStatusInterface {
    #common = null;
    #channel = null;
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
            recordingDuration: PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(general.RecordingDuration),
            recordingTimeStart: PlaydeckUtils_js_1.PlaydeckUtils.convertTimestamp(general.RecordingTimeStart),
        };
    }
    #getChannel() {
        if (this.#rawData === null)
            return null;
        if (this.#rawData.Playlist === undefined)
            return null;
        const channels = this.#rawData.Playlist;
        return channels.map((playlist) => new PlaydeckPlaylistValues(playlist));
    }
}
exports.PlaydeckStatusV3 = PlaydeckStatusV3;
class PlaydeckPlaylistValues {
    channelName;
    tallyStatus;
    previewNote;
    stageWidth;
    stageHeight;
    state;
    blockCount;
    blockScheduleActive;
    blockScheduleMethod;
    blockScheduleRemaining;
    blockScheduleAlert;
    blockScheduleOvertime;
    blockAutoplayActive;
    blockAutoplayRemaining;
    blockAutoplayAlert;
    blockName;
    blockDuration;
    blockProgress;
    blockPosition;
    blockRemaining;
    blockRemainingAlert;
    blockTimeStart;
    blockTimeEnd;
    blockIsClock;
    blockID;
    clipID;
    clipFile;
    clipWidth;
    clipHeight;
    clipName;
    clipDuration;
    clipProgress;
    clipPosition;
    clipRemaining;
    clipRemainingAlert;
    clipTimeStart;
    clipTimeEnd;
    clipType;
    constructor(playlist) {
        this.channelName = playlist.ChannelName;
        this.tallyStatus = PlaydeckUtils_js_1.Tally[playlist.TallyStatus];
        this.previewNote = playlist.PreviewNote;
        this.stageWidth = playlist.StageWidth;
        this.stageHeight = playlist.StageHeight;
        this.state = this.#getStateForPlaylist(playlist);
        this.blockCount = playlist.BlockCount;
        this.blockScheduleActive = playlist.BlockScheduleActive;
        this.blockScheduleMethod = PlaydeckStatusMesageV3_js_1.BlockScheduleMethod[playlist.BlockScheduleMethod];
        this.blockScheduleRemaining = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.BlockScheduleRemaining);
        this.blockScheduleAlert = playlist.BlockScheduleAlert;
        this.blockScheduleOvertime = playlist.BlockScheduleOvertime;
        this.blockAutoplayActive = playlist.BlockAutoplayActive;
        this.blockAutoplayRemaining = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.BlockAutoplayRemaining);
        this.blockAutoplayAlert = playlist.BlockAutoplayAlert;
        this.blockName = playlist.BlockName;
        this.blockDuration = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.BlockDuration);
        this.blockProgress = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.BlockProgress);
        this.blockPosition = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.BlockPosition);
        this.blockRemaining = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.BlockRemaining);
        this.blockRemainingAlert = playlist.BlockRemainingAlert;
        this.blockTimeStart = PlaydeckUtils_js_1.PlaydeckUtils.convertTimestamp(playlist.BlockTimeStart);
        this.blockTimeEnd = PlaydeckUtils_js_1.PlaydeckUtils.convertTimestamp(playlist.BlockTimeEnd);
        this.blockIsClock = playlist.BlockIsClock;
        this.blockID = playlist.BlockID;
        this.clipID = playlist.ClipID;
        this.clipFile = playlist.ClipFile;
        this.clipWidth = playlist.ClipWidth;
        this.clipHeight = playlist.ClipHeight;
        this.clipName = playlist.ClipName;
        this.clipDuration = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.ClipDuration);
        this.clipProgress = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.ClipProgress);
        this.clipPosition = Math.max(PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.ClipPosition) - 1, 0); // it equals `0` only if stopped and on que it is `1`
        this.clipRemaining = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(playlist.ClipRemaining);
        this.clipRemainingAlert = playlist.ClipRemainingAlert;
        this.clipTimeStart = PlaydeckUtils_js_1.PlaydeckUtils.convertTimestamp(playlist.ClipTimeStart);
        this.clipTimeEnd = PlaydeckUtils_js_1.PlaydeckUtils.convertTimestamp(playlist.ClipTimeEnd);
        this.clipType = this.#getClipType(playlist);
    }
    #getStateForPlaylist(playlist) {
        if (playlist.StatusPlaying && !playlist.StatusPaused)
            return PlaydeckUtils_js_1.PlaybackState.Play;
        if (playlist.StatusPaused && !playlist.StatusCued)
            return PlaydeckUtils_js_1.PlaybackState.Pause;
        if (playlist.StatusCued)
            return PlaydeckUtils_js_1.PlaybackState.Cue;
        if (!playlist.StatusPlaying && !playlist.StatusPaused)
            return PlaydeckUtils_js_1.PlaybackState.Stop;
        return PlaydeckUtils_js_1.PlaybackState.None;
    }
    #getClipType(playlist) {
        if (playlist.ClipIsAction)
            return ClipType.Action;
        if (playlist.ClipIsAudio)
            return ClipType.Audio;
        if (playlist.ClipIsClock)
            return ClipType.Clock;
        if (playlist.ClipIsHighlight)
            return ClipType.Highlight;
        if (playlist.ClipIsImage)
            return ClipType.Image;
        if (playlist.ClipIsInput)
            return ClipType.Input;
        if (playlist.ClipIsTube)
            return ClipType.Tube;
        if (playlist.ClipIsVideo)
            return ClipType.Video;
        return ClipType.None;
    }
}
var ClipType;
(function (ClipType) {
    ClipType["None"] = "";
    ClipType["Clock"] = "Clock";
    ClipType["Video"] = "Video";
    ClipType["Image"] = "Image";
    ClipType["Audio"] = "Audio";
    ClipType["Input"] = "Input";
    ClipType["Tube"] = "Youtube";
    ClipType["Action"] = "Action";
    ClipType["Highlight"] = "Highlight";
})(ClipType || (ClipType = {}));
//# sourceMappingURL=PlaydeckStatusV3.js.map