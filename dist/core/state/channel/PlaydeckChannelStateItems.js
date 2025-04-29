"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckChannelStateItems = void 0;
class PlaydeckChannelStateItems {
    #channel;
    constructor(channel) {
        this.#channel = channel;
    }
    getItems() {
        return [
            {
                value: null,
                version: null,
                deprecated: null,
                stateField: '',
                variableDefinition: {
                    variableId: '',
                    name: '',
                },
            },
        ];
    }
}
exports.PlaydeckChannelStateItems = PlaydeckChannelStateItems;
//# sourceMappingURL=PlaydeckChannelStateItems.js.map