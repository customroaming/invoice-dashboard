"use client";
import { sendInvoice, updateInvoiceStatus } from "@/app/invoices/actions";
import { getAllInvoices } from "@/lib/queries/invoices";
import { invoiceStatuses } from "@/lib/utils";
import { Invoice, InvoiceItem } from "@/types";
import { useState } from "react";
import ErrorButton from "../ui/ErrorButton";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusBadge from "../ui/StatusBadge";
import SecondaryButtonOutline from "../ui/SecondaryButtonOutline";

type IndividualInvoiceProps = {
  invoiceId: string;
  invoices: Awaited<ReturnType<typeof getAllInvoices>>;
  invoiceItems: InvoiceItem[];
  deleteInvoiceAction: (invoiceId: number) => void;
  updateInvoiceAction: (
    invoiceId: number,
    status: Invoice["status"],
  ) => Promise<void>;
};
export default function IndividualInvoice({
  invoices,
  invoiceId,
  invoiceItems,
  updateInvoiceAction,
  deleteInvoiceAction,
}: IndividualInvoiceProps) {
  const id = invoiceId;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const filteredInvoice = invoices.filter(
    (invoice) => invoice.invoices.id === Number(id),
  );

  const specificInvoice = invoices.find(
    (invoice) => invoice.invoices.id === Number(id),
  );
  const [currentStatus, setCurrentStatus] = useState(
    specificInvoice?.invoices.status ?? "sent",
  );
  function handleStatusUpdate(id: number, status: Invoice["status"]) {
    updateInvoiceAction(id, status);
  }
  return (
    <div className="flex font-manrope flex-col gap-8">
      {filteredInvoice.map((invoice) => {
        return (
          <div
            key={invoice.invoices.id}
            className="flex flex-col gap-4 md:gap-6 text-md"
          >
            <Link href={"../invoices/"}>
              <span className="text-textSecondary hover:text-linkHover text-lg font-semibold uppercase">
                {"< Invoices"}
              </span>
            </Link>
            <div className=" flex flex-row items-center gap-4 justify-between md:justify-start">
              <p className=" text-textSecondary md:hidden font-semibold align-end leading-normal">
                To: {invoice.clients?.businessName} (#{invoice.invoices.dateId})
              </p>
              <span className="text-4xl hidden md:block font-bold">
                Invoice #{invoice.invoices.dateId}
              </span>
              <StatusBadge status={invoice.invoices.status} />
            </div>

            <div className="flex flex-row items-center justify-between">
              <p className="hidden md:block text-textSecondary font-semibold align-end leading-normal">
                To: {invoice.clients?.businessName}
              </p>
              <div className="flex flex-col gap-2 w-60">
                <p className="font-semibold text-md">Update Status:</p>
                <div className="flex flex-row gap-4">
                  <select
                    className="capitalize w-full px-4 py-4 rounded-lg border-outline border bg-surfaceContainer"
                    onChange={(e) => {
                      const newStatus = e.target.value as Invoice["status"];
                      setCurrentStatus(newStatus);
                      handleStatusUpdate(Number(id), newStatus);
                    }}
                  >
                    <option value={currentStatus}>{currentStatus}</option>
                    {invoiceStatuses.map((status) => {
                      if (status === invoice.invoices.status) {
                        return;
                      }
                      return (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-full rounded-xl overflow-hidden border border-outline">
              <table className="md:table w-full text-left bg-surfaceContainer [&_td]:p-4 font-manrope [&_thead]:text-textSecondary [&_thead]:text-sm [&_thead]:font-semibold [&_thead]:uppercase">
                <thead className="bg-outline/75">
                  <tr>
                    <td>Description</td>
                    <td>Quantity</td>
                    <td className="text-left">Unit Price</td>
                    <td className="text-right">Amount</td>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td className="text-left">£{item.unitPrice}</td>
                        <td className="text-right">
                          £{item.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="capitalize font-bold items-center px-8 py-4 hidden md:flex flex-row gap-6 rounded-lg border-outline border bg-surfaceContainer ml-auto">
              <span className="font-manrope text-lg">Total</span>
              <span className="font-serif text-3xl">£{invoice.total}</span>
            </div>
            <div className="items flex flex-col gap-4 md:hidden">
              <h2 className="text-darkText text-xl font-semibold">
                Invoice Items
              </h2>
              {invoiceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 flex-col p-4 rounded-lg bg-surfaceContainer border-outline border text-onTertiaryContainer"
                >
                  <div className="flex flex-row text-lg font-semibold justify-between">
                    <p>{item.description}</p>
                    <p>£{item.amount.toFixed(2)}</p>
                  </div>
                  <hr className="text-textTertiary" />
                  <div className="flex text-textSecondary flex-row justify-between">
                    <p>Quantity:</p>
                    <p>{item.quantity}</p>
                  </div>
                  <div className="flex text-textSecondary flex-row justify-between">
                    <p>Unit Price:</p>
                    <p>£{item.unitPrice}</p>
                  </div>
                </div>
              ))}
              <div className="capitalize items-center w-full px-4 py-4 flex flex-row rounded-lg border-outline border bg-surfaceContainer justify-between font-semibold">
                <p className="text-xl">Total:</p>
                <p className="text-3xl font-serif">£{invoice.total}</p>
              </div>
            </div>
            {sendingStatus === "success" && (
              <p className="text-darkText text-lg">Invoice has been sent</p>
            )}
            {sendingStatus === "error" && (
              <p className="text-error text-lg">Invoice has not been sent</p>
            )}
            <div className="font-semibold flex flex-col flex-wrap gap-4 md:flex-row">
              <Link href={`/invoices/${invoice.invoices.id}/pdf`}>
                <SecondaryButtonOutline
                  styles="w-full md:w-fit bg-surfaceContainer"
                  ctaText="View Invoice (PDF)"
                />
              </Link>
              <SecondaryButtonOutline
                ctaText="Send Invoice"
                onClick={async () => {
                  setIsSending(true);
                  try {
                    await sendInvoice(invoice.invoices.id);
                    setSendingStatus("success");
                  } catch {
                    setSendingStatus("error");
                  } finally {
                    setIsSending(false);
                    alert("invoice sent");
                  }
                }}
                isDisabled={isSending}
                styles={`w-full md:w-fit ${isSending ? "bg-outline" : "bg-surfaceContainer"}`}
              />
              <ErrorButton
                ctaText="delete invoice"
                onClick={async (e) => {
                  setIsDeleting(true);
                  try {
                    deleteInvoiceAction(invoice.invoices.id);
                  } finally {
                    setIsDeleting(false);
                    redirect("/invoices");
                  }
                }}
                isDisabled={isDeleting}
                styles="w-full md:w-fit bg-surfaceContainer"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
