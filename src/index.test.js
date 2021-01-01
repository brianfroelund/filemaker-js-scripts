import {
  getParantageByHid,
  parseIdentitySearchResult,
  parseParentageResult,
  seachByIdentity,
} from "./index";
import {
  parentageResponse,
  parsedParentageResponse,
} from "./mocks/parentageData";
import {
  identitySearchResponse,
  parsedIdentitySearchResponse,
} from "./mocks/identitySearchData";

test("parses multiple identity search results correctly", () => {
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(
    parsedIdentitySearchResponse
  );
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
  expect(parseParentageResult(parentageResponse)).toEqual(
    parsedParentageResponse
  );
});

test("seachByIdentity resolves to correct parsed result", async () => {
  const horse = await seachByIdentity("DW1901911");
  expect(horse).toEqual(parsedIdentitySearchResponse);
});

test("getParantageByHid resolves to correct parsed result", async () => {
  const horse = await getParantageByHid("14639252");
  expect(horse).toEqual(parsedParentageResponse);
});
