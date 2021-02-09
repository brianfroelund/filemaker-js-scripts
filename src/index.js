import "core-js";
import "regenerator-runtime/runtime";

import { getParentageByChip } from "./seges";

export const getHorse = (chip) => {
  getParentageByChip(chip).then((parentage) => {
    console.info("horse", parentage);
    // eslint-disable-next-line no-undef
    FileMaker.PerformScriptWithOption(
      "insertNewHorseJson",
      JSON.stringify(horseToInsert),
      "0"
    );
  });
};

// FileMaker on Windows can only global functions
window["getHorse"] = getHorse;

console.log("Script version 0.1.0 loaded succesfully");
