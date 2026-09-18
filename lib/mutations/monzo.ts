import { tokens } from "@/db/schema";
import { db } from "../db";

type updateTokensProps = {
  access: string;
  refresh: string;
};
export function updateTokens({ access, refresh }: updateTokensProps) {
  db.update(tokens)
    .set({
      accessToken: access,
      refreshToken: refresh,
    })
    .run();
}
