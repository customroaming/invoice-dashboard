"use client";
import {
  CircleCheck,
  FileText,
  House,
  LucideIcon,
  PoundSterling,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomBar() {
  const pathName = usePathname();
  function displayIcon(text: string, url: string, Icon: LucideIcon) {
    const onPage = pathName === url;
    return (
      <Link href={url}>
        <div className="flex flex-col justify-center items-center gap-0">
          <div
            className={`p-2 ${onPage ? "bg-secondary" : "bg-secondary/0"} rounded-full w-full flex justify-center`}
          >
            <Icon />
          </div>
          <span>{text}</span>
        </div>
      </Link>
    );
  }
  return (
    <nav className="md:hidden flex flex-row bg-surfaceContainer pt-4 justify-around fixed bottom-0 left-0 w-full">
      {displayIcon("dashboard", "/dashboard", House)}
      {displayIcon("invoices", "/invoices", FileText)}
      {displayIcon("clients", "/clients", UsersRound)}
      {displayIcon("expenses", "/expenses", PoundSterling)}
      {displayIcon("ingoings", "/ingoings", CircleCheck)}
    </nav>
  );
}
