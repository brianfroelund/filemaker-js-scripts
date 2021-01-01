import { rest } from "msw";
import { identitySearchResponse } from "./identitySearchData";
import { parentageResponse } from "./parentageData";

export const handlers = [
  rest.get(
    "https://equinet.seges.dk/ords/prod/hdtxt.soeg_ident",
    (req, res, ctx) => res(ctx.status(200), ctx.text(identitySearchResponse))
  ),
  rest.get(
    "https://equinet.seges.dk/ords/prod/hdtxt.hest_afst",
    (req, res, ctx) => res(ctx.status(200), ctx.text(parentageResponse))
  ),
];
