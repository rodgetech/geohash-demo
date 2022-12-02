import { z } from "zod";
import ngeohash from "ngeohash";

import { router, publicProcedure } from "../trpc";

export const searchRouter = router({
  nearBy: publicProcedure
    .input(z.object({ lat: z.number(), long: z.number() }))
    .query(({ input }) => {
      console.log("hi", input);

      const geohash = ngeohash.encode(input.lat, input.long, 5);

      console.log("geohash", geohash);

      return {
        greeting: `Hello from search`,
      };
    }),
});