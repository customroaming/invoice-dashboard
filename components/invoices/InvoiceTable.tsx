"use client";
import { getAllInvoices } from "@/lib/queries/invoices";
import Link from "next/link";
import { Invoice } from "@/types";
import StatusBadge from "../ui/StatusBadge";
import { hasPaid } from "@/lib/queries/matching";

interface InvoiceTableProps {
  allInvoices: ReturnType<typeof getAllInvoices>;
  deleteInvoiceMethod: (invoiceId: number) => void;
  filterStatus?: Invoice["status"] | "All";
  filterClient?: Invoice["clientId"];
  updateInvoiceAction: (invoiceId: number, status: Invoice["status"]) => void;
}
export default function InvoiceTable({
  allInvoices,
  updateInvoiceAction,
  filterStatus,
  filterClient,
}: InvoiceTableProps) {
  function getDueDaysRemaining(dueDate: Date) {
    const dateNow = new Date();
    const remainingDateMilli = dueDate.valueOf() - dateNow.valueOf();
    const remainingDate = remainingDateMilli / (1000 * 60 * 60 * 24);
    return remainingDate.toFixed(0);
  }
  function handleStatusUpdate(id: number, status: Invoice["status"]) {
    updateInvoiceAction(id, status);
  }

  function insertStatusBadge(status: Invoice["status"]) {}

  if (filterStatus && filterStatus !== "All") {
    allInvoices = allInvoices.filter(
      (invoice) => invoice.invoices.status === filterStatus,
    );
  }

  if (filterClient) {
    allInvoices = allInvoices.filter(
      (invoice) => invoice.invoices.clientId === filterClient,
    );
  }
  return (
    <>
      <div className="hidden lg:block w-full rounded-xl overflow-hidden border border-outline">
        <table className="lg:table w-full text-left [&_td]:p-4 font-manrope [&_thead]:text-textSecondary [&_thead]:text-sm [&_thead]:font-semibold [&_thead]:uppercase">
          <thead className="bg-outline/75">
            <tr>
              <td>Invoice</td>
              <td>Client</td>
              <td className="text-right">Amount</td>
              <td>Due</td>
              <td>Status</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {allInvoices.map((invoice) => {
              const statusBadge = (() => {
                if (invoice.invoices.status === "paid")
                  return "bg-paid text-onPaid";
                if (invoice.invoices.status === "sent")
                  return "bg-pending text-onPending";
                if (invoice.invoices.status === "draft")
                  return "bg-pending text-onPending";
                if (invoice.invoices.status === "overdue")
                  return "bg-overdue text-onOverdue";
              })();
              return (
                <tr key={invoice.invoices.id}>
                  <td>#{invoice.invoices.id}</td>
                  <td>{invoice.clients?.businessName}</td>
                  <td className="text-right">£{invoice.total}</td>
                  <td>
                    Due in {getDueDaysRemaining(invoice.invoices.dueDate!)} days
                  </td>
                  <td>
                    <StatusBadge status={invoice.invoices.status} />
                  </td>
                  <td className="text-link hover:text-linkHover">
                    <Link href={`/invoices/${invoice.invoices.id}`}>
                      {"View ->"}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {allInvoices.map((invoice) => {
        const statusColour = (() => {
          if (invoice.invoices.status === "paid")
            return "border-outlineStrong text-green-700";
          if (invoice.invoices.status === "sent") return "border-outlineStrong";
          if (invoice.invoices.status === "draft")
            return "border-outlineStrong";
          if (invoice.invoices.status === "overdue")
            return "border-onOverdue text-onOverdue";
        })();

        const statusBadge = (() => {
          if (invoice.invoices.status === "paid") return "bg-paid text-onPaid";
          if (invoice.invoices.status === "sent")
            return "bg-pending text-onPending";
          if (invoice.invoices.status === "draft")
            return "bg-pending text-onPending";
          if (invoice.invoices.status === "overdue")
            return "bg-overdue text-onOverdue";
        })();
        return (
          <Link
            key={invoice.invoices.id}
            href={`/invoices/${invoice.invoices.id}`}
          >
            <div
              className={`invoice lg:hidden p-4 flex heading flex-col gap-2 rounded-2xl w-full text-onSecondary border relative bg-surfaceContainer ${statusColour}`}
            >
              <div className="flex flex-row items-center justify-between">
                <span className="text-textTertiary text-md font-manrope">
                  #{invoice.invoices.id}
                </span>
                <StatusBadge status={invoice.invoices.status} />
              </div>
              <div className="flex flex-row items-center justify-between">
                <h3 className="font-manrope font-semibold tracking-tight text-xl">
                  {invoice.clients?.name}
                </h3>
                <h4 className={`font-serif font-bold text-3xl`}>
                  £{invoice.total}
                </h4>
              </div>
              <h4
                className={`font-manrope text-sm ${invoice.invoices.status === "overdue" ? "text-onOverdue" : "text-textSecondary"}`}
              >
                Due in {getDueDaysRemaining(invoice.invoices.dueDate!)}{" "}
                days{" "}
              </h4>
            </div>
          </Link>
        );
      })}
    </>
  );
}

/*
 *
 * old code for table
 
        <table>
          <tbody>
            <tr>
              <td className="text-2xl">To:</td>
              <td className="text-2xl">
                {invoice.clients?.name} ({invoice.clients?.email})
              </td>
            </tr>
            <tr>
              <td className="text-2xl">Invoice ID:</td>
              <td className="text-2xl">{invoice.invoices.id}</td>
            </tr>
            <tr>
              <td className="text-2xl">Amount:</td>
              <td className="text-2xl">{invoice.invoices.amount}</td>
            </tr>
            <tr>
              <td className="text-2xl">Status:</td>
              <td className="text-2xl">{invoice.invoices.status}</td>
            </tr>
            <tr>
              <td className="text-2xl">Created On</td>
              <td className="text-2xl">
                {invoice.invoices.createdAt
                  ? invoice.invoices.createdAt.toDateString()
                  : ""}
              </td>
            </tr>
            <tr>
              <td className="text-2xl">Due On</td>
              <td className="text-2xl">
                {invoice.invoices.dueDate
                  ? invoice.invoices.dueDate.toDateString()
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-row gap-4">
          <Link href={`/invoices/${invoice.invoices.id}`}>
            <SecondaryButton ctaText="view invoice" />
          </Link>
          <ErrorButton
            ctaText="delete invoice"
            onClick={async (e) => {
              setIsDeleting(true);
              try {
                deleteInvoiceMethod(invoice.invoices.id);
              } finally {
                setIsDeleting(false);
              }
            }}
            isDisabled={isDeleting}
          />
        </div>
        */
