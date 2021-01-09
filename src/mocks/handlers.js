import { rest } from "msw";
import { identitySearchResponses } from "./identitySearchData";
import { parentageResponses } from "./parentageData";

export const handlers = [
  rest.get(
    "https://equinet.seges.dk/ords/prod/hdtxt.soeg_ident",
    (req, res, ctx) => {
      const sident = req.url.searchParams.get("sident");
      if (sident && sident.length > 15) {
        return res(ctx.status(500));
      }
      const query = sident || "NOT MATCHED";
      return res(
        ctx.status(200),
        ctx.text(identitySearchResponses[query.toLowerCase()])
      );
    }
  ),
  rest.get(
    "https://equinet.seges.dk/ords/prod/hdtxt.hest_afst",
    (req, res, ctx) => {
      const hid = req.url.searchParams.get("hid");
      return res(
        ctx.status(200),
        ctx.text(parentageResponses[parseInt(hid)] || "")
      );
    }
  ),
];
