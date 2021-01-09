import {
  getParentageByHid,
  parseIdentitySearchResult,
  parseParentageResult,
  searchByIdentity,
  findBestMatch,
  populateExistingHorses,
  insertHorseIntoFilemaker,
} from "./index";
import {
  parentageResponses,
  parsedParentageResponse,
} from "./mocks/parentageData";
import {
  identitySearchResponses,
  parsedIdentitySearchResponse,
} from "./mocks/identitySearchData";
import { existingHorses } from "./mocks/existingHorses";

beforeAll(() => {
  populateExistingHorses(existingHorses);
});

test("parses multiple identity search results correctly", () => {
  expect(
    parseIdentitySearchResult(identitySearchResponses["*dw190191*"])
  ).toEqual(parsedIdentitySearchResponse);
});

test("parses invalid identity search results correctly", () => {
  const identitySearchResponse = `ID:1463925
NAVN:ALLEY CAT
IDENT:208333DW19:01911
AVLSFORBUND:DV
ID:1463928
NAVN:TROLDBORGS MISS DEENA
IDENT:208333DW1901912
AVLSFORBUNDDV
ID:1463930`;

  const expectedResult = [
    {
      hid: "1463925",
      name: "ALLEY CAT",
      registrationNumber: "208333DW19:01911",
      breedingAssociation: "DV",
    },
    {
      hid: "1463928",
      name: "TROLDBORGS MISS DEENA",
      registrationNumber: "208333DW1901912",
    },
    { hid: "1463930" },
  ];
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(
    expectedResult
  );
});

test("parses no matches identity search results correctly", () => {
  const identitySearchResponse = "NOT MATCHED";
  const expectedResult = [];
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(
    expectedResult
  );
});

test("parses no response identity search results correctly", () => {
  const identitySearchResponse = "";
  const expectedResult = [];
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(
    expectedResult
  );
});

test("parses empty response identity search results correctly", () => {
  const identitySearchResponse = " ";
  const expectedResult = [];
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(
    expectedResult
  );
});

test("parses parentenge result correctly", () => {
  expect(parseParentageResult(parentageResponses[1463925])).toEqual(
    parsedParentageResponse
  );
});

describe("searchByIdentity", () => {
  it("should resolves to correct parsed result", async () => {
    const horse = await searchByIdentity("DW190191");
    expect(horse).toEqual(parsedIdentitySearchResponse);
  });

  it("should keep query under 15 characters", async () => {
    const horse = await searchByIdentity("528003201006446");
    expect(horse).toEqual([
      {
        hid: "1360460",
        name: "FOREVER-ESPECIAL",
        registrationNumber: "528003201006446",
        breedingAssociation: "KWPN",
      },
    ]);
  });
});

test("getParantageByHid resolves to correct parsed result", async () => {
  const horse = await getParentageByHid("1463925");
  expect(horse).toEqual(parsedParentageResponse);
});

describe("findBestMatch", () => {
  it("should find Meksiboy", () => {
    expect(
      findBestMatch({ registrationNumber: "OX+2238", name: "Meksiboy" })
    ).toEqual("OX+2238");
  });

  it("should find FIANO PIT", () => {
    expect(
      findBestMatch({
        registrationNumber: "208333DW2045389",
        name: "FIANO PIT",
      })
    ).toEqual("dw2045389");
  });

  it("should find ALLEY CAT", () => {
    expect(
      findBestMatch({
        registrationNumber: "208333DW1901911",
        name: "ALLEY CAT",
      })
    ).toEqual("dw1901911");
  });

  it("should find SKOVENS RAFAEL", () => {
    expect(
      findBestMatch({
        registrationNumber: "DVE 930 DV DK",
        name: "SKOVENS RAFAEL",
      })
    ).toEqual("DVH 930");
  });

  it("should find RAFAELS GINA", () => {
    expect(
      findBestMatch({
        registrationNumber: "752004041002407 SWB SWE",
        name: "RAFAELS GINA",
      })
    ).toEqual("04102407");
  });

  it("should find BLUE HORS ROMANOV", () => {
    expect(
      findBestMatch({
        registrationNumber: "DVE 818 DV DK",
        name: "BLUE HORS ROMANOV",
      })
    ).toEqual("dvh 818");
  });

  it("should find TAZORBA", () => {
    expect(
      findBestMatch({ registrationNumber: "0000694 DV DK", name: "TAZORBA" })
    ).toEqual("0000694");
  });

  it("should find ERA DANCING HIT", () => {
    expect(
      findBestMatch({
        additionalRegistrationNumbers: ["208333DW0801916 DV DK"],
        name: "ERA DANCING HIT",
        registrationNumber: "DVH 1077 DV DK",
      })
    ).toEqual("DW0801916");
  });

  it("should find SØBAKKEHUS KAMILJA", () => {
    expect(
      findBestMatch({
        additionalRegistrationNumbers: ["208333DW0801916 DV DK"],
        name: "SØBAKKEHUS KAMILJA",
        registrationNumber: "208333DW0505819 DV DK",
      })
    ).toEqual("dw0505819");
  });

  it("should find SYVHØJEGÅRDS UNFORGETABLE S DWB", () => {
    expect(
      findBestMatch({
        additionalRegistrationNumbers: ["208333DW1501118 DV DK"],
        name: "SYVHØJEGÅRDS UNFORGETABLE S DWB",
        registrationNumber: "DVH 1281 DV DK",
      })
    ).toEqual("dw1501118");
  });

  it("should find D'AVIE", () => {
    expect(
      findBestMatch({
        additionalRegistrationNumbers: [
          "DE431316672812 HN DEU",
          "105SA75 FE DK",
        ],
        name: "D'AVIE",
        registrationNumber: "DVH 1200 DV DK",
      })
    ).toEqual("dvh 1200");
  });

  it(`should handle names with qoutes`, () => {
    expect(
      findBestMatch({
        name: `LUNDERUP'S ""MENJA`,
        registrationNumber: "208333DW0402024 DV DK",
      })
    ).toEqual("dw0402024");
  });

  it("should find untrimmed names", () => {
    expect(
      findBestMatch({
        additionalRegistrationNumbers: ["106OF49 FE DEU"],
        name: "SECRET",
        registrationNumber: "DE473730609814 DS DEU",
      })
    ).toEqual("DE473730609814");
  });

  it("should find names with dashes", () => {
    expect(
      findBestMatch({
        additionalRegistrationNumbers: ["9807910 DR DK"],
        name: "DONNA-FEE",
        registrationNumber: "DE331310021098 HN DEU",
      })
    ).toEqual("331310021098");
  });
});

