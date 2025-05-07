"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatusV4 = void 0;
const PlaydeckStatusInterface_js_1 = require("../../PlaydeckStatusInterface.js");
const PlaydeckUtils_js_1 = require("../../../../../utils/PlaydeckUtils.js");
const PlaydeckStatusMesageV4_js_1 = require("./PlaydeckStatusMesageV4.js");
class PlaydeckStatusV4 extends PlaydeckStatusInterface_js_1.PlaydeckStatusInterface {
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
        if (this.#rawData.Project === undefined)
            return null;
        const project = this.#rawData.Project;
        return {
            projectName: project.ProjectName,
            projectFileName: project.ProjectFilename,
            clockTime: project.ClockTime,
            timestamp: project.Timestamp,
            timestampUnix: project.TimestampUnix,
        };
    }
    #getChannel() {
        if (this.#rawData === null)
            return null;
        if (this.#rawData.Channel === undefined)
            return null;
        const channels = this.#rawData.Channel;
        return channels.map((channel) => new PlaydeckChannelValues(channel));
    }
}
exports.PlaydeckStatusV4 = PlaydeckStatusV4;
class PlaydeckChannelValues {
    channelState;
    channelName;
    blockCount;
    tallyStatus;
    previewNote;
    stageWidth;
    stageHeight;
    playState;
    progressVisible;
    scheduleVisible;
    autoplayVisible;
    blockName;
    blockPosition;
    blockDuration;
    blockProgress;
    blockRemain;
    blockEnd;
    blockProgressAlert;
    clipName;
    clipPosition;
    clipDuration;
    clipProgress;
    clipProgressAlert;
    clipRemain;
    clipEnd;
    scheduleBlockName;
    scheduleTime;
    scheduleRemain;
    scheduleIcons;
    scheduleAlert;
    autoplayBlockName;
    autoplayTime;
    autoplayRemain;
    autoplayAlert;
    constructor(channel) {
        this.channelState = PlaydeckStatusMesageV4_js_1.ChannelState[channel.TallyStatus];
        this.channelName = channel.ChannelName;
        this.blockCount = channel.BlockCount;
        this.tallyStatus = PlaydeckUtils_js_1.Tally[channel.TallyStatus];
        this.previewNote = channel.PreviewNote;
        this.stageWidth = channel.StageWidth;
        this.stageHeight = channel.StageHeight;
        this.playState = this.#getPlaybackState(channel.PlayState);
        this.progressVisible = channel.ProgressVisible;
        this.scheduleVisible = channel.ScheduleVisible;
        this.autoplayVisible = channel.AutoplayVisible;
        this.blockName = channel.BlockName;
        this.blockPosition = channel.BlockPositionString;
        this.blockDuration = channel.BlockDurationString;
        this.blockProgress = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(channel.BlockProgress);
        this.blockRemain = channel.BlockRemainString;
        this.blockEnd = channel.BlockEndString;
        this.blockProgressAlert = channel.BlockProgressAlert;
        this.clipName = channel.ClipName;
        this.clipPosition = channel.ClipPositionString;
        this.clipDuration = channel.ClipDurationString;
        this.clipProgress = PlaydeckUtils_js_1.PlaydeckUtils.convertFloat(channel.ClipProgress);
        this.clipProgressAlert = channel.ClipProgressAlert;
        this.clipRemain = channel.ClipRemainString;
        this.clipEnd = channel.ClipEndString;
        this.scheduleBlockName = channel.ScheduleBlockName;
        this.scheduleTime = channel.ScheduleTimeString;
        this.scheduleRemain = channel.ScheduleRemainString;
        this.scheduleIcons = channel.ScheduleIcons;
        this.scheduleAlert = channel.ScheduleAlert;
        this.autoplayBlockName = channel.AutoplayBlockName;
        this.autoplayTime = channel.AutoplayTimeString;
        this.autoplayRemain = channel.AutoplayRemainString;
        this.autoplayAlert = channel.AutoplayAlert;
    }
    #getPlaybackState(playState) {
        const playbackState = {
            0: PlaydeckUtils_js_1.PlaybackState.Stop,
            1: PlaydeckUtils_js_1.PlaybackState.Cue,
            2: PlaydeckUtils_js_1.PlaybackState.Play,
            3: PlaydeckUtils_js_1.PlaybackState.Pause,
            4: PlaydeckUtils_js_1.PlaybackState.None,
        };
        return playbackState[playState];
    }
}
//# sourceMappingURL=PlaydeckStatusV4.js.map