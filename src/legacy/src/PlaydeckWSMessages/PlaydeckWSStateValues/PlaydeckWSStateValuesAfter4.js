const { PlaybackState, ClipType } = require('../../PlaydeckState');

class PlaydeckWSStateValuesAfter4 {
  #project = null;
  #channel = null;
  /**
   * @type { StatusMessage }
   */
  #sMessage;
  /**
   * @param { StatusMessage } sMessage
   */
  constructor(sMessage) {
    this.#sMessage = sMessage;
    this.update(sMessage);
  }
  /**
   *
   * @param { StatusMessage } sMessage
   */
  update(sMessage) {
    /**
     * @type { StatusMessage }
     */
    this.#sMessage = sMessage;
    const projectState = this.#sMessage.Project;
    this.#project = {
      projectName: projectState.ProjectName,
      projectFileName: projectState.ProjectFilename,
      clockTime: projectState.ClockTime,
      timestamp: projectState.Timestamp,
      timestampUnix: this.#convertTimestamp(projectState.TimestampUnix),
    };
    this.#channel = Array.from({ length: 8 }, (_, index) => this.#convertChannelStatusMessage(index));
  }
  getValues() {
    if (this.#project === null || this.#channel[0] === null) return null;
    return {
      global: this.#project,
      channel: this.#channel,
    };
  }
  /**
   * @private
   * @param { number } channelNumber
   */
  #convertChannelStatusMessage(channelNumber) {
    const channelArray = this.#sMessage.Channel;
    if (channelArray === undefined) return null;
    const channelState = channelArray[channelNumber];
    const channelStateValues = {
      channelState: channelState.ChannelState,
      channelName: channelState.ChannelName,
      blockCount: channelState.BlockCount,
      tallyStatus: channelState.TallyStatus,
      previewNote: channelState.PreviewNote,
      stageWidth: channelState.StageWidth,
      stageHeight: channelState.StageHeight,
      playState: this.#getPlaybackState(channelState.PlayState),
      progressVisible: channelState.ProgressVisible,
      scheduleVisible: channelState.ScheduleVisible,
      autoplayVisible: channelState.AutoplayVisible,
      blockName: channelState.BlockName,
      blockPosition: channelState.BlockPositionString,
      blockDuration: channelState.BlockDurationString,
      blockProgress: this.#convertFloat(channelState.BlockProgress),
      blockRemain: channelState.BlockRemainString,
      blockEnd: channelState.BlockEndString,
      blockProgressAlert: channelState.BlockProgressAlert,
      clipName: channelState.ClipName,
      clipPosition: channelState.ClipPositionString,
      clipDuration: channelState.ClipDurationString,
      clipProgress: this.#convertFloat(channelState.ClipProgress),
      clipProgressAlert: channelState.ClipProgressAlert,
      clipRemain: channelState.ClipRemainString,
      clipEnd: channelState.ClipEndString,
      scheduleBlockName: channelState.ScheduleBlockName,
      scheduleTime: channelState.ScheduleTimeString,
      scheduleRemain: channelState.ScheduleRemainString,
      scheduleIcons: channelState.ScheduleIcons,
      scheduleAlert: channelState.ScheduleAlert,
      autoplayBlockName: channelState.AutoplayBlockName,
      autoplayTime: channelState.AutoplayTimeString,
      autoplayRemain: channelState.AutoplayRemainString,
      autoplayAlert: channelState.AutoplayAlert,
    };
    return channelStateValues;
  }
  /**
   *
   * @param { 0| 1 | 2 | 3 | 4 } playState
   * @returns { PlaybackState }
   */
  #getPlaybackState(playState) {
    const playbackState = {
      0: PlaybackState.Stop,
      1: PlaybackState.Cue,
      2: PlaybackState.Play,
      3: PlaybackState.Pause,
      4: null,
    };
    return playbackState[playState];
  }
  /**
   * Converts float value in seconds to trimmed duration in seconds
   * @private
   * @param { number } floatValue
   * @returns { number }
   */
  #convertFloat(floatValue) {
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
  #convertTimestamp(unixSecTimestamp) {
    const date = new Date(unixSecTimestamp * 1000);
    if (unixSecTimestamp > 0) {
      return `${this.#padWithZero(date.getHours())}:${this.#padWithZero(date.getMinutes())}:${this.#padWithZero(date.getSeconds())}`;
    }
    return `00:00:00`;
  }

  #padWithZero(num) {
    return `0${num}`.slice(-2);
  }
}

/**
 *
 * @typedef { Object } StatusMessage
 * @property { StatusMessageProject } Project - Contains of general status for both playlists
 * @property { StatusMessageChannel[] } Channel - Indicates status of each playlist
 * @property { StatusDirectorVeiw[] } DirectorView - Array of 4 DirectorType info
 */

