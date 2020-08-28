const request = require('request-promise-native');
const log = require('../handlers/logHandler')
const currentPackage = require('../package.json');

const getPackage = (branch) => `https://raw.githubusercontent.com/Akshit-WTF/stithi/${branch}/package.json`;

const compare = (latest, current) => {
  if (latest > current) return 1;
  return 0;
};

module.exports = () => {
  return new Promise(async (reject) => {
    try {
      let options = {
        json: true
      };

      let latestPackage = await request(getPackage('unstable'), options);

      let result = compare(latestPackage.version, currentPackage.version);
      if (result === 1) log.stithi('This version of Stithi is outdated. Please update for more features.');
      if (result === 0) log.stithi('Latest version of Stithi is installed.')
    }
    catch (e) {
      reject(e);
    }
  });
};