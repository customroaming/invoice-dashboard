"use client";
import Link from "next/link";
import PrimaryButton from "../ui/PrimaryButton";
import { getAllInvoices } from "@/lib/queries/invoices";
import InvoiceTable from "./InvoiceTable";
import { deleteInvoice, updateInvoiceStatus } from "@/app/invoices/actions";
import { useState } from "react";
import SecondaryButtonOutline from "../ui/SecondaryButtonOutline";
import { Invoice } from "@/types";

type InvoicePageComponentProps = {
  allInvoices: ReturnType<typeof getAllInvoices>;
};

export default function InvoicePageComponent({
  allInvoices,
}: InvoicePageComponentProps) {
  const statusTypes = [
    ...new Set(allInvoices.map((invoice) => invoice.invoices.status)),
  ];
  const [status, setStatus] = useState<Invoice["status"] | "All">("All");
  return (
    <div className="flex flex-col w-full gap-4 pb-24">
      <div className="flex flex-row w-full items-center justify-between">
        <h1 className="text-4xl font-manrope font-semibold">Invoices</h1>
        <Link href="/invoices/add-invoice">
          {PrimaryButton({ ctaText: "New Invoice" })}
        </Link>
      </div>
      <div className="flex flex-row gap-4 overflow-scroll">
        <SecondaryButtonOutline
          key="All"
          ctaText="All"
          active={"All" === status}
          onClick={() => setStatus("All")}
        />
        {statusTypes.map((s) => (
          <SecondaryButtonOutline
            key={s}
            ctaText={s}
            active={s === status}
            onClick={() => setStatus(s)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4 pt-4 w-full md:grid md:grid-cols-2 lg:flex-col lg:flex">
        <InvoiceTable
          allInvoices={allInvoices}
          updateInvoiceAction={updateInvoiceStatus}
          deleteInvoiceMethod={deleteInvoice}
          filterStatus={status}
        />
      </div>
    </div>
  );
}