/**
 *
 * @typedef { Object } StatusMessageGeneral
 * @property { string } ProjectName - Name of current project
 * @property { string } ProjectFilename - FileName of current project
 * @property { string } ClockTime - Clock string of current time
 * @property { string } Timestamp - Timestamp string of current time
 * @property { number } TimestampUnix - Timestamp of Current time (UNIX Timestamp)
 */

/**
 *
 * @typedef { Object } StatusMessageChannel
 * @property { number } ChannelState - State of channel `0` - not started, `1` - starting , `2` - active
 * @property { string } ChannelName - Name of channel
 *
 * @property { number } BlockCount - Amount of blocks in channel
 *
 * @property { StatusNum } TallyStatus - Tally of channel: `0` is `disabled`, `1` is `preview`, `2` is `program`
 *
 * @property { string } PreviewNote - String with preview note
 *
 * @property { number } StageWidth - Output Width
 * @property { number } StageHeight - Output Height
 *
 * @property { number } PlayState - Play state of channel: `0` is `stopped`, `1` is `cued`, `2` is `playing`, `3` is `paused`, `4` - `busy`
 * @property { boolean } ProgressVisible - flag for hide/show progressbar on directors view
 *
 * @property { boolean } ScheduleVisible - flag for hide/show schedule on directors view
 * @property { boolean } AutoplayVisible - flag for hide/show autoplay on directors view
 *
 * @property { string } BlockName - Name of current Block
 * @property { number } BlockPosition - Current playhead position of block (`float seconds`)
 * @property { string } BlockPositionString - Current playhead position of block in string format `HH:MM:SS`
 * @property { number } BlockDuration - Block duration (`float seconds`)
 * @property { string } BlockDurationString - Block duration in string format `HH:MM:SS`
 * @property { number } BlockProgress - Block progress (`float percent`)
 * @property { boolean } BlockProgressAlert - flag for block progress alert
 * @property { number } BlockRemain - Block remaining time (`float seconds`)
 * @property { string } BlockRemainString - Block remaining time in string format `HH:MM:SS`
 * @property { number } BlockEnd - Time when block ends (`UNIX timestamp`)
 * @property { string } BlockEndString - Time when block ends in string format `HH:MM:SS`
 *
 * @property { string } ClipName - Name of current Clip
 * @property { number } ClipPosition - Current playhead position of Clip (`float seconds`)
 * @property { string } ClipPositionString - Current playhead position of Clip in string format `HH:MM:SS`
 * @property { number } ClipDuration - Clip duration (`float seconds`)
 * @property { string } ClipDurationString - Clip duration in string format `HH:MM:SS`
 * @property { number } ClipProgress - Clip progress (`float percent`)
 * @property { boolean } ClipProgressAlert - flag for Clip progress alert
 * @property { number } ClipRemain - Clip remaining time (`float seconds`)
 * @property { string } ClipRemainString - Clip remaining time in string format `HH:MM:SS`
 * @property { number } ClipEnd - Time when Clip ends (`UNIX timestamp`)
 * @property { string } ClipEndString - Time when Clip ends in string format `HH:MM:SS`
 *
 * @property { string } ScheduleBlockName - Name of Schedule Block
 * @property { number } ScheduleTime - Time when Schedule starts (`UNIX timestamp`)
 * @property { string } ScheduleTimeString - Time when Schedule starts in string format `HH:MM:SS`
 * @property { number } ScheduleRemain - Schedule remaining time (`float seconds`)
 * @property { string } ScheduleRemainString - Schedule remaining time in string format `HH:MM:SS`
 * @property { boolean } ScheduleAlert - flag for Schedule alert
 * @property { string } ScheduleIcons - Schedule icons string
 *
 * @property { string } AutoplayBlockName - Name of Autoplay Block
 * @property { number } AutoplayTime - Time when Autoplay starts (`UNIX timestamp`)
 * @property { string } AutoplayTimeString - Time when Autoplay starts in string format `HH:MM:SS`
 * @property { number } AutoplayRemain - Autoplay remaining time (`float seconds`)
 * @property { string } AutoplayRemainString - Autoplay remaining time in string format `HH:MM:SS`
 * @property { boolean } AutoplayAlert - flag for Autoplay alert
 */

/**
 *
 * @typedef { Object } StatusDirectorVeiw
 * @property { number } DirectorType - Director type: `1` - Single channel, `2` - Dual channel, `3` - Four channel, `4` - 8 channel,
 * @property { string } ChannelIDs - Channel ID's for director view (splitted by `,`)
 * @property { boolean } ShowTimer - flag for showing timer for current director ID view
 * @property { boolean } ShowName - flag for showing channel names for current director ID view
 * @property { boolean } ShowTally - flag for showing tally for current director ID view
 * @property { boolean } ShowNotes - flag for showing preview notes for current director ID view
 */

/**
 * @typedef { 0 | 1 | 2 } StatusNum  // 0 - normal, 1 - yellow/preview, 2 - red/program
 */

module.exports = {
  PlaydeckWSStateValuesAfter4,
};
