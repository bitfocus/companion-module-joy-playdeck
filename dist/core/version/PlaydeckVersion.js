"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCompare = exports.PlaydeckVersion = void 0;
const PlaydeckConnection_js_1 = require("../connections/PlaydeckConnection.js");
class PlaydeckVersion {
    #version;
    static holyBooly = false;
    static #FIRST_TCP_EVENTS = `3.5b3`;
    static #FIRST_WS_CONNECTION = `3.6b18`;
    static configVersions = [
        { id: '4.1b3', label: '4.1b3' },
        { id: '3.8b13', label: '3.8b13' },
        { id: '3.8b8', label: '3.8b8' },
        { id: '3.8b4', label: '3.8b4' },
        { id: '3.7b11', label: '3.7b11' },
        { id: '3.7b4', label: '3.7b4' },
        { id: '3.6b18', label: '3.6b18' },
        { id: '3.5b12', label: '3.5b12' },
        { id: '3.5b3', label: '3.5b3' },
        { id: '3.4b8', label: '3.4b8' },
        { id: '3.2b12', label: '3.2b12' },
        { id: '3.2b11', label: '3.2b11' },
        { id: '3.2b8', label: '3.2b8' },
        { id: '3.2b2', label: '3.2b2' },
    ];
    static noEvents = ['3.4b8', '3.2b12', '3.2b11', '3.2b8', '3.2b2'];
    static noWS = this.noEvents.concat(['3.5b12', '3.5b3']);
    static #isVersion(version) {
        if (!version)
            return false;
        const bSplitted = version.split('b');
        if (bSplitted === undefined)
            return false;
        if (!Number.isInteger(Number(bSplitted[1])))
            return false;
        const vSplitted = bSplitted[0].split('.');
        if (vSplitted === undefined)
            return false;
        if (!(Number.isInteger(Number(vSplitted[0])) && Number.isInteger(Number(vSplitted[0]))))
            return false;
        return true;
    }
    /**
     * Parses string of version into array like [major, minor, build]
     * @param version - string of version like `3.1b12`
     * @returns array representation of version
     */
    static #parseVersion(version) {
        const bSplit = version.split('b');
        const vSplit = bSplit[0].split('.');
        const major = Number(vSplit[0]);
        const minor = Number(vSplit[1]);
        const build = Number(bSplit[1]);
        return [major, minor, build];
    }
    /**
     * Indicates is there a `connection` in this `version`
     */
    static hasConnection(version, connection, direction) {
        if (connection === PlaydeckConnection_js_1.ConnectionType.TCP && direction === PlaydeckConnection_js_1.ConnectionDirection.Outgoing)
            return true;
        if (connection === PlaydeckConnection_js_1.ConnectionType.WS && this.isGreaterOrEqual(version, this.#FIRST_WS_CONNECTION))
            return true;
        if (connection === PlaydeckConnection_js_1.ConnectionType.TCP &&
            direction === PlaydeckConnection_js_1.ConnectionDirection.Incoming &&
            this.isGreaterOrEqual(version, this.#FIRST_TCP_EVENTS))
            return true;
        return false;
    }
    /**
     * Compares two versions and returns
     * - `0` if version are equal
     * - `1` if first version is greater (newer)
     * - `-1` if first version is lower (older)
     * - `null` if one of arguments is a proper version
     */
    static compareTwoVersions(version1, version2) {
        if (!this.#isVersion(version1) || !this.#isVersion(version2))
            return VersionCompare.Error;
        const parsed1 = this.#parseVersion(version1);
        const parsed2 = this.#parseVersion(version2);
        for (let i = 0; i < parsed1.length; i++) {
            if (parsed1[i] === parsed2[i])
                continue;
            return parsed1[i] > parsed2[i] ? VersionCompare.Greater : VersionCompare.Lower;
        }
        return VersionCompare.Equal;
    }
    static isGreaterOrEqual(version1, version2) {
        switch (this.compareTwoVersions(version1, version2)) {
            case VersionCompare.Greater:
                return true;
            case VersionCompare.Equal:
                return true;
            case VersionCompare.Error:
                return null;
        }
        return false;
    }
    static isLowerThan(version1, version2) {
        switch (this.compareTwoVersions(version1, version2)) {
            case VersionCompare.Lower:
                return true;
            case VersionCompare.Error:
                return null;
        }
        return false;
    }
    constructor(version) {
        this.#version = version;
    }
    isEqisGreaterOrEqualualTo(version) {
        return PlaydeckVersion.isGreaterOrEqual(this.#version, version);
    }
    isLowerThan(version) {
        return PlaydeckVersion.isLowerThan(this.#version, version);
    }
    hasConnection(connection, direction) {
        return PlaydeckVersion.hasConnection(this.#version, connection, direction);
    }
    isLegacy() {
        return PlaydeckVersion.isLowerThan(this.#version, `4.1b3`);
    }
}
exports.PlaydeckVersion = PlaydeckVersion;
var VersionCompare;
(function (VersionCompare) {
    VersionCompare[VersionCompare["Greater"] = 1] = "Greater";
    VersionCompare[VersionCompare["Equal"] = 0] = "Equal";
    VersionCompare[VersionCompare["Lower"] = -1] = "Lower";
    VersionCompare[VersionCompare["Error"] = -99] = "Error";
})(VersionCompare || (exports.VersionCompare = VersionCompare = {}));
//# sourceMappingURL=PlaydeckVersion.js.map