const { PlaydeckRCMessage } = require('./PlaydeckRCMessages/PlaydeckRCMessage');
const { Regex, LogLevel, CompanionActionDefinitions, SomeCompanionActionInputField } = require('@companion-module/base');
const { PlaydeckVersion } = require('./PlaydeckVersion');
/**
 * @typedef { ('PLAYLIST' | 'BLOCK' | 'CLIP' | 'PATTERN' | 'OVERLAY' | 'ACTION' | 'FILENAME' | 'RESET' | 'TARGET' | 'AUTOPLAY' | 'METHOD' | 'COMMAND') } argName
 */

class PlaydeckCommand {
  /** @type { string } */
  version;
  /** @type { string } */
  deprecated;
  /** @type { string } */
  commandName;
  /** @type { string } */
  command;
  /** @type { string } */
  description;
  /** @type { argName=  } */
  arg1;
  /** @type { argName= } */
  arg2;
  /** @type { argName= } */
  arg3;
}

class PlaydeckCommands extends Array {
  /** @param {PlaydeckVersion} version  */
  constructor(version) {
    let actualCommands = commands;
    if (version) {
      actualCommands = actualCommands.filter((/** @type {PlaydeckCommand} */ command) => {
        return version.isNewerOrSameThan(command.version) && (command.deprecated === null || version.isOlderThan(command.deprecated));
      });
    }
    super(...actualCommands);
  }

  /**
   * @param { string } arg
   * @param { number } index
   * @returns { SomeCompanionActionInputField }
   */

  static #getField(arg, index) {
    /** @type { SomeCompanionActionInputField } */
    const dropdownAutoplay = {
      type: 'dropdown',
      id: `arg${index}`,
      label: 'AUTOPLAY:',
      default: '0',
      choices: [
        { id: '0', label: 'Nothing happens after loading' },
        { id: '1', label: 'Starts with clip 1' },
        { id: '2', label: 'Restarts on last known position' },
      ],
    };

    /** @type { SomeCompanionActionInputField } */
    const dropdownReset = {
      type: 'dropdown',
      id: `arg${index}`,
      label: 'RESET clip properties:',
      default: '1',
      choices: [
        { id: '0', label: `DON'T RESET` },
        { id: '1', label: 'RESET' },
      ],
    };
    /** @type { SomeCompanionActionInputField } */
    const dropdownMethod = {
      type: 'dropdown',
      id: `arg${index}`,
      label: 'METHOD:',
      default: '1',
      choices: [
        { id: '1', label: 'Crossfade to the Next Clip in the Playlist' },
        { id: '2', label: 'Crossfade to your current Playlist Selection' },
      ],
    };

