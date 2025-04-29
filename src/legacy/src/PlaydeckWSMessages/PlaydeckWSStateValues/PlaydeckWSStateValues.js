const { PlaydeckVersion } = require('../../PlaydeckVersion');
const { PlaydeckWSStateValuesBefore4 } = require('./PlaydeckWSStateValuesBefore4');
const { PlaydeckWSStateValuesAfter4 } = require('./PlaydeckWSStateValuesAfter4');

class PlaydeckWSStateValues {
  constructor(sMessage) {}
  /**
   * @param { PlaydeckVersion } version
   * @returns
   */
  static getStateValues(version) {
    return version.isNewerOrSameThan('4.1b2') ? PlaydeckWSStateValuesAfter4 : PlaydeckWSStateValuesBefore4;
  }
}

module.exports = {
  PlaydeckWSStateValues,
};
