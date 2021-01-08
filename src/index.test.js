import {
  getParentageByHid,
  parseIdentitySearchResult,
  parseParentageResult,
  searchByIdentity,
  findBestMatch,
  populateExistingHorses,
  insertHorseIntoFilemaker,
} from './index';
import { parentageResponse, parsedParentageResponse } from './mocks/parentageData';
import { identitySearchResponse, parsedIdentitySearchResponse } from './mocks/identitySearchData';
import { existingHorses } from './mocks/existingHorses';

test('parses multiple identity search results correctly', () => {
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(parsedIdentitySearchResponse);
});

test('parses invalid identity search results correctly', () => {
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
      hid: '1463925',
      name: 'ALLEY CAT',
      registrationNumber: '208333DW19:01911',
      breedingAssociation: 'DV',
    },
    {
      hid: '1463928',
      name: 'TROLDBORGS MISS DEENA',
      registrationNumber: '208333DW1901912',
    },
    { hid: '1463930' },
  ];
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(expectedResult);
});

test('parses no matches identity search results correctly', () => {
  const identitySearchResponse = 'NOT MATCHED';
  const expectedResult = [];
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(expectedResult);
});

test('parses no response identity search results correctly', () => {
  const identitySearchResponse = '';
  const expectedResult = [];
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(expectedResult);
});

test('parses empty response identity search results correctly', () => {
  const identitySearchResponse = ' ';
  const expectedResult = [];
  expect(parseIdentitySearchResult(identitySearchResponse)).toEqual(expectedResult);
});

test('parses parentenge result correctly', () => {
  expect(parseParentageResult(parentageResponse)).toEqual(parsedParentageResponse);
});

test('seachByIdentity resolves to correct parsed result', async () => {
  const horse = await searchByIdentity('DW1901911');
  expect(horse).toEqual(parsedIdentitySearchResponse);
});

test('getParantageByHid resolves to correct parsed result', async () => {
  const horse = await getParentageByHid('14639252');
  expect(horse).toEqual(parsedParentageResponse);
});

test('finds valid match', () => {
  populateExistingHorses(existingHorses);
  expect(findBestMatch({ registrationNumber: 'OX+2238', name: 'Meksiboy' })).toEqual('OX+2238');
  expect(findBestMatch({ registrationNumber: '208333DW2045389', name: 'FIANO PIT' })).toEqual('dw2045389');
  expect(findBestMatch({ registrationNumber: '208333DW1901911', name: 'ALLEY CAT' })).toEqual('dw1901911');
  expect(
    findBestMatch({
      registrationNumber: 'DVE 930 DV DK',
      name: 'SKOVENS RAFAEL',
    })
  ).toEqual('DVH 930');
  expect(
    findBestMatch({
      registrationNumber: '752004041002407 SWB SWE',
      name: 'RAFAELS GINA',
    })
  ).toEqual('04102407');
  expect(
    findBestMatch({
      registrationNumber: 'DVE 818 DV DK',
      name: 'BLUE HORS ROMANOV',
    })
  ).toEqual('dvh 818');
  expect(findBestMatch({ registrationNumber: '0000694 DV DK', name: 'TAZORBA' })).toEqual('0000694');
  expect(findBestMatch({ registrationNumber: '0000694 DV DK', name: 'FIZORBA' })).toEqual(null);
  expect(
    findBestMatch({
      additionalRegistrationNumbers: ['208333DW0801916 DV DK'],
      name: 'ERA DANCING HIT',
      registrationNumber: 'DVH 1077 DV DK',
    })
  ).toEqual('DW0801916');
  expect(
    findBestMatch({
      additionalRegistrationNumbers: ['208333DW0801916 DV DK'],
      name: 'SØBAKKEHUS KAMILJA',
      registrationNumber: '208333DW0505819 DV DK',
    })
  ).toEqual('dw0505819');
  expect(
    findBestMatch({
      additionalRegistrationNumbers: ['208333DW1501118 DV DK'],
      name: 'SYVHØJEGÅRDS UNFORGETABLE S DWB',
      registrationNumber: 'DVH 1281 DV DK',
    })
  ).toEqual(null);
});

test.only('Inserts into filemaker', async () => {
  const performScriptWithOptionMock = jest.fn();
  window.FileMaker = { PerformScriptWithOption: performScriptWithOptionMock };
  const alertMock = jest.fn();
  window.alert = alertMock;

  await insertHorseIntoFilemaker('dw1901911');

  expect(performScriptWithOptionMock.mock.calls.length).toBe(0);
});
