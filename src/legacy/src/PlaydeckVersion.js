class PlaydeckVersion {
  /** @type { string } */
  #currentString;
  /** @type { number[] } */
  #current;
  /** @type { boolean } */
  #isWebsoket;
  /** @type { boolean } */
  #isTCPEvents;

  constructor(version) {
    this.#currentString = version;
    this.#current = this.#parseVersion(this.#currentString);
    this.#isWebsoket = this.isNewerOrSameThan(PlaydeckVersion.FIRST_WS_CONNECTION);
    this.#isTCPEvents = this.isNewerOrSameThan(PlaydeckVersion.FIRST_TCP_EVENTS);
    this.#init();
  }
  getCurrent() {
    return this.#currentString;
  }
  static FIRST_TCP_EVENTS = `3.5b3`;
  static FIRST_WS_CONNECTION = `3.6b18`;
  /**
   * @param { string } version
   * @returns { boolean }
   */
  static isVersion(version) {
    if (!version) return false;
    const bSplitted = version.split('b');
    if (bSplitted === undefined) return false;
    if (!Number.isInteger(Number(bSplitted[1]))) return false;
    const vSplitted = bSplitted[0].split('.');
    if (vSplitted === undefined) return false;
    if (!(Number.isInteger(Number(vSplitted[0])) && Number.isInteger(Number(vSplitted[0])))) return false;
    return true;
  }
  #init() {}
  #parseVersion(version) {
    if (!PlaydeckVersion.isVersion(version)) return null;
    const bSplit = version.split('b');
    const vSplit = bSplit[0].split('.');
    const major = Number(vSplit[0]);
    const minor = Number(vSplit[1]);
    const build = Number(bSplit[1]);
    return [major, minor, build];
  }
  /**
   * Compares two version arrays like `[major, minor, build,...]` returns
   * - `0` if version are equal
   * - `1` if first version is greater (newer)
   * - `-1` if first version is lower (older)
   * - `null` if one of arguments is not an Array
   * @param { number[] } version1
   * @param { number[] } version2
   * @returns
   */
  #compareTwoVersions(version1, version2) {
    if (!Array.isArray(version1) || !Array.isArray(version2)) return null;
    for (let i = 0; i < version1.length; i++) {
      if (version1[i] === version2[i]) continue;
      return version1[i] > version2[i] ? 1 : -1;
    }
    return 0;
  }
  /**
   * @param { string } version
   * @returns { string } success
   */
  updateVersion(version) {
    // TODO: think about reinit
    if (!PlaydeckVersion.isVersion(version)) return this.#currentString;
    this.#currentString = version;
    return this.#currentString;
  }
  /**
   * @param { string } version
   * @returns { boolean | null } returns `null` if vesion is not parsable
   */
  isNewerOrSameThan(version) {
    const parsed = this.#parseVersion(version);
    if (parsed === null) return null;
    if (this.#current === null) return null;
    return this.#compareTwoVersions(this.#current, parsed) >= 0;
  }
  /**
   * @param { string } version
   * @returns { boolean | null } returns `null` if vesion is not parsable
   */
  isOlderThan(version) {
    const parsed = this.#parseVersion(version);
    if (parsed === null) return null;
    if (this.#current === null) return null;
    return this.#compareTwoVersions(this.#current, parsed) < 0;
  }
  isWebsoketAvailable() {
    return this.#isWebsoket;
  }
  isTCPEventsAvailable() {
    return this.#isTCPEvents;
  }
}

module.exports = {
  PlaydeckVersion,
};
