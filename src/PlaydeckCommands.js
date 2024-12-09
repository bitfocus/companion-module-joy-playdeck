const { PlaydeckCommand } = require('./PlaydeckTypes');

class PlaydeckCommands {
  constructor(version) {
    /**
     * @private
     */
    this.version = version;
  }

  getCommadDescription(command) {}
}

/**
 * @type { PlaydeckCommand[] }
 */
const commands = [
  {
    version: null,
    commandName: `CUE`,
    command: `cue`,
    description: `CUE a the Clip in the Playlist. If you dont provide Clip, the first Clip of the Block will be CUE'd. If you dont provide Block/Clip, the current selected Clip will be CUE'd.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: null,
    commandName: `CUE AND PLAY`,
    command: `cueandplay`,
    description: `CUE and PLAY a the Clip in the Playlist. If you dont provide Clip, the first Clip of the Block will be CUE'd. If you dont provide Block/Clip, the current selected Clip will be CUE'd.`,
    arg1: 'PLAYLIST',
    arg2: 'BLOCK',
    arg3: 'CLIP',
  },
  {
    version: null,
    commandName: `CUE NEXT`,
    command: `cuenext`,
    description: `CUE the next Clip. Can be manual set with MARK NEXT. If Block end is reached, it will either select the next Block or loop.`,
    arg1: 'PLAYLIST',
  },
  {
    version: null,
    commandName: `CUE`,
    command: `cueandplaynext`,
    description: `PLAY the next Clip. Can be manual set with MARK NEXT. If Block end is reached, it will either select the next Block or loop.`,
    arg1: 'PLAYLIST',
  },
];
