"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatusV3 = void 0;
const PlaydeckStatusInterface_js_1 = require("../PlaydeckStatusInterface.js");
class PlaydeckStatusV3 extends PlaydeckStatusInterface_js_1.PlaydeckStatusInterface {
    #common;
    #channel;
    #json;
    #rawData = null;
    constructor(json) {
        super();
        this.#json = json;
        this.#common = {
            a: 12,
        };
        this.#channel = [{ b: 53 }],
        ;
    }
    getValues() {
        if (this.#rawData === null)
            return null;
        return {
            common: this.#common,
            channel: this.#channel,
        };
    }
}
exports.PlaydeckStatusV3 = PlaydeckStatusV3;
var BlockAutoplayAlert;
(function (BlockAutoplayAlert) {
    BlockAutoplayAlert[BlockAutoplayAlert["Alert0"] = 0] = "Alert0";
    BlockAutoplayAlert[BlockAutoplayAlert["Alert1"] = 1] = "Alert1";
    BlockAutoplayAlert[BlockAutoplayAlert["Alert2"] = 2] = "Alert2";
})(BlockAutoplayAlert || (BlockAutoplayAlert = {}));
var ProductionMode;
(function (ProductionMode) {
    ProductionMode[ProductionMode["Off"] = 0] = "Off";
    ProductionMode[ProductionMode["On"] = 1] = "On";
})(ProductionMode || (ProductionMode = {}));
var Tally;
(function (Tally) {
    Tally[Tally["None"] = 0] = "None";
    Tally[Tally["Preview"] = 1] = "Preview";
    Tally[Tally["Program"] = 2] = "Program";
})(Tally || (Tally = {}));
var BlockScheduleMethod;
(function (BlockScheduleMethod) {
    BlockScheduleMethod[BlockScheduleMethod["None"] = 0] = "None";
    /** Always Play, independent of Playlist status */
    BlockScheduleMethod[BlockScheduleMethod["AlwaysPlay"] = 1] = "AlwaysPlay";
    /** Play only, if first Clip is in CUE */
    BlockScheduleMethod[BlockScheduleMethod["PlayOnly"] = 2] = "PlayOnly";
    /** Don't play, only show countdown, if first Clip is in CUE */
    BlockScheduleMethod[BlockScheduleMethod["DontPlay"] = 3] = "DontPlay";
})(BlockScheduleMethod || (BlockScheduleMethod = {}));
//# sourceMappingURL=PlaydeckStatusV3.js.map