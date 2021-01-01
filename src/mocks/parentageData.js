export const parentageResponse = `NAVN:ALLEY CAT
PRIMÆR_IDENT:208333DW1901911 DV DK
FØDSELSDATO:26-05-2019
KØN:Hoppe
FARVE:brun
OPDRÆTTER:Nina Bonnevie

FAR_ID:1393191
NAVN:KREMLIN MD
PRIMÆR_IDENT:DVH 1300 DV DK
ØVRIG_IDENT:528003201501293 KW NLD

MOR_ID:977552
NAVN:HOLMDALENS AISCHA
PRIMÆR_IDENT:208333DW1102921 DV DK
PRIMÆRE_KÅRINGER:DV EK 16-08-2015: RDS

FF_ID:1226548
NAVN:GOVERNOR
PRIMÆR_IDENT:528003201102359 KW NLD
ØVRIG_IDENT:DVH 1243 DV DK
ØVRIG_IDENT:105HH82 FE NLD

FM_ID:1393193
NAVN:FARESIA
PRIMÆR_IDENT:528003201003191 KW NLD

MF_ID:213419
NAVN:BLUE HORS DON ROMANTIC
PRIMÆR_IDENT:DVE 801 DV DK
ØVRIG_IDENT:9901416 DV DK
ØVRIG_IDENT:208333199901416 DV DK
ØVRIG_IDENT:DE304040141699 BL DEU
ØVRIG_IDENT:DVH 801 DV DK

MM_ID:371140
NAVN:SASCHA
PRIMÆR_IDENT:208333200301158 DV DK

FFF_ID:872201
NAVN:TOTILAS
PRIMÆR_IDENT:00.06174 KW NLD
ØVRIG_IDENT:528003200006174 KW NLD
ØVRIG_IDENT:NED08021 FE NLD

FFM_ID:1241251
NAVN:ORLEANS
PRIMÆR_IDENT:96.07786 KW NLD
ØVRIG_IDENT:528003199607786 KW NLD

FMF_ID:556220
NAVN:ROUSSEAU
PRIMÆR_IDENT:98.07418 KW NLD
ØVRIG_IDENT:528003199807418 KW NLD
ØVRIG_IDENT:DE304048438098 BL DEU

FMM_ID:1393194
NAVN:BARESIA B
PRIMÆR_IDENT:528003 06.00444 KW NLD

MFF_ID:194707
NAVN:BLUE HORS DON SCHUFRO
PRIMÆR_IDENT:DVE 690 DV DK
ØVRIG_IDENT:DVH 690 DV DK
ØVRIG_IDENT:DE333332243993 OLD DEU
ØVRIG_IDENT:9308380 DR DK
ØVRIG_IDENT:DEN 02029 FE DK

MFM_ID:162340
NAVN:ROSITA
PRIMÆR_IDENT:ERDH 4901 DV DK
ØVRIG_IDENT:DH 4901 DV DK
ØVRIG_IDENT:9503248 DV DK
ØVRIG_IDENT:208333199503248 DV DK

MMF_ID:326952
NAVN:SAM-SAM
PRIMÆR_IDENT:DVH 794 DV DK
ØVRIG_IDENT:99.00610 KW NLD
ØVRIG_IDENT:528003199900610 KW NLD

MMM_ID:88854
NAVN:DWIGHT-EAST
PRIMÆR_IDENT:ERDH 3686 DV DK
ØVRIG_IDENT:DH 3686 DV DK
ØVRIG_IDENT:9107060 DV DK
ØVRIG_IDENT:208333199107060 DV DK

FFFF_ID:181199
NAVN:GRIBALDI
PRIMÆR_IDENT:DE309090701693 TR DEU
ØVRIG_IDENT:DVE 657 DV DK
ØVRIG_IDENT:93.14543 KW NLD
ØVRIG_IDENT:DVH 657 DV DK
ØVRIG_IDENT:NED06100 KW NLD

FFFM_ID:872204
NAVN:LOMINKA
PRIMÆR_IDENT:93.1288 KW NLD
ØVRIG_IDENT:528003199301288 KW NLD`;

