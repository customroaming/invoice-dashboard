"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import {
  Client,
  LineItem,
  NewClient,
  NewInvoice,
  NewInvoiceItem,
} from "@/types";
import { Cross, Plus, X } from "lucide-react";
import { useState } from "react";
import { getLatestInvoice } from "../actions";
import TextInput from "@/components/ui/TextInput";
import TextAreaInput from "@/components/ui/TextAreaInput";
import SecondaryButtonOutline from "@/components/ui/SecondaryButtonOutline";

type InvoiceFormProps = {
  clients: Client[];
  createMethodAction: (invoice: NewInvoice, items: LineItem[]) => void;
  createClientAction: (client: NewClient) => Promise<number>;
};

export default function InvoiceForm({
  clients,
  createMethodAction,
  createClientAction,
}: InvoiceFormProps) {
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [newBusinessName, setNewBusinessName] = useState<string | null>("");
  const [selectedClient, setSelectedClient] = useState<string>("new");
  const isExistingClient = selectedClient !== "new";
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  type LineItemDraft = Omit<LineItem, "quantity" | "unitPrice"> & {
    quantity: string;
    unitPrice: string;
  };
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([
    {
      type: "hosting",
      description: "Monthly Web Hosting",
      quantity: "1",
      unitPrice: "15",
    },
  ]);

  const total = lineItems
    .reduce(
      (sum, item) =>
        sum + parseFloat(item.quantity) * parseFloat(item.unitPrice),
      0,
    )
    .toFixed(2);
  //
  //replace with actual auth when implemented
  //
  const [userId, setUserId] = useState<number>(1);

  const currentDate = new Date();
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 14);

  async function handleClientChange(clientId: string) {
    setSelectedClient(clientId);

    if (clientId == "new") {
      setNewName("");
      setNewAddress("");
      setNewEmail("");
      setNewBusinessName("");
      return;
    }
    const client = clients.find((c) => c.id.toString() == clientId);
    if (!client) {
      return;
    }
    setNewName(client.name);
    setNewEmail(client.email);
    setNewAddress(client.address);
    setNewBusinessName(client.businessName);

    const previousItems = await getLatestInvoice(Number(clientId));
    setLineItems(
      previousItems.map((item) => ({
        ...item,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      })),
    );
  }

  function optionClients(clients: Client) {
    return (
      <option key={clients.id} value={clients.id}>
        {clients.name}
      </option>
    );
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((item, i) => i !== index));
  }
  function addLineItem() {
    setLineItems((prev) => [
      ...prev,
      {
        type: "hosting",
        description: "",
        quantity: "1",
        unitPrice: "0",
      },
    ]);
  }
  function updateLineItem(index: number, field: keyof LineItem, value: string) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  return (
    <form className="invoiceForm font-manrope flex-col flex gap-4 p-4 rounded-lg bg-tertiaryContainer mt-4">
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Client</label>
        <select
          className="bg-surfaceContainer border border-outline rounded-lg"
          value={selectedClient}
          onChange={(e) => handleClientChange(e.target.value)}
        >
          <option value="new">New Client</option>
          {clients.map(optionClients)}
        </select>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <TextInput
          placeholderProp="Client Name"
          onChangeProp={(e) => setNewName(e.target.value)}
          isDisabled={isExistingClient}
          valueProp={newName}
          label="Name"
          styles="w-full"
        />
        <TextInput
          label="Email"
          onChangeProp={(e) => setNewEmail(e.target.value)}
          isDisabled={isExistingClient}
          valueProp={newEmail}
          placeholderProp="client@company.com"
          styles="w-full"
        />
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <TextAreaInput
          placeholderProp="Billing address"
          valueProp={newAddress}
          isDisabled={isExistingClient}
          onChangeProp={(e) => setNewAddress(e.target.value)}
          label="Address"
          styles="w-full"
        />
        <TextInput
          placeholderProp="Company name"
          valueProp={newBusinessName ? newBusinessName : ""}
          isDisabled={isExistingClient}
          onChangeProp={(e) => setNewBusinessName(e.target.value)}
          label="Business Name"
          styles="w-full"
        />
      </div>
      <p className="text-xl font-semibold">Invoice Items:</p>
      {lineItems.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-row justify-between items-center p-6 bg-secondary rounded-2xl"
          >
            <div className="flex flex-col md:grid md:grid-cols-3 gap-4 w-full relative">
              <X
                className="cursor-pointer hover:scale-120 transition-all text-darkText/75 absolute top-0 right-0 w-5"
                size={32}
                onClick={() => removeLineItem(index)}
              />
              <div className="flex flex-col gap-2 w-full">
                <label className="font-semibold">Type</label>
                <select
                  className="bg-surfaceContainer border border-outline rounded-lg"
                  value={lineItems[index].type}
                  onChange={(e) => {
                    updateLineItem(index, "type", e.target.value);
                    if (e.target.value !== "work") {
                      updateLineItem(index, "quantity", 1);
                    }
                  }}
                >
                  <option value="hosting">Hosting</option>
                  <option value="one_off">One Off</option>
                  <option value="work">Web Work</option>
                  <option value="domain">Domain Renewal</option>
                </select>
              </div>

              <TextInput
                placeholderProp="Description"
                valueProp={lineItems[index].description}
                onChangeProp={(e) =>
                  updateLineItem(index, "description", e.target.value)
                }
                label="Description"
                styles="w-full"
              />
              <TextInput
                placeholderProp="Unit Price"
                label="Unit Price"
                valueProp={lineItems[index].unitPrice}
                typeProp="number"
                onChangeProp={(e) =>
                  updateLineItem(index, "unitPrice", e.target.value)
                }
                styles="w-full"
              />
              {lineItems[index].type === "work" && (
                <TextInput
                  placeholderProp="Quantity"
                  typeProp="number"
                  label="Quantity"
                  valueProp={lineItems[index].quantity}
                  onChangeProp={(e) =>
                    updateLineItem(index, "quantity", e.target.value)
                  }
                  styles="w-full"
                />
              )}
            </div>
          </div>
        );
      })}
      <SecondaryButtonOutline
        ctaText="+ Add Item"
        onClick={(e) => {
          e.preventDefault();
          addLineItem();
        }}
      />
      <div className="capitalize items-center w-full px-4 py-4 flex flex-row rounded-lg border-outline border bg-surfaceContainer justify-between font-semibold">
        <p className="text-xl">Total:</p>
        <p className="text-3xl font-serif">£{total}</p>
      </div>
      <div className="text-textSecondary flex flex-row gap-2">
        <p>Created on: {currentDate.toDateString()}</p>
        <p> / </p>
        <p>Due on: {expiry.toDateString()}</p>
      </div>
      <PrimaryButton
        ctaText="Create Invoice"
        onClick={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);

          let clientId: number;
          try {
            if (isExistingClient) {
              // Use the already-selected existing client's ID
              clientId = Number(selectedClient);
            } else {
              // Await the server action — it returns the new ID directly
              clientId = await createClientAction({
                name: newName,
                createdAt: currentDate,
                address: newAddress,
                email: newEmail,
                businessName: newBusinessName,
                userId: userId,
              });
            }

            const dateStr = `${currentDate.getDate()}${currentDate.getMonth() + 1}${currentDate.getFullYear()}`;
            const dateId = `${clientId}-${dateStr}`;
            // Build the invoice NOW that we have the real clientId
            const newInvoice: NewInvoice = {
              clientId, // correct ID whether new or existing
              createdAt: currentDate,
              dueDate: expiry,
              status: "sent",
              userId: userId,
              dateId: dateId,
            };

            const finalItems: LineItem[] = lineItems.map((item) => ({
              ...item,
              quantity: parseFloat(item.quantity) || 0,
              unitPrice: parseFloat(item.unitPrice) || 0,
            }));
            createMethodAction(newInvoice, finalItems);
          } finally {
            setIsSubmitting(false);
          }
        }}
        isDisabled={isSubmitting}
      />
    </form>
  );
}
