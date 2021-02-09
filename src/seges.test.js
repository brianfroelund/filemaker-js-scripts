import { getParentageByChip, parseHorse } from "./seges";
import { rawParsedToParsed } from "./mocks/segesMock";

test("parses raw data correctly", () => {
  rawParsedToParsed.forEach(({raw, parsed}) => {
    expect(parseHorse(raw)).toStrictEqual(parsed)
  });
});
