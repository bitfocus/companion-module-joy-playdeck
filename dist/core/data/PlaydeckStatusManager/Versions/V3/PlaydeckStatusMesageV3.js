"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockScheduleMethod = exports.ProductionMode = exports.BlockAutoplayAlert = void 0;
var BlockAutoplayAlert;
(function (BlockAutoplayAlert) {
    BlockAutoplayAlert[BlockAutoplayAlert["Alert0"] = 0] = "Alert0";
    BlockAutoplayAlert[BlockAutoplayAlert["Alert1"] = 1] = "Alert1";
    BlockAutoplayAlert[BlockAutoplayAlert["Alert2"] = 2] = "Alert2";
})(BlockAutoplayAlert || (exports.BlockAutoplayAlert = BlockAutoplayAlert = {}));
var ProductionMode;
(function (ProductionMode) {
    ProductionMode[ProductionMode["Off"] = 0] = "Off";
    ProductionMode[ProductionMode["On"] = 1] = "On";
})(ProductionMode || (exports.ProductionMode = ProductionMode = {}));
var BlockScheduleMethod;
(function (BlockScheduleMethod) {
    BlockScheduleMethod[BlockScheduleMethod["None"] = 0] = "None";
    /** Always Play, independent of Playlist status */
    BlockScheduleMethod[BlockScheduleMethod["AlwaysPlay"] = 1] = "AlwaysPlay";
    /** Play only, if first Clip is in CUE */
    BlockScheduleMethod[BlockScheduleMethod["PlayOnly"] = 2] = "PlayOnly";
    /** Don't play, only show countdown, if first Clip is in CUE */
    BlockScheduleMethod[BlockScheduleMethod["DontPlay"] = 3] = "DontPlay";
})(BlockScheduleMethod || (exports.BlockScheduleMethod = BlockScheduleMethod = {}));
//# sourceMappingURL=PlaydeckStatusMesageV3.js.map