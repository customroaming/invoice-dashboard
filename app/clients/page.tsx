import ClientList from "@/components/clients/ClientsList";
import { getAllClients } from "@/lib/queries/clients";

export default async function Clients() {
  const allClients = await getAllClients();
  return <ClientList clients={allClients} />;
}