    const dropdownPlaylists = {
      type: 'dropdown',
      id: `arg${index}`,
      label: 'PLAYLIST:',
      default: '1',
      choices: [
        { id: '1', label: 'Left Playlist' },
        { id: '2', label: 'Right Playlist' },
      ],
    };
    /** @type { SomeCompanionActionInputField } */
    const itemNumberField = {
      type: 'number',
      id: `arg${index}`,
      label: `${arg} ID:`,
      min: 1,
      max: 30,
      default: 1,
      required: true,
      range: false,
      regex: Regex.NUMBER,
    };
    /** @type { SomeCompanionActionInputField } */
    const textInputField = (regex, tooltip) => {
      return {
        type: 'textinput',
        id: `arg${index}`,
        label: `${arg}:`,
        required: true,
        regex: regex,
        useVariables: true,
        tooltip: tooltip,
      };
    };
    if (arg === 'PLAYLIST') {
      return dropdownPlaylists;
    }
    if (arg.includes('CLIP') || arg.includes('ACTION') || arg.includes('BLOCK')) {
      return itemNumberField;
    }
    if (arg === 'COMMAND') {
      return textInputField(`${PlaydeckRCMessage.REGEX_WITH_VARS}`, `Write custom command like <{command}|{playlist_id}|?{block_id}|?{clip_id}`);
    }
    if (['FILENAME', 'TARGET', 'OVERLAY'].indexOf(arg) > -1) {
      return textInputField(`${Regex.SOMETHING}`, `Here might be any string value...`);
    }
    if (arg === 'METHOD') {
      return dropdownMethod;
    }
    if (arg === 'AUTOPLAY') {
      return dropdownAutoplay;
    }
    if (arg === 'RESET') {
      return dropdownReset;
    }
    if (arg.includes('PATTERN')) {
      return textInputField(
        `${Regex.SOMETHING}`,
        `PATTERN is a flexible naming construction.\n- b#5 (Block 5)\n- b:myname (First Blockname containing "myname")\n- c#5 OR c:myname (Same for Clips)\n- p:HH:MM:SS:FF (Clip Position as Timestamp)\n- b#5 c:myname p:0:05:31:00 (Clip "*myname*" in Block 5 at Clip Pos 0:05:31:00)\nTip 1: Use "c:name1 c:name2 c:name3" for multisearch aka "Use name1 if exist, else ..."\nTip 2: Use negative Clip Position to jump to Clip Duration minus Position eg "p:-30:00"`
      );
    }
  }
  /**
   * @param { PlaydeckCommand } command
   * @returns { Array }
   */
  static getOptions(command) {
    const args = [command.arg1, command.arg2, command.arg3];
    let options = [];

    for (let i = 0; i < args.length; i++) {
      if (args[i]) {
        options.push(PlaydeckCommands.#getField(args[i], i + 1));
      }
    }
    return options;
  }
  /**
   *
   * @param { string } message
   * @param { number[] } args
   * @returns { string }
   */
  static getRCCommand(command, args) {
    if (command === `customcommand`) return args[0];
    return PlaydeckRCMessage.makeMessage(command, args);
  }
}

/**
 * @type { PlaydeckCommand[] }
 */