export const parsedParentageResponse = {
  name: "ALLEY CAT",
  registrationNumber: "208333DW1901911 DV DK",
  birthdate: "26-05-2019",
  gender: "Hoppe",
  color: "brun",
  breeder: "Nina Bonnevie",
  additionalRegistrationNumbers: [],
  sire: {
    hid: "1393191",
    name: "KREMLIN MD",
    registrationNumber: "DVH 1300 DV DK",
    additionalRegistrationNumbers: ["528003201501293 KW NLD"],
    sire: {
      hid: "1226548",
      name: "GOVERNOR",
      registrationNumber: "528003201102359 KW NLD",
      additionalRegistrationNumbers: ["DVH 1243 DV DK", "105HH82 FE NLD"],
      sire: {
        hid: "872201",
        name: "TOTILAS",
        registrationNumber: "00.06174 KW NLD",
        additionalRegistrationNumbers: [
          "528003200006174 KW NLD",
          "NED08021 FE NLD",
        ],
        sire: {
          hid: "181199",
          name: "GRIBALDI",
          registrationNumber: "DE309090701693 TR DEU",
          additionalRegistrationNumbers: [
            "DVE 657 DV DK",
            "93.14543 KW NLD",
            "DVH 657 DV DK",
            "NED06100 KW NLD",
          ],
          sire: null,
          dam: null,
        },
        dam: {
          hid: "872204",
          name: "LOMINKA",
          registrationNumber: "93.1288 KW NLD",
          additionalRegistrationNumbers: ["528003199301288 KW NLD"],
          sire: null,
          dam: null,
        },
      },
      dam: {
        hid: "1241251",
        name: "ORLEANS",
        registrationNumber: "96.07786 KW NLD",
        additionalRegistrationNumbers: ["528003199607786 KW NLD"],
        sire: null,
        dam: null,
      },
    },
    dam: {
      hid: "1393193",
      name: "FARESIA",
      registrationNumber: "528003201003191 KW NLD",
      additionalRegistrationNumbers: [],
      sire: {
        hid: "556220",
        name: "ROUSSEAU",
        registrationNumber: "98.07418 KW NLD",
        additionalRegistrationNumbers: [
          "528003199807418 KW NLD",
          "DE304048438098 BL DEU",
        ],
        sire: null,
        dam: null,
      },
      dam: {
        hid: "1393194",
        name: "BARESIA B",
        registrationNumber: "528003 06.00444 KW NLD",
        additionalRegistrationNumbers: [],
        sire: null,
        dam: null,
      },
    },
  },
  dam: {
    hid: "977552",
    name: "HOLMDALENS AISCHA",
    registrationNumber: "208333DW1102921 DV DK",
    evaluation: "DV EK 16-08-2015: RDS",
    additionalRegistrationNumbers: [],
    sire: {
      hid: "213419",
      name: "BLUE HORS DON ROMANTIC",
      registrationNumber: "DVE 801 DV DK",
      additionalRegistrationNumbers: [
        "9901416 DV DK",
        "208333199901416 DV DK",
        "DE304040141699 BL DEU",
        "DVH 801 DV DK",
      ],
      sire: {
        hid: "194707",
        name: "BLUE HORS DON SCHUFRO",
        registrationNumber: "DVE 690 DV DK",
        additionalRegistrationNumbers: [
          "DVH 690 DV DK",
          "DE333332243993 OLD DEU",
          "9308380 DR DK",
          "DEN 02029 FE DK",
        ],
        sire: null,
        dam: null,
      },
      dam: {
        hid: "162340",
        name: "ROSITA",
        registrationNumber: "ERDH 4901 DV DK",
        additionalRegistrationNumbers: [
          "DH 4901 DV DK",
          "9503248 DV DK",
          "208333199503248 DV DK",
        ],
        sire: null,
        dam: null,
      },
    },
    dam: {
      hid: "371140",
      name: "SASCHA",
      registrationNumber: "208333200301158 DV DK",
      additionalRegistrationNumbers: [],
      sire: {
        hid: "326952",
        name: "SAM-SAM",
        registrationNumber: "DVH 794 DV DK",
        additionalRegistrationNumbers: [
          "99.00610 KW NLD",
          "528003199900610 KW NLD",
        ],
        sire: null,
        dam: null,
      },
      dam: {
        hid: "88854",
        name: "DWIGHT-EAST",
        registrationNumber: "ERDH 3686 DV DK",
        additionalRegistrationNumbers: [
          "DH 3686 DV DK",
          "9107060 DV DK",
          "208333199107060 DV DK",
        ],
        sire: null,
        dam: null,
      },
    },
  },
};
