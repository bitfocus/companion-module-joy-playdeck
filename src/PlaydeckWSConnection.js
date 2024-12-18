const EventEmitter = require('events');
const { InstanceStatus, TCPHelper, InstanceBase, LogLevel } = require('@companion-module/base');
const WebSocket = require('ws');
const { isBigInt64Array } = require('util/types');
const { PlaydeckConnection } = require('./PlaydeckConnection');
const { PlaydeckStateParameter } = require('./PlaydeckTypes');
const PlaydeckInstance = require('../index');
const { PlaybackState, ClipType, ConnectionType, ConnectionDirection } = require('./PlaydeckConstants');
const { PlaydeckRCEventMessage } = require(`./PlaydeckRCEventMessage`);

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
    this.log(`info`, `Starting connection. IP/HOST: ${this._host}. PORT: ${this._port}`);
    this._init();
  }
  _init() {
    this.updateStatus(InstanceStatus.Connecting);
    this.#webSocket = new WebSocket(`ws://${this._host}:${this._port}`);
    this.#webSocket.on('open', () => {
      this.log(`info`, `Connected.`);
      this.updateStatus(InstanceStatus.Ok);
      this._lastErrorMessage = null;
    });
    this.#webSocket.on('message', (rawData, isBinary) => {
      if (!isBinary) {
        this.#dataHandler(rawData.toString());
      }
    });
    this.#webSocket.on('error', (err) => {
      this.log('error', `Error: ${err.message}`);
      this._lastErrorMessage = err.message;
      this.updateStatus(InstanceStatus.ConnectionFailure, this._lastErrorMessage);
    });
    this.#webSocket.on('close', (code, reason) => {
      this.log('debug', `Closed with code: ${code}, with reason: ${reason.toString()}`);
      this._reconnect();
    });
  }
  /**
   *
   * @param {string} data
   */
  #dataHandler(data) {
    if (data.indexOf(`|`) == -1) {
      this.log(`debug`, `Recieved non properly formatted message: ${data}`);
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
        this.log(`debug`, `Recieved permanent: ${sData}`); // don't know what it means it returns {"AnyVariableName":"1"}
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
      general: this.#stateValues.general,
      playlist: {
        left: this.#stateValues.playlist.left,
        right: this.#stateValues.playlist.right,
      },
    });
  }

  /**
   * @param { string } command
   * @override
   */
  send(command) {
    this.#webSocket.send(command);
  }
  /**
   * @override
   */
  destroy() {
    this.#webSocket.close(1000);
    this.log(`debug`, `Destroyed.`);
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
    const generalState = this.sMessage.General;
    this.general = {
      playlistFile: generalState.PlaylistFile,
      activeChannels: generalState.ActiveChannels,
      productionMode: generalState.ProductionMode,
      isRecording: generalState.IsRecording,
      recordingDuration: this.convertFloat(generalState.RecordingDuration),
      recordingTimeStart: this.convertTimestamp(generalState.RecordingTimeStart),
    };
    this.playlist = {
      left: this.convertPlaylistStatusMessage(0),
      right: this.convertPlaylistStatusMessage(1),
    };
  }

  convertPlaylistStatusMessage(plstNum) {
    const playlistState = this.sMessage.Playlist[plstNum];
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
      clipPosition: this.convertFloat(playlistState.ClipPosition),
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
    if (playlistState.StatusPlaying && !playlistState.StatusPaused) return PlaybackState.Play;
    if (playlistState.StatusPaused && !playlistState.StatusCued) return PlaybackState.Pause;
    if (playlistState.StatusCued) return PlaybackState.Cue;
    if (!playlistState.StatusPlaying && !playlistState.StatusPaused) return PlaybackState.Stop;
    return null;
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
 * @property { StatusMessageGeneral } General - Contains of general status for both playlists
 * @property { StatusMessagePlaylist[] } Playlist - Indicates status of each playlist
 */

/**
 *
 * @typedef { Object } StatusMessageGeneral
 * @property { string } PlaylistFile - Current playlist file (empty if blanc)
 * @property { number } ActiveChannels - Number of active channels
 * @property { boolyNum } ProductionMode - 0 is `false`, 1 is `true`
 * @property { string } DateTimeLocale - BCP 47 Language Tag for time locale
 * @property { boolean } IsRecording - Status of recording
 * @property { number } RecordingDuration - Duration of recording
 * @property { number } RecordingTimeStart - Time when recording started (UNIX Timestamp)
 */

/**
 *
 * @typedef { Object } StatusMessagePlaylist
 * @property { number } BlockCount - Amount of blocks in playlist
 * @property { string } ChannelName - Name of channel
 * @property { StatusNum } TallyStatus - Tally of playlist: `0` is `disabled`, `1` is `preview`, `2` is program
 * @property { string } PreviewNote -
 * @property { number } StageWidth - Output Width
 * @property { number } StageHeight - Output Height
 * @property { boolean } StatusPlaying - Is playlist in PLAY
 * @property { boolean } StatusPaused - Is playlist in PAUSE
 * @property { boolean } StatusCued - Is playlist in CUE
 * @property { boolean } BlockScheduleActive -
 * @property { number } BlockScheduleMethod - `0`; `1` - Always Play, independent of Playlist status; `2` - Play only, if first Clip is in CUE; `3`- Don't play, only show countdown, if first Clip is in CUE,
 * @property { number } BlockScheduleRemaining -
 * @property { boolean } BlockScheduleAlert -
 * @property { boolean } BlockScheduleOvertime -
 * @property { boolean } BlockAutoplayActive -
 * @property { number } BlockAutoplayRemaining -
 * @property { StatusNum } BlockAutoplayAlert -
 * @property { string } ClipName - Name of current clip
 * @property { number } ClipDuration - Duration of current clip
 * @property { number } ClipProgress - Progress in percents of current clip
 * @property { number } ClipRemaining -
 * @property { boolean } ClipRemainingAlert -
 * @property { number } ClipTimeStart - (UNIX Timestamp)
 * @property { number } ClipTimeEnd - (UNIX Timestamp)
 * @property { boolean } ClipIsClock -
 * @property { string } BlockName - Name of current block
 * @property { number } BlockDuration -
 * @property { number } BlockProgress -
 * @property { number } BlockPosition -
 * @property { number } BlockRemaining -
 * @property { boolean } BlockRemainingAlert -
 * @property { number } BlockTimeStart - (UNIX Timestamp)
 * @property { number } BlockTimeEnd - (UNIX Timestamp)
 * @property { boolean } BlockIsClock -
 * @property { boolean } ClipIsVideo -
 * @property { boolean } ClipIsImage -
 * @property { boolean } ClipIsAudio -
 * @property { boolean } ClipIsInput -
 * @property { boolean } ClipIsTube -
 * @property { boolean } ClipIsHighlight -
 * @property { boolean } ClipIsAction -
 * @property { number } ClipID -
 * @property { number } BlockID -
 * @property { string } ClipFile -
 * @property { number } ClipWidth -
 * @property { number } ClipHeight -
 */

/**
 * @typedef { 0 | 1 | 2 } StatusNum  // 0 - normal, 1 - yellow/preview, 2 - red/program
 */

module.exports = {
  PlaydeckWSConnection,
};
