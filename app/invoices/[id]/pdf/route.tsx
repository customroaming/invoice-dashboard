import { NextRequest } from "next/server";
import { generateInvoicePDF } from "@/lib/pdf/generateInvoicePdf";
import { getInvoiceData } from "@/lib/invoices/getInvoiceData";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = getInvoiceData(Number(id));
  const pdf = await generateInvoicePDF(data);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${id}.pdf"`,
    },
  });
}
