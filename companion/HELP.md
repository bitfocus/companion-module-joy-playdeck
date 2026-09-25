Supports all versions up to **4.3b7**.
You can select the appropriate version, and the module will automatically adjust the set of commands according to your choice.

---

**🔧 Available Commands (for Playdeck 4.3b7; version dependent)**

- **CONTROL**:
  CUE/PLAY/FADE-IN by number/list/UID/flex; CUE/PLAY Next; SWITCH CHANNEL; PAUSE/STOP; POSITION; POSITION SAVE/RECALL; FADE EDIT; SELECT Previous/Next Clip; MARK Next Clip; ACTIVATE/DISABLE Clip; LOOP/UNLOOP Clip; POSITION MARKER, HOLD, RESUME, CUE/PLAY MARKER ID, 

- **ASSETS**:
  LOAD, APPEND Project, LOAD NEWEST PROJECT, RUN SCRIPT

- **AUDIO**:
  MUTE, UNMUTE

- **OVERLAY**:
  PLAY, STOP, STOP ALL; TOGGLE OVERLAY

- **ACTIONS**:
  START, STOP, STOP ALL

- **DESKTOP**:
  START, STOP

- **STREAM**:
  START, STOP

- **RECORDING**:
  START, STOP

- **UTILS**:
  WAIT, RESTART PLAYDECK

- **Custom command** — sends a custom command.
  Format:

  ```text
  <{command}|{playlistID}|{blockID}|{clipID}>
  ```

---

**📡 Available Feedbacks (activated after certain actions)**

**Current channel state**

- **Channel**: 1–8
- **State**: `STOP`, `PAUSE`, `PLAY`, `CUE`, `END`
- **Block Number/Name**: `0` = any
- **Clip Number/Name**: `0` = any
- **Item ID**

**Current ready state**

- **Target**: `CHANNEL`, `OUTPUT (DESKTOP)`, `INPUT`, `DIRECTOR VIEW`, `RECORDING`
- **Target Number**: numeric value
