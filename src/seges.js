import "core-js";
import "regenerator-runtime/runtime";

export const getParentageByChip = async (chip) => {
  const body = new URLSearchParams();
  body.append("p_flow_id", "1000");
  body.append("p_flow_step_id", "2");
  body.append("p_request", "SUBMIT");
  body.append("p_arg_names", "1003030501521134");
  body.append("p_t01", "0");
  body.append("p_arg_names", "1628722590753620");
  body.append("p_t02", "0");
  body.append("p_arg_names", "2129827534881748");
  body.append("p_t03", "Søg hest");
  body.append("p_arg_names", "5502628350393903");
  body.append("p_t04", "Søgekriterier");
  body.append("p_arg_names", "5504418223409928");
  body.append("p_t05", "Søg hest");
  body.append("p_arg_names", "2435815727412919");
  body.append("p_t06", "^$");
  body.append("p_arg_names", "2454408545080138");
  body.append("p_t07", "^( .*)?$");
  body.append("p_arg_names", "1498921620370179");
  body.append("p_v08", "chip");
  body.append("p_arg_names", "1501600458411400");
  body.append("p_t09", chip);
  body.append("p_arg_names", "2733003807699059");
  body.append("p_t10", "FIND_HEST_SOEGEKRITERIER");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  };
  try {
    const response = await fetch(
      "https://equinet.seges.dk/ords/prod/wwv_flow.accept",
      requestOptions
    );
    const html = await response.text();
    const searchDocument = new DOMParser().parseFromString(html, "text/html");
    var paragraphs = searchDocument.querySelectorAll("p");
    const horseAnchor = searchDocument.querySelector(
      "#R48712627851389757 > tbody > tr:nth-child(2) > td:nth-child(2) > table.t7standard > tbody > tr:nth-child(2) > td:nth-child(1) > a"
    );
    const horseHtml = await (
      await fetch(
        "https://equinet.seges.dk/ords/prod/" + horseAnchor.getAttribute("href")
      )
    ).text();
    const horseDocument = new DOMParser().parseFromString(
      horseHtml,
      "text/html"
    );
    var tb = horseDocument.querySelectorAll(
      "#R5911812169144231 > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > table > tbody > tr"
    );
    const rawParsedData = {};
    tb.forEach((row) => {
      const key = row.firstChild.innerText;
      const value = row.lastChild.innerText;
      if (key) {
        rawParsedData[key] = value;
      }
    });
    return parseHorse(rawParsedData);
  } catch (error) {
    console.error(error);
  }
};

export const parseHorse = (rawParsedData) => {
  if (!rawParsedData) {
    return;
  }
  const parseParent = (parent) => {
    if (!parent) {
      return { name: "", registrationNumber: ""};
    }
    const ps = parent.split("\n");
    return ps.reduce((map, line) => {
      if (line.startsWith("Ident:")) {
        return { ...map, registrationNumber: line.substring(7) };
      } else if (line.startsWith("Navn:")) {
        return { ...map, name: line.substring(6) };
      } else {
        return map;
      }
    }, { name: "", registrationNumber: ""});
  };

  let additionalRegistrationNumbers = []
  if ("Øvrige identiteter" in rawParsedData) {
    additionalRegistrationNumbers = rawParsedData["Øvrige identiteter"].split("\n");
  }

  const result = {
    breeder: "",
    name: rawParsedData.Navn,
    registrationNumber: rawParsedData.Ident,
    // convert 26-05-2019 to 2019.05.26
    birthdate: rawParsedData.Fødselsdato.split("-").reverse().join("."),
    gender: ["vallak", "hingst"].includes(rawParsedData.Køn.toLowerCase())
      ? "hingst"
      : "hoppe",
    color: rawParsedData?.Farve,
    breeder: rawParsedData.Opdrætter ? rawParsedData.Opdrætter : "",
    breedingAssociation: rawParsedData.Avlsforbund ? rawParsedData.Avlsforbund : "",
    additionalRegistrationNumbers,
    sire: parseParent(rawParsedData.Far),
    dam: parseParent(rawParsedData.Mor),
  };
  return result;
};
