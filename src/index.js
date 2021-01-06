import 'core-js';
import 'regenerator-runtime/runtime';

import Fuse from 'fuse.js';

const horseDbUrl = 'https://equinet.seges.dk/ords/prod/hdtxt.';
export const searchByIdentity = (registrationNumber) => {
  return fetch(`${horseDbUrl}soeg_ident?sident=*${registrationNumber}*`)
    .then((response) => response.text())
    .then((text) => parseIdentitySearchResult(text));
};

export const getParantageByHid = (hid) => {
  return fetch(`${horseDbUrl}hest_afst?hid=${hid}`)
    .then((response) => response.text())
    .then((text) => parseParentageResult(text));
};

export const getParantageByRegistrationNumber = (registrationNumber) => {
  return searchByIdentity(registrationNumber).then((results) => {
    if (results.length === 1) {
      return getParantageByHid(results[0].hid);
    }
    console.debug('Did not find exactly 1 match when searching by registration number. Results:', results);
    return null;
  });
};

export const parseParentageResult = (text) => {
  if (!text) {
    return {};
  }

  const parseHorse = (horses, filter = '') => {
    const [block] = horses;
    if (!block) {
      return null;
    }
    const resultHorse = { additionalRegistrationNumbers: [] };
    block.split('\n').forEach((line) => {
      if (line.startsWith('PRIMÆR_IDENT:')) {
        resultHorse['registrationNumber'] = line.substring(13);
      } else if (line.startsWith('FØDSELSDATO:')) {
        // convert 26-05-2019 to 2019.05.26
        resultHorse['birthdate'] = line.substring(12).split('-').reverse().join('.');
      } else if (line.startsWith('KØN:')) {
        resultHorse['gender'] = line.substring(4);
      } else if (line.startsWith('FARVE:')) {
        resultHorse['color'] = line.substring(6);
      } else if (line.startsWith('FAR_ID:') || line.includes('F_ID:')) {
        resultHorse['hid'] = line.split(':')[1];
      } else if (line.startsWith('MOR_ID:') || line.includes('M_ID:')) {
        resultHorse['hid'] = line.split(':')[1];
      } else if (line.startsWith('OPDRÆTTER:')) {
        resultHorse['breeder'] = line.substring(10);
      } else if (line.startsWith('NAVN:')) {
        resultHorse['name'] = line.substring(5);
      } else if (line.startsWith('ØVRIG_IDENT:')) {
        resultHorse.additionalRegistrationNumbers.push(line.substring(12));
      } else if (line.startsWith('PRIMÆRE_KÅRINGER:')) {
        resultHorse['evaluation'] = line.substring(17);
      } else if (line === '') {
        // pass
      } else {
        console.debug(`Received unknown key for line "${line}" identity search result with`);
      }
    });
    const sireFilter = filter + 'F';
    const damFilter = filter + 'M';
    resultHorse['sire'] = parseHorse(
      horses.filter((block) => block.startsWith(sireFilter)),
      sireFilter
    );
    resultHorse['dam'] = parseHorse(
      horses.filter((block) => block.startsWith(damFilter)),
      damFilter
    );
    return resultHorse;
  };

  const horse = parseHorse(text.split('\n\n'));
  return horse;
};

export const parseIdentitySearchResult = (text) => {
  if (!text) {
    return [];
  }
  const results = [];
  let currentResult = null;
  text.split('\n').forEach((line) => {
    if (line.startsWith('ID:')) {
      const value = line.substring(3);
      if (currentResult) {
        results.push(currentResult);
      }
      currentResult = {
        hid: value,
      };
    } else if (line.startsWith('NAVN:')) {
      const value = line.substring(5);
      currentResult['name'] = value;
    } else if (line.startsWith('IDENT:')) {
      const value = line.substring(6);
      currentResult['registrationNumber'] = value;
    } else if (line.startsWith('AVLSFORBUND:')) {
      const value = line.substring(12);
      currentResult['breedingAssociation'] = value;
    } else if (line === '') {
      // pass
    } else if (line === 'NOT MATCHED') {
      return [];
    } else {
      console.debug(`Received unknown key for line "${line}" identity search result with`);
    }
  });
  if (currentResult) {
    results.push(currentResult);
  }
  return results;
};

export const insertHorseIntoFilemaker = (registrationNumber) => {
  getParantageByRegistrationNumber(registrationNumber).then((parentage) => {
    console.debug(JSON.stringify(parentage, null, 4));
    if (!parentage) {
      alert('Kunne ikke finde match i HesteDB');
      return;
    }
    const { sire, dam } = parentage;
    const sireExistingRegistration = findBestMatch(sire);
    const damExistingRegistration = findBestMatch(dam);
    const toMatchExistingRecords = {
      ...parentage,
      sire: {
        ...sire,
        registrationNumber: sireExistingRegistration ? sireExistingRegistration : sire.registrationNumber,
      },
      dam: {
        ...dam,
        registrationNumber: damExistingRegistration ? damExistingRegistration : dam.registrationNumber,
      },
    };
    // eslint-disable-next-line no-undef
    FileMaker.PerformScriptWithOption('IMPORT_FROM_HESTEDB', JSON.stringify(toMatchExistingRecords), '0');
  });
};

let fuse = null;

export const findBestMatch = (horse) => {
  if (!fuse) {
    console.debug('Fuse has not been initialized');
    return null;
  }
  const { name, registrationNumber, additionalRegistrationNumbers } = horse;
  const query = {
    $or: [
      {
        $and: [{ name: `="${horse.name}"` }, { id: `"${registrationNumber}"` }],
      },
    ],
  };
  if (additionalRegistrationNumbers) {
    additionalRegistrationNumbers.forEach((number) => {
      query.$or.push({
        $and: [{ name: `="${horse.name}"` }, { id: `"${number}"` }],
      });
    });
  }
  const result = fuse.search(query, {
    limit: 3,
  });
  console.debug(`Searched for ${name} ${registrationNumber}, found:`, result);
  if (result.length < 1) {
    return null;
  }
  return result[0].item.id;
};

export const test = (data) => {
  console.debug('test: parameter', JSON.parse(data));
};

export const populateExistingHorses = (data) => {
  console.log("Starting population of existing horses");
  let parsedData = data;

  if (typeof data === 'string') {
    parsedData = JSON.parse(data);
    parsedData = parsedData.response.data.map(({ fieldData }) => ({
      id: fieldData['Patient Record'],
      name: fieldData['Patient Name'],
    }));
  }
  const options = {
    includeScore: true,
    keys: ['id', { name: 'name', weight: 10 }],
    threshold: 0.8,
    useExtendedSearch: true,
    minMatchCharLength: 2,
  };
  fuse = new Fuse(parsedData, options);
  console.log("Finished populating existing horses");
};

window.filemaker = {
  insertHorseIntoFilemaker,
  populateExistingHorses,
  test,
};

// Filemaker is not available right away
setTimeout(() => {
  console.log('Script version 0.0.1 loaded succesfully');
  if (window.FileMaker) {
    console.log('Requesting population of existing horse data');
    try {
      // eslint-disable-next-line no-undef
      FileMaker.PerformScriptWithOption('INDEX_WEBVIEW_SEARCH', '', '0');
    } catch (error) {
      console.log('error', error);
    }
  } else {
    console.error('FileMaker not found')
  }
}, 10000);