test("Inserts into filemaker correctly", async () => {
  const performScriptMock = jest.fn();
  window.FileMaker = { PerformScriptWithOption: performScriptMock };
  const alertMock = jest.fn();
  window.alert = alertMock;

  await insertHorseIntoFilemaker("dw1901911");
  expect(performScriptMock.mock.calls.length).toBe(1);
  let stringifiedReturnObject = `{"additionalRegistrationNumbers":[],"name":"ALLEY CAT","registrationNumber":"208333DW1901911 DV DK","birthdate":"2019.05.26","gender":"Hoppe","color":"brun","breeder":"Nina Bonnevie","sire":{"name":"KREMLIN MD","additionalRegistrationNumbers":["528003201501293 KW NLD"],"hid":"1393191","registrationNumber":"528003201301352","sire":{"additionalRegistrationNumbers":["DVH 1243 DV DK","105HH82 FE NLD"],"hid":"1226548","name":"GOVERNOR","registrationNumber":"528003201102359 KW NLD","sire":{"additionalRegistrationNumbers":["528003200006174 KW NLD","NED08021 FE NLD"],"hid":"872201","name":"TOTILAS","registrationNumber":"00.06174 KW NLD","sire":{"additionalRegistrationNumbers":["DVE 657 DV DK","93.14543 KW NLD","DVH 657 DV DK","NED06100 KW NLD"],"hid":"181199","name":"GRIBALDI","registrationNumber":"DE309090701693 TR DEU","sire":null,"dam":null},"dam":{"additionalRegistrationNumbers":["528003199301288 KW NLD"],"hid":"872204","name":"LOMINKA","registrationNumber":"93.1288 KW NLD","sire":null,"dam":null}},"dam":{"additionalRegistrationNumbers":["528003199607786 KW NLD"],"hid":"1241251","name":"ORLEANS","registrationNumber":"96.07786 KW NLD","sire":null,"dam":null}},"dam":{"additionalRegistrationNumbers":[],"hid":"1393193","name":"FARESIA","registrationNumber":"528003201003191 KW NLD","sire":{"additionalRegistrationNumbers":["528003199807418 KW NLD","DE304048438098 BL DEU"],"hid":"556220","name":"ROUSSEAU","registrationNumber":"98.07418 KW NLD","sire":null,"dam":null},"dam":{"additionalRegistrationNumbers":[],"hid":"1393194","name":"BARESIA B","registrationNumber":"528003 06.00444 KW NLD","sire":null,"dam":null}}},"dam":{"name":"HOLMDALENS AISCHA","additionalRegistrationNumbers":[],"hid":"977552","registrationNumber":"dw1102921","evaluation":"DV EK 16-08-2015: RDS","sire":{"additionalRegistrationNumbers":["9901416 DV DK","208333199901416 DV DK","DE304040141699 BL DEU","DVH 801 DV DK"],"hid":"213419","name":"BLUE HORS DON ROMANTIC","registrationNumber":"DVE 801 DV DK","sire":{"additionalRegistrationNumbers":["DVH 690 DV DK","DE333332243993 OLD DEU","9308380 DR DK","DEN 02029 FE DK"],"hid":"194707","name":"BLUE HORS DON SCHUFRO","registrationNumber":"DVE 690 DV DK","sire":null,"dam":null},"dam":{"additionalRegistrationNumbers":["DH 4901 DV DK","9503248 DV DK","208333199503248 DV DK"],"hid":"162340","name":"ROSITA","registrationNumber":"ERDH 4901 DV DK","sire":null,"dam":null}},"dam":{"additionalRegistrationNumbers":[],"hid":"371140","name":"SASCHA","registrationNumber":"208333200301158 DV DK","sire":{"additionalRegistrationNumbers":["99.00610 KW NLD","528003199900610 KW NLD"],"hid":"326952","name":"SAM-SAM","registrationNumber":"DVH 794 DV DK","sire":null,"dam":null},"dam":{"additionalRegistrationNumbers":["DH 3686 DV DK","9107060 DV DK","208333199107060 DV DK"],"hid":"88854","name":"DWIGHT-EAST","registrationNumber":"ERDH 3686 DV DK","sire":null,"dam":null}}},"breedingAssociation":"DV"}`;
  expect(performScriptMock.mock.calls[0][0]).toBe("IMPORT_FROM_HESTEDB");
  expect(performScriptMock.mock.calls[0][1]).toBe(stringifiedReturnObject);
  expect(performScriptMock.mock.calls[0][2]).toBe("0");

  await insertHorseIntoFilemaker("2047592");
  expect(alertMock.mock.calls.length).toBe(0);
  expect(performScriptMock.mock.calls.length).toBe(2);
  stringifiedReturnObject = `{"additionalRegistrationNumbers":[],"name":"BØGEGÅRDENS UN","registrationNumber":"208333202047592 LU DK","birthdate":"2020.02.19","gender":"Hingst","color":"brun","breeder":"Stina og Jørgen Schmidt","sire":{"name":"","registrationNumber":""},"dam":{"name":"BØGEGÅRDENS SANTANA","additionalRegistrationNumbers":[],"hid":"1218051","registrationNumber":"dw1402019","evaluation":"DV EK 13-08-2017: RDH","sire":{"additionalRegistrationNumbers":["DE431315131710 HN DEU","105SI72 FE DK","42955 BL NOR"],"hid":"1127081","name":"BØGEGÅRDENS SANTIAGO","registrationNumber":"DVH 1153 DV DK","sire":{"additionalRegistrationNumbers":[],"hid":"845496","name":"SOLIMAN DE HUS","registrationNumber":"DE431310002505 HN DEU","sire":{"additionalRegistrationNumbers":["DE333330471993 OLD DEU"],"hid":"242230","name":"SANDRO HIT","registrationNumber":"DVH 872 DV DK","sire":null,"dam":null},"dam":{"additionalRegistrationNumbers":[],"hid":"846480","name":"DANEA","registrationNumber":"DE431310801301 HN DEU","sire":null,"dam":null}},"dam":{"additionalRegistrationNumbers":[],"hid":"1127083","name":"WISCONSIN","registrationNumber":"DE331317219194 HN DEU","sire":{"additionalRegistrationNumbers":[],"hid":"219733","name":"WESLEY","registrationNumber":"DE331312316489 HN DEU","sire":null,"dam":null},"dam":{"additionalRegistrationNumbers":[],"hid":"1127088","name":"DEFILEE","registrationNumber":"DE331317216083 HN DEU","sire":null,"dam":null}}},"dam":{"additionalRegistrationNumbers":["DH 5206 DV DK","9600454 DV DK","208333199600454 DV DK"],"hid":"170246","name":"BØGEGÅRDENS LAINA","registrationNumber":"BRDH 5206 DV DK","sire":{"additionalRegistrationNumbers":["DE321210075492 HO DEU","9207672 DR DK"],"hid":"155662","name":"LIONELL","registrationNumber":"DVH 571 DV DK","sire":{"additionalRegistrationNumbers":[],"hid":"155663","name":"LEONID","registrationNumber":"DE321210191388 HO DEU","sire":null,"dam":null},"dam":{"additionalRegistrationNumbers":[],"hid":"155664","name":"PRACHT","registrationNumber":"DE321210113278 HO DEU","sire":null,"dam":null}},"dam":{"additionalRegistrationNumbers":["RDS 10335 DV DK","DS 10335 DV DK","9112658 DV DK","208333199112658 DV DK"],"hid":"110522","name":"JOY","registrationNumber":"ERDS 10335 DV DK","sire":{"additionalRegistrationNumbers":["8700329 DV DK","208333198700329 DV DK","DE304040032987 BL DEU"],"hid":"82921","name":"CASTOR","registrationNumber":"DH 403 DV DK","sire":null,"dam":null},"dam":{"additionalRegistrationNumbers":["DH 2328 DV DK","8301360 DV DK","DS 5338 DV DK","208333198301360 DV DK"],"hid":"92476","name":"LAJKA","registrationNumber":"ERDH 2328 DV DK","sire":null,"dam":null}}}},"breedingAssociation":"LU"}`;
  expect(performScriptMock.mock.calls[1][0]).toBe("IMPORT_FROM_HESTEDB");
  expect(performScriptMock.mock.calls[1][1]).toBe(stringifiedReturnObject);
  expect(performScriptMock.mock.calls[1][2]).toBe("0");
});
