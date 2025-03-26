const { InstanceStatus } = require('@companion-module/base');
const WebSocket = require('ws');
const { PlaydeckConnection, ConnectionType, ConnectionDirection } = require('./PlaydeckConnection');
const PlaydeckInstance = require('../../index');
const { PlaybackState, ClipType } = require('../PlaydeckState');
const { PlaydeckRCEventMessage } = require(`../PlaydeckRCMessages/PlaydeckRCEventMessage`);

class PlaydeckWSConnection extends PlaydeckConnection {
  /** @type { PlaydeckWSStateValues | null } */
  #stateValues = null;

  /** @type { WebSocket | null} */
  #webSocket = null;

  /**
   * @param { PlaydeckInstance } instance
   * @param { ConnectionDirection } direction
   *
   */
  constructor(instance, direction) {
    super(instance, direction);
    this.type = ConnectionType.WS;
    this._port = this._instance.config.wsPort;
    this._host = this._instance.config.host;
    this._log(`info`, `Starting connection. IP/HOST: ${this._host}. PORT: ${this._port}`);
    this._init();
  }
  _init() {
    this._updateStatus(InstanceStatus.Connecting);
    this.#webSocket = new WebSocket(`ws://${this._host}:${this._port}`);
    this.#webSocket.on('open', () => {
      this._log(`info`, `Connected.`);
      this._updateStatus(InstanceStatus.Ok);
      this._lastErrorMessage = null;
    });
    this.#webSocket.on('message', (rawData, isBinary) => {
      if (!isBinary) {
        this.#dataHandler(rawData.toString());
      }
    });
    this.#webSocket.on('error', (err) => {
      this._log('error', `Error: ${err.message}`);
      this._lastErrorMessage = err.message;
      this._updateStatus(InstanceStatus.ConnectionFailure, this._lastErrorMessage);
    });
    this.#webSocket.on('close', (code, reason) => {
      this._log('debug', `Closed with code: ${code}, with reason: ${reason.toString()}`);
      this._reconnect();
    });
  }
  /**
   *
   * @param {string} data
   */
  #dataHandler(data) {
    if (data.indexOf(`|`) == -1) {
      this._log(`debug`, `Recieved non properly formatted message: ${data}`);
      return;
    }
    const dataArray = data.split(`|`);
    /** 
      @constant
      @type {'event' | 'status' | 'permanent' }
    */
    const sType = dataArray.shift();
    const sData = dataArray.join('|');
    switch (sType) {
      case 'event':
        const newEvent = new PlaydeckRCEventMessage(this._instance, `<${sData}>`);
        break;
      case 'status':
        this.#handleStatus(JSON.parse(sData));
        break;
      case 'permanent':
        this._log(`debug`, `Recieved permanent: ${sData}`); // don't know what it means it returns {"AnyVariableName":"1"}
        break;
    }
  }
  /**
   *
   * @param { StatusMessage } sMessage
   */
  #handleStatus(sMessage) {
    if (this.#stateValues === null) {
      this.#stateValues = new PlaydeckWSStateValues(sMessage);
    } else {
      this.#stateValues.update(sMessage);
    }
    this._instance.state.updateValues({
      project: this.#stateValues.project,
      channel: this.#stateValues.channel,
    });
  }

  /**
   * @param { string } command
   * @override
   */
  send(command) {
    this._log('debug', `Message sent: ${command}`);
    this.#webSocket.send(command);
  }
  /**
   * @override
   */
  destroy() {
    this.#webSocket.close(1000);
    this._log(`debug`, `Connection destroyed.`);
  }
}

class PlaydeckWSStateValues {
  /**
   *
   * @param { StatusMessage } sMessage
   */
  constructor(sMessage) {
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
    this.sMessage = sMessage;
    const projectState = this.sMessage.Project;
    this.project = {
      projectName: projectState.ProjectName,
      projectFileName: projectState.ProjectFilename,
      clockTime: projectState.ClockTime,
      timestamp: projectState.Timestamp,
      timestampUnix: this.convertTimestamp(projectState.TimestampUnix),
    };
    this.channel = Array.from({ length: 8 }, (_, index) => this.convertChannelStatusMessage(index));
  }
  /**
   *
   * @param { number } channelNumber
   */
  convertChannelStatusMessage(channelNumber) {
    const channelState = this.sMessage.Channel[channelNumber];
    const channelStateValues = {
      channelState: channelState.ChannelState,
      channelName: channelState.ChannelName,
      blockCount: channelState.BlockCount,
      tallyStatus: channelState.TallyStatus,
      previewNote: channelState.PreviewNote,
      stageWidth: channelState.StageWidth,
      stageHeight: channelState.StageHeight,
      playState: this.getPlaybackState(channelState.PlayState),
      progressVisible: channelState.ProgressVisible,
      scheduleVisible: channelState.ScheduleVisible,
      autoplayVisible: channelState.AutoplayVisible,
      blockName: channelState.BlockName,
      blockPosition: channelState.BlockPositionString,
      blockDuration: channelState.BlockDurationString,
      blockProgress: this.convertFloat(channelState.BlockProgress),
      blockRemain: channelState.BlockRemainString,
      blockEnd: channelState.BlockEndString,
      blockProgressAlert: channelState.BlockProgressAlert,
      clipName: channelState.ClipName,
      clipPosition: channelState.ClipPositionString,
      clipDuration: channelState.ClipDurationString,
      clipProgress: this.convertFloat(channelState.ClipProgress),
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
  getPlaybackState(playState) {
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
   *
   * @param { number } plstNum
   * @returns  { ClipType }
   */
  getClipType(plstNum) {
    const playlistState = this.sMessage.Playlist[plstNum];
    if (playlistState.ClipIsAction) return ClipType.Action;
    if (playlistState.ClipIsAudio) return ClipType.Audio;
    if (playlistState.ClipIsClock) return ClipType.Clock;
    if (playlistState.ClipIsHighlight) return ClipType.Highlight;
    if (playlistState.ClipIsImage) return ClipType.Image;
    if (playlistState.ClipIsInput) return ClipType.Input;
    if (playlistState.ClipIsTube) return ClipType.Tube;
    if (playlistState.ClipIsVideo) return ClipType.Video;
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
  PlaydeckWSConnection,
};
