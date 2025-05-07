"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatusV3 = void 0;
const PlaydeckStatusInterface_js_1 = require("../../PlaydeckStatusInterface.js");
const PlaydeckStatusUtilsV3_js_1 = require("./PlaydeckStatusUtilsV3.js");
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
            recordingDuration: PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(general.RecordingDuration),
            recordingTimeStart: PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertTimestamp(general.RecordingTimeStart),
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
        this.tallyStatus = PlaydeckStatusMesageV3_js_1.Tally[playlist.TallyStatus];
        this.previewNote = playlist.PreviewNote;
        this.stageWidth = playlist.StageWidth;
        this.stageHeight = playlist.StageHeight;
        this.state = this.#getStateForPlaylist(playlist);
        this.blockCount = playlist.BlockCount;
        this.blockScheduleActive = playlist.BlockScheduleActive;
        this.blockScheduleMethod = PlaydeckStatusMesageV3_js_1.BlockScheduleMethod[playlist.BlockScheduleMethod];
        this.blockScheduleRemaining = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.BlockScheduleRemaining);
        this.blockScheduleAlert = playlist.BlockScheduleAlert;
        this.blockScheduleOvertime = playlist.BlockScheduleOvertime;
        this.blockAutoplayActive = playlist.BlockAutoplayActive;
        this.blockAutoplayRemaining = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.BlockAutoplayRemaining);
        this.blockAutoplayAlert = playlist.BlockAutoplayAlert;
        this.blockName = playlist.BlockName;
        this.blockDuration = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.BlockDuration);
        this.blockProgress = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.BlockProgress);
        this.blockPosition = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.BlockPosition);
        this.blockRemaining = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.BlockRemaining);
        this.blockRemainingAlert = playlist.BlockRemainingAlert;
        this.blockTimeStart = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertTimestamp(playlist.BlockTimeStart);
        this.blockTimeEnd = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertTimestamp(playlist.BlockTimeEnd);
        this.blockIsClock = playlist.BlockIsClock;
        this.blockID = playlist.BlockID;
        this.clipID = playlist.ClipID;
        this.clipFile = playlist.ClipFile;
        this.clipWidth = playlist.ClipWidth;
        this.clipHeight = playlist.ClipHeight;
        this.clipName = playlist.ClipName;
        this.clipDuration = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.ClipDuration);
        this.clipProgress = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.ClipProgress);
        this.clipPosition = Math.max(PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.ClipPosition) - 1, 0); // it equals `0` only if stopped and on que it is `1`
        this.clipRemaining = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertFloat(playlist.ClipRemaining);
        this.clipRemainingAlert = playlist.ClipRemainingAlert;
        this.clipTimeStart = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertTimestamp(playlist.ClipTimeStart);
        this.clipTimeEnd = PlaydeckStatusUtilsV3_js_1.StatusUtilsV3.convertTimestamp(playlist.ClipTimeEnd);
        this.clipType = this.#getClipType(playlist);
    }
    #getStateForPlaylist(playlist) {
        if (playlist.StatusPlaying && !playlist.StatusPaused)
            return PlaybackState.Play;
        if (playlist.StatusPaused && !playlist.StatusCued)
            return PlaybackState.Pause;
        if (playlist.StatusCued)
            return PlaybackState.Cue;
        if (!playlist.StatusPlaying && !playlist.StatusPaused)
            return PlaybackState.Stop;
        return PlaybackState.None;
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
var PlaybackState;
(function (PlaybackState) {
    PlaybackState["None"] = "";
    PlaybackState["Stop"] = "stop";
    PlaybackState["Pause"] = "pause";
    PlaybackState["Play"] = "play";
    PlaybackState["Cue"] = "cue";
})(PlaybackState || (PlaybackState = {}));
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