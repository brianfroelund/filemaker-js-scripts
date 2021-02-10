import "core-js";
import "regenerator-runtime/runtime";

import { getParentageByChip } from "./seges";

export const getHorse = (chip, registrationNumber) => {
  getParentageByChip(chip, registrationNumber).then((horse) => {
    if (horse) {
      console.info("horse", horse);
      // eslint-disable-next-line no-undef
      FileMaker.PerformScriptWithOption(
        "insertNewHorseJson",
        JSON.stringify(horse),
        "0"
      );
    } else {
      alert("Kunne ikke finde et match")
    }
  });
};

// FileMaker on Windows can only global functions
window["getHorse"] = getHorse;

console.log("Script version 0.1.0 loaded succesfully");
