"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckStatusFactory = void 0;
const PlaydeckStatusV3_js_1 = require("./Versions/V3/PlaydeckStatusV3.js");
const PlaydeckStatusV4_js_1 = require("./Versions/V4/PlaydeckStatusV4.js");
class PlaydeckStatusFactory {
    static create(version, json) {
        if (!version)
            return null;
        if (version.isLegacy()) {
            return new PlaydeckStatusV3_js_1.PlaydeckStatusV3(json);
        }
        return new PlaydeckStatusV4_js_1.PlaydeckStatusV4(json);
    }
}
exports.PlaydeckStatusFactory = PlaydeckStatusFactory;
//# sourceMappingURL=PlaydeckStatusFactory.js.map