const commands = [
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - Custom Command`,
    command: `customcommand`,
    description: `Send custom command...`,
    arg1: `COMMAND`,
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - CUE`,
    command: `cue`,
    description: `CUE the Clip in the Playlist. If you dont provide Clip, the first Clip of the Block will be CUE'd. If you dont provide Block/Clip, the current selected Clip will be CUE'd.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - CUE and PLAY`,
    command: `cueandplay`,
    description: `CUE and PLAY a the Clip in the Playlist. If you dont provide Clip, the first Clip of the Block will be CUE'd. If you dont provide Block/Clip, the current selected Clip will be CUE'd.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: '3.7b4',
    deprecated: null,
    commandName: `CONTROL - CUE NEXT`,
    command: `cuenext`,
    description: `CUE the next Clip. Can be manual set with MARK NEXT. If Block end is reached, it will either select the next Block or loop.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.7b4',
    deprecated: null,
    commandName: `CONTROL - CUE NEXT and PLAY`,
    command: `cueandplaynext`,
    description: `PLAY the next Clip. Can be manual set with MARK NEXT. If Block end is reached, it will either select the next Block or loop.`,
    arg1: 'PLAYLIST',
  },

  {
    version: '3.6b6',
    deprecated: null,
    commandName: `CONTROL - CUE NEXT BLOCK`,
    command: `cuenextblock`,
    description: `CUE the first Clip of the next Block in the Playlist. If called from the last Block, the first Block of the Playlist will be used.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.6b6',
    deprecated: null,
    commandName: `CONTROL - CUE NEXT BLOCK and PLAY`,
    command: `cueandplaynextblock`,
    description: `PLAY the first Clip of the next Block in the Playlist. If called from the last Block, the first Block of the Playlist will be used.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.6b18',
    deprecated: null,
    commandName: `CONTROL - CUE FLEX`,
    command: `cueflex`,
    description: `CUE a Block/Clip in the Playlist.`,
    arg1: 'PLAYLIST',
    arg2: 'PATTERN',
  },

  {
    version: '3.6b18',
    deprecated: null,
    commandName: `CONTROL - CUE FLEX and PLAY`,
    command: `cueandplayflex`,
    description: `PLAY a Block/Clip in the Playlist.`,
    arg1: 'PLAYLIST',
    arg2: 'PATTERN',
  },
  {
    version: '3.6b18',
    deprecated: null,
    commandName: `CONTROL - CUE and PLAY (Sync)`,
    command: `cueandplaysync`,
    description: `SYNC CUEPLAY two Blocks in both Playlists. Uses SYNC Caching if enabled.`,
    arg1: 'PL1 BLOCK',
    arg2: 'PL2 BLOCK',
  },

  {
    version: '3.6b18',
    deprecated: null,
    commandName: `CONTROL - CUE FLEX and PLAY (Sync)`,
    command: `cueandplaysyncflex`,
    description: `SYNC CUEPLAY two Blocks in both Playlists. Uses SYNC Caching if enabled.`,
    arg1: 'PL1 PATTERN',
    arg2: 'PL2 PATTERN',
  },

  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - PLAY`,
    command: `play`,
    description: `Start playback of CUE'd or paused Clip. Does nothing, if any Clip is already playing. If no Clip is playing, will start the selected Clip. If SYNC is enabled, will start both Playlists.`,
    arg1: 'PLAYLIST',
  },

  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - STOP`,
    command: `stop`,
    description: `Stop the playback of the Playlist. If SYNC is enabled, will stop both Playlists.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - PAUSE`,
    command: `pause`,
    description: `Pause the playback of the Playlist. Does nothing, if any Clip is already paused. If SYNC is enabled, will pause both Playlists.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.2b2',
    deprecated: '3.7b4',
    commandName: `CONTROL - JUMP`,
    command: `jump`,
    description: `JUMP to the end of the Clip in the Playlist with a certain amount of SECONDS left (set in Playdeck).`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.7b4',
    deprecated: null,
    commandName: `CONTROL - JUMP to start`,
    command: `jumpstart`,
    description: `Jump the playhead to the start of the current Clip. Timing can be changed in the Settings.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.7b4',
    deprecated: null,
    commandName: `CONTROL - JUMP to end`,
    command: `jumpend`,
    description: `Jump the playhead to the end of the current Clip. Timing can be changed in the Settings.`,
    arg1: 'PLAYLIST',
  },

  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - PLAY previous`,
    command: `previousclip`,
    description: `Play the previous Clip in the Playlist, even if its in the previous Block. If the playback is paused, the previous Clip will be CUE'd.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.2b2',
    deprecated: '3.7b4',
    commandName: `CONTROL - NEXT CLIP`,
    command: `nextclip`,
    description: `The Playback jumps to the NEXT available Clip in the Playlist and also skips Block Separators (e.g. Pause, Stop). The Playback Status of PLAY/PAUSE will stay the same.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - FADE IN`,
    command: `fadein`,
    description: `Fade in the selected Clip from Background. Does nothing, if any Clip is playing.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - FADE OUT`,
    command: `fadeout`,
    description: `Fade out the playing Clip into Background.`,
    arg1: 'PLAYLIST',
  },

  {
    version: '3.8b8',
    deprecated: null,
    commandName: `CONTROL - CROSSFADE`,
    command: `crossfade`,
    description: `Crossfade to another Clip.`,
    arg1: 'PLAYLIST',
    arg2: 'METHOD',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `CONTROL - RESTART`,
    command: `restartclip`,
    description: `Restart the playback of the current playing Clip. If the playback is paused, the current Clip will be CUE'd.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `OVERLAY - PLAY`,
    command: `playoverlay`,
    description: `Show an Overlay. You can define multiple overlays at once e.g. "<playoverlay|1|3+7+12>"`,
    arg1: 'PLAYLIST',
    arg2: 'OVERLAY',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `OVERLAY - STOP`,
    command: `stopoverlay`,
    description: `Hide an Overlay. You can define multiple overlays at once e.g. "<playoverlay|1|3+7+12>"`,
    arg1: 'PLAYLIST',
    arg2: 'OVERLAY',
  },
  {
    version: `3.5b12`,
    deprecated: null,
    commandName: `OVERLAY - TOGGLE`,
    command: `toggleoverlay`,
    description: `Toggle an Overlay. You can define multiple overlays at once e.g. "<playoverlay|1|3+7+12>"`,
    arg1: 'PLAYLIST',
    arg2: 'OVERLAY',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `OVERLAY - STOP ALL`,
    command: `stopalloverlays`,
    description: `Hide all Overlays, which are currently active.`,
    arg1: 'PLAYLIST',
  },

  {
    version: '3.2b2',
    deprecated: null,
    commandName: `ACTION - PLAY`,
    command: `playaction`,
    description: `Play an Action.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.7b4',
    deprecated: null,
    commandName: `ACTION - PLAY (Sync)`,
    command: `playactionsync`,
    description: `SYNC Play Action in both Playlists.`,
    arg1: 'PL1 ACTION',
    arg2: 'PL2 ACTION',
  },
  {
    version: '3.6b6',
    deprecated: null,
    commandName: `EDITING - LOAD Playlist`,
    command: `loadplaylist`,
    description: `Loads a new Playlist of Type XML. Interrupts all current operations.`,
    arg1: 'AUTOPLAY',
    arg2: 'FILENAME',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `EDITING - SELECT block`,
    command: `selectblock`,
    description: `SELECT a certain BLOCK (all Clips) in the Playlist. The enumeration corresponds to the Block Numbers in Playlist.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `EDITING - SELECT clip`,
    command: `selectclip`,
    description: `Select a Clip in the Playlist. Will always deselect all other Clips. If you dont provide Clip, all Clips in the Block will be selected. If you dont provide Block/Clip, all Clips in the Playlist will be selected.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: '3.8b4',
    deprecated: null,
    commandName: `EDITING - DESELECT`,
    command: `deselect`,
    description: `Deselect all selected Clips in the Playlist.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.6b6',
    deprecated: null,
    commandName: `EDITING - INSERT clip`,
    command: `insertclip`,
    description: `Inserts the Clip at the current selected position. The Filename can also be a YouTube URL. If all Clips of a Block are selected, the Clip will appended at the start of the Block. If nothing is selected in the Playlist, a new Block will be inserted at the end.`,
    arg1: 'PLAYLIST',
    arg2: 'FILENAME',
  },
  {
    version: '3.6b6',
    deprecated: null,
    commandName: `EDITING - APPEND clip`,
    command: `appendclip`,
    description: `Inserts the Clip after the selected position and select the new Clip. The Filename can also be a YouTube URL. If all Clips of a Block are selected, the Clip will appended at the end of the Block. If nothing is selected in the Playlist, a new Block will be inserted at the end.`,
    arg1: 'PLAYLIST',
    arg2: 'FILENAME',
  },
  {
    version: '3.6b6',
    deprecated: null,
    commandName: `EDITING - CHANGE clip`,
    command: `changeclip`,
    description: `Change the Clip at the current selected position. The Filename can also be a YouTube URL. If nothing is selected in the Playlist, the command will be ignored.`,
    arg1: 'PLAYLIST',
    arg2: 'FILENAME',
    arg3: 'RESET',
  },
  {
    version: '3.2b2',
    deprecated: '3.5b12',
    commandName: `EDITING - ACTIVATE block`,
    command: `activateblock`,
    description: `ACTIVATE a certain Block (all Clips) in the Playlist. The enumeration corresponds to the Block Numbers in Playlist. Parameters: Playlist, Block.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
  },

  {
    version: '3.2b2',
    deprecated: '3.5b12',
    commandName: `EDITING - ACTIVATE clip`,
    command: `activateclip`,
    description: `ACTIVATE a certain Clip in the Playlist. The enumeration corresponds to the Block and Clip Numbers in Playlist.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: '3.2b2',
    deprecated: '3.5b12',
    commandName: `EDITING - De-ACTIVATE clip`,
    command: `deactivateclip`,
    description: `ACTIVATE a certain Clip in the Playlist. The enumeration corresponds to the Block and Clip Numbers in Playlist.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: '3.5b12',
    deprecated: null,
    commandName: `EDITING - ACTIVATE clip/block`,
    command: `activate`,
    description: `Activate a Clip in the Playlist (Green Checkmark). If you dont provide Clip, all Clips in the Block will be (de-)activated. If you dont provide Block/Clip, all Clips in the Playlist will be (de-)activated.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: '3.5b12',
    deprecated: null,
    commandName: `EDITING - De-ACTIVATE clip/block`,
    command: `deactivate`,
    description: `De-Activate a Clip in the Playlist (Green Checkmark). If you dont provide Clip, all Clips in the Block will be (de-)activated. If you dont provide Block/Clip, all Clips in the Playlist will be (de-)activated.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `EDITING - ACTIVATE all clips`,
    command: `activateall`,
    description: `ACTIVATE all Clips in the Playlist.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.8b4',
    deprecated: null,
    commandName: `EDITING - DELETE clip`,
    command: `deleteclip`,
    description: `Delete all current selected Clips. If nothing is selected in the Playlist, the command will be ignored. Tip: Use <selectclip|PLAYLIST|BLOCK> before to empty any Block without deleting it.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.8b4',
    deprecated: null,
    commandName: `EDITING - DELETE block`,
    command: `deleteblock`,
    description: `Delete the Block of the current selected Clip. If nothing is selected in the Playlist, the command will be ignored. If Clips are selected in multiple Blocks (e.g. manually with CTRL), all selected Blocks will be deleted.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `AUDIO - MUTE`,
    command: `muteaudio`,
    description: `Mute the Audio output of the Playlist. This will also affect Output Devices/Streams.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `AUDIO - MUTE`,
    command: `unmuteaudio`,
    description: `Unmute the Audio output of the Playlist. This will also affect Output Devices/Streams.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.5b12',
    deprecated: null,
    commandName: `AUDIO - TOGGLE`,
    command: `toggleaudio`,
    description: `Toggle the Audio output of the Playlist. This will also affect Output Devices/Streams.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.5.b3',
    deprecated: null,
    commandName: `NOTES - HIDE`,
    command: `hidenotes`,
    description: `Hides any visible Note of Preview/Production of both Playlists.`,
  },
  {
    version: '3.7b4',
    deprecated: null,
    commandName: `SCRIPTS - RESTART`,
    command: `restartscripts`,
    description: `Restarts all current active scripts, whether they are Global or Playlist related.`,
  },
  {
    version: '3.7b11',
    deprecated: null,
    commandName: `DESKTOP - TOGGLE`,
    command: `toggledesktop`,
    description: `Shows/Hide the Desktop Output.`,
    arg1: 'PLAYLIST',
  },
  {
    version: '3.7b4',
    deprecated: null,
    commandName: `STREAM - START`,
    command: `startstream`,
    description: `Starts the stream. Will do nothing, if Stream Settings are not provided yet.`,
    arg1: 'TARGET',
  },
  {
    version: '3.7b4',
    deprecated: null,
    commandName: `STREAM - STOP`,
    command: `stopstream`,
    description: `Stops the stream. Will do nothing, if Stream Settings are not provided yet.`,
    arg1: 'TARGET',
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `RECORDING - START`,
    command: `startrec`,
    description: `START a new recording. If a recording is already running, the command will be ignored.`,
  },
  {
    version: '3.2b2',
    deprecated: null,
    commandName: `RECORDING - STOP`,
    command: `stoprec`,
    description: `STOP the current recording.`,
  },
];

module.exports = { PlaydeckCommands, PlaydeckCommand };
