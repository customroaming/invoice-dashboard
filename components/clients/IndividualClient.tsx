"use client";
import { Client } from "@/types";
import { use, useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import TextInput from "../ui/TextInput";
import TextAreaInput from "../ui/TextAreaInput";
import ErrorButton from "../ui/ErrorButton";

type IndividualClientProps = {
  clientId: string;
  allClients: Client[];
  updateClientAction: (client: Client) => void;
  deleteClientAction: (clientId: number) => void;
};
export default function IndividualClient({
  clientId,
  allClients,
  updateClientAction,
  deleteClientAction,
}: IndividualClientProps) {
  const id = clientId;
  const awaitedClients = allClients;
  const client = awaitedClients.find((client) => client.id === Number(id));

  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [address, setAdress] = useState(client?.address ?? "");
  const [businessName, setBusinessName] = useState(client?.businessName ?? "");

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  async function showSuccessMessage() {
    setShowSuccess(true);
    await new Promise((r) => setTimeout(r, 2000));
    setShowSuccess(false);
  }

  if (!client) {
    return <p>No client found</p>;
  }
  return (
    <div key={client.id} className="flex flex-col font-manrope gap-4">
      <p className="text-4xl font-semibold hidden md:block">
        {client.businessName}
      </p>
      <div className="flex flex-col font-manrope gap-4 invoiceForm ">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:p-8 rounded-3xl  md:bg-surfaceContainer md:border md:border-outline">
          <TextInput
            placeholderProp="Client Name"
            onChangeProp={(e) => setName(e.target.value)}
            valueProp={name}
            label="Name"
            styles="w-full"
          />
          <TextInput
            placeholderProp="Client Email"
            onChangeProp={(e) => setEmail(e.target.value)}
            valueProp={email}
            label="Email"
            styles="w-full"
          />
          <TextAreaInput
            placeholderProp="Client Address"
            onChangeProp={(e) => setAdress(e.target.value)}
            valueProp={address}
            label="Address"
            styles="w-full"
          />
          <TextInput
            placeholderProp="Business Name"
            onChangeProp={(e) => setBusinessName(e.target.value)}
            valueProp={businessName}
            label="Business Name"
            styles="w-full"
          />
          <div className="flex flex-row gap-4 mt-4 md:col-span-2">
            <PrimaryButton
              ctaText="Update Client"
              isDisabled={isUpdating}
              onClick={(e) => {
                const updatedClient: Client = {
                  id: client.id,
                  name: name,
                  email: email,
                  address: address,
                  businessName: businessName,
                  userId: 1,
                  createdAt: null,
                };
                try {
                  setIsUpdating(true);
                  updateClientAction(updatedClient);
                } finally {
                  setIsUpdating(false);
                  showSuccessMessage();
                }
              }}
            />
            <ErrorButton
              ctaText="Delete Client"
              onClick={() => deleteClientAction(client.id)}
            />
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="w-full p-4 rounded-lg bg-secondary">
          <p className="text-onTertiaryContainer text-xl">Details Updated!!</p>
        </div>
      )}
    </div>
  );
}
