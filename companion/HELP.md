Module for JOY Event & Media's Playdeck player. Now it support all versions up to 4.1b16.
You can choose appropriate version. The module automatically adjusts the set of commands in accordance with your chosen version.

**Available commands (for Playdeck 4.1b16) (version dependent):**

**CONTROL**: CUE/PLAY/FADE-IN by number/list/UID/flex, CUE/PLAY Next, SWITCH CHANNEL, PAUSE/STOP, POSITION, POSITION SAVE/RECALL, FADE EDIT

**ASSETS**: LOAD/APPEND/ Project

**AUDIO**: MUTE, Un-MUTE;

**OVERLAY**: PLAY/STOP/STOP ALL

**ACTIONS**: START/STOP/STOP ALL

**DESKTOP**: START/STOP;

**STREAM**: START, STOP;

**RECORDING**: START, STOP;

**UTILS**: WAIT
**Custom command** - sends a custom command (shold be formatted like `<{command}|{playlidID}|{blockID}|{clipID}>`)

**Available feedbacks (become active after some actions):**

- **Current state of channel** with options:

  - _Channel_: 1,2,3,4,5,6,7,8
  - _State_: _**STOP**_, _**PAUSE**_, _**PLAY**_, _**CUE**_
  - _Block Number/Name_: 0 for any
  - _Clip Number/Name_: 0 for any
  - _Item ID_

- **Current ready state** with options:
  - _Target_: **CHANNEL**, **OUTPUT**, **INPUT**, ,**DIRECTOR VIEW**, ,**RECORDING**
  - _Target Number_: number
  - _State_: _**NOT ACTIVE**_, _**STARTING**_, _**STARTED**_, _**ERROR**_
