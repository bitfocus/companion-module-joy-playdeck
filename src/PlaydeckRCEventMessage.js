const PlaydeckInstance = require('../index');
const { PlaydeckRCMessage } = require('./PlaydeckRCMessage');
const { PlaybackState } = require('./PlaydeckConstants');
class PlaydeckRCEventMessage extends PlaydeckRCMessage {
  /** @type { RCStateValues } */
  #stateValues;

  /**
   * @constructor
   * @param { PlaydeckInstance } instance
   * @param { string } message
   */
  constructor(instance, message) {
    super(instance, message);
    this.#handleEvent();
    try {
      // this.#handleEvent();
    } catch (e) {
      this.log('warn', `RC Event Message Error: ${e.message}`);
    }
  }
  /**
   *
   * @param { string } eventMessage
   * @returns { RCEvent | null }
   */
  //static
  static parseEvent(eventMessage) {
    const rcMessage = PlaydeckRCMessage.parseMessage(eventMessage);
    const sourceAction = rcMessage.message.split('-');
    /** @type { EventSource } */
    const evSource = sourceAction[0];
    /** @type { EventType } */
    const event = sourceAction[1];
    if (!event) return null;
    let rcEvent = {
      source: evSource,
      event: event,
      isGlobal: true,
    };
    if (rcMessage.arguments.length === 0) return rcEvent;
    rcEvent.isGlobal = false;
    rcEvent[EventSources.Playlist] = rcMessage.arguments[0];
    if (!rcMessage.arguments[1]) return rcEvent;
    rcEvent[evSource] = rcMessage.arguments[1];
    if (evSource !== EventSources.Clip) return rcEvent;
    rcEvent[EventSources.Block] = rcMessage.arguments[1];
    rcEvent[EventSources.Clip] = rcMessage.arguments[2];
    return rcEvent;
  }
  /**
   *
   * @returns { RCStateValues }
   */
  #handleEvent() {
    this.log('debug', `New RC Event message: ${this._message}`);
    if (!PlaydeckRCMessage.isCorrect(this._message)) throw new Error(`Not RC Message`);
    if (!this._instance) throw new Error(`Instance ERROR`);
    const rcEvent = PlaydeckRCEventMessage.parseEvent(this._message);
    if (!rcEvent) throw new Error(`Parse RC Event ERROR`);
    const sides = {
      1: 'left',
      2: 'right',
    };
    this.#stateValues = {
      general: {},
      playlist: {
        left: {},
        right: {},
      },
    };
    /** @type { 'left' | 'right'} */
    const side = rcEvent.playlist ? sides[rcEvent.playlist] : null;
    switch (rcEvent.source) {
      case EventSources.Playlist:
        if (!side) break;
        this.#stateValues.playlist[side].state = rcEvent.event;
        break;
      case EventSources.Clip:
        if (!side) break;
        this.#stateValues.playlist[side].blockID = rcEvent.block;
        this.#stateValues.playlist[side].clipID = rcEvent.clip;
        if (rcEvent.event == Events.Cue) {
          this.#stateValues.playlist[side].state = rcEvent.event;
        }
        break;
      case EventSources.Block:
        break;
      case EventSources.Overlay:
        break;
      case EventSources.Action:
        break;
      case EventSources.Recording:
        switch (rcEvent.event) {
          case Events.Start:
            this.#stateValues.general.isRecording = true;
            break;
          case Events.End:
            this.#stateValues.general.isRecording = false;
            break;
        }
        break;
    }
    this._instance.state.updateValues(this.#stateValues);
  }
}

/**
 * @enum { EventType }
 */
const Events = {
  Play: 'play',
  Stop: 'stop',
  Pause: 'pause',
  Unpause: 'unpause',
  Cue: 'cue',
  Start: 'start',
  End: 'end',
};

/**
 * @enum { EventSource }
 */
const EventSources = {
  Playlist: 'playlist',
  Clip: 'clip',
  Block: 'block',
  Overlay: 'overlay',
  Action: 'action',
  Recording: 'recording',
};

/**
 * @typedef { Object } RCEvent
 * @property { EventSources } source
 * @property { EventType } event
 * @property { boolean } isGlobal
 * @property { number } playlist
 * @property { number= } clip
 * @property { number= } block
 * @property { number= } overlay
 * @property { number= } action
 */

/**
 * @typedef { Object } RCStateValues
 * @property { { isRecording: boolean } } general
 * @property {{ left: RCPlaylistValues, right: RCPlaylistValues} } playlist
 */

/**
 * @typedef { Object } RCPlaylistValues
 * @property { number } clipID
 * @property { number } blockID
 * @property { PlaybackState } state
 */

/**
 * @typedef {{ message: string | null, arguments: number[] | null }} RCEventMessage
 * */
/**
 * @typedef { 'playlist' | 'clip' | 'block' | 'overlay' | 'action' | 'recording' } EventSource
 */
/**
 * @typedef { 'play' | 'stop' | 'pause' | 'unpause' | 'cue' | 'start' | 'end' } EventType
 */
module.exports = {
  PlaydeckRCEventMessage,
};
