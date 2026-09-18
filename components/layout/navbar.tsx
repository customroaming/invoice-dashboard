"use client";
import { Menu } from "@deemlol/next-icons";
import { useState } from "react";
import Sidebar from "./sidebar";
import { X } from "@deemlol/next-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const globalPageName = pathname.slice(1);

  function menuLink(url: string, pageName: string) {
    const onPage = pathname === url;
    return (
      <Link href={url}>
        <button
          className={`text-xl transition-all text-onSecondary cursor-pointer leading-4 pb-3 pt-2 px-2 hover:bg-secondary hover:text-onSecondary active:bg-primary rounded-full ${onPage ? " bg-secondary" : ""}`}
        >
          {pageName}
        </button>
      </Link>
    );
  }

  return (
    <div className="w-full bg-surfaceContainer items-center mb-8 py-4 border-b-secondary border-b heading p-2 flex flex-row justify-between">
      <Link href="/dashboard">
        <span className=" text-2xl capitalize lg:text-3xl text-darkText font-serif">
          {globalPageName}
        </span>
      </Link>
      <span className="hidden md:flex flex-row gap-8">
        {menuLink("/", "dashboard")}
        {menuLink("/invoices", "invoices")}
        {menuLink("/clients", "clients")}
        {menuLink("/expenses", "expenses")}
        {menuLink("/ingoings", "ingoings")}
      </span>
      <div className="hidden md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
