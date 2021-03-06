const horseDbUrl = "";

export const searchByIdentity = (registrationNumber) => {
  const upperCaseRegNo = registrationNumber.toUpperCase();
  let query = `*${upperCaseRegNo.substring(0, 13)}*`;
  if (upperCaseRegNo.length === 15) {
    query = upperCaseRegNo;
  } else if (upperCaseRegNo.length === 14) {
    query = `${upperCaseRegNo}*`;
  }
  return fetch(`${horseDbUrl}soeg_ident?sident=${query}`)
    .then((response) => response.text())
    .then((text) => parseIdentitySearchResult(text));
};

export const getParentageByHid = (hid) => {
  return fetch(`${horseDbUrl}hest_afst?hid=${hid}`)
    .then((response) => response.text())
    .then((text) => parseParentageResult(text));
};

export const parseParentageResult = (text) => {
  if (!text) {
    return {};
  }

  const parseHorse = (horses, filter = "") => {
    const [block] = horses;
    if (!block) {
      return null;
    }
    const resultHorse = { additionalRegistrationNumbers: [] };
    block.split("\n").forEach((line) => {
      if (line.startsWith("PRIMÆR_IDENT:")) {
        resultHorse["registrationNumber"] = line.substring(13);
      } else if (line.startsWith("FØDSELSDATO:")) {
        // convert 26-05-2019 to 2019.05.26
        resultHorse["birthdate"] = line
          .substring(12)
          .split("-")
          .reverse()
          .join(".");
      } else if (line.startsWith("KØN:")) {
        resultHorse["gender"] = line.substring(4);
      } else if (line.startsWith("FARVE:")) {
        resultHorse["color"] = line.substring(6);
      } else if (line.startsWith("FAR_ID:") || line.includes("F_ID:")) {
        resultHorse["hid"] = line.split(":")[1];
      } else if (line.startsWith("MOR_ID:") || line.includes("M_ID:")) {
        resultHorse["hid"] = line.split(":")[1];
      } else if (line.startsWith("OPDRÆTTER:")) {
        resultHorse["breeder"] = line.substring(10);
      } else if (line.startsWith("NAVN:")) {
        resultHorse["name"] = line.substring(5);
      } else if (line.startsWith("ØVRIG_IDENT:")) {
        resultHorse.additionalRegistrationNumbers.push(line.substring(12));
      } else if (line.startsWith("PRIMÆRE_KÅRINGER:")) {
        resultHorse["evaluation"] = line.substring(17);
      } else if (line === "") {
        // pass
      } else {
        console.debug(
          `Received unknown key for line "${line}" identity search result with`
        );
      }
    });
    const sireFilter = filter + "F";
    const damFilter = filter + "M";
    resultHorse["sire"] = parseHorse(
      horses.filter((block) => block.startsWith(sireFilter)),
      sireFilter
    );
    resultHorse["dam"] = parseHorse(
      horses.filter((block) => block.startsWith(damFilter)),
      damFilter
    );
    return resultHorse;
  };

  const horse = parseHorse(text.split("\n\n"));
  return horse;
};

export const parseIdentitySearchResult = (text) => {
  if (!text) {
    return [];
  }
  const results = [];
  let currentResult = null;
  text.split("\n").forEach((line) => {
    if (line.startsWith("ID:")) {
      const value = line.substring(3);
      if (currentResult) {
        results.push(currentResult);
      }
      currentResult = {
        hid: value,
      };
    } else if (line.startsWith("NAVN:")) {
      const value = line.substring(5);
      currentResult["name"] = value;
    } else if (line.startsWith("IDENT:")) {
      const value = line.substring(6);
      currentResult["registrationNumber"] = value;
    } else if (line.startsWith("AVLSFORBUND:")) {
      const value = line.substring(12);
      currentResult["breedingAssociation"] = value;
    } else if (line === "") {
      // pass
    } else if (line === "NOT MATCHED") {
      return [];
    } else {
      console.debug(
        `Received unknown key for line "${line}" identity search result with`
      );
    }
  });
  if (currentResult) {
    results.push(currentResult);
  }
  return results;
};