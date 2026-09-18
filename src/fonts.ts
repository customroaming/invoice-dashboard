import localFont from "next/font/local";
import { Neuton } from "next/font/google";

export const neuton = Neuton({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  preload: true,
});
