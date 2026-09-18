import { Client } from "@/types";
import CardButtonOutline from "../ui/CardButtonOutline";
import Link from "next/link";

type ClientListProps = {
  clients: Client[];
};
export default function ClientList({ clients }: ClientListProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="hidden md:block text-3xl font-manrope font-semibold col-span-2">
        Clients
      </h1>
      <div className="hidden lg:block w-full rounded-xl overflow-hidden border border-outline">
        <table className="lg:table w-full text-left [&_td]:p-4 font-manrope [&_thead]:text-textSecondary [&_thead]:text-sm [&_thead]:font-semibold [&_thead]:uppercase">
          <thead className="bg-outline/75">
            <tr>
              <td>Invoice</td>
              <td>Client</td>
              <td>Email</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              return (
                <tr key={client.id}>
                  <td>#{client.id}</td>
                  <td>{client.businessName}</td>
                  <td>{client.email}</td>
                  <td className="text-link hover:text-linkHover">
                    <Link href={`/clients/${client.id}`}>{"View ->"}</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 md:grid md:grid-cols-2 lg:hidden">
        {clients.map((client) => (
          <div
            key={client.id}
            className="w-full bg-surfaceContainer font-manrope p-6 rounded-xl border border-outline flex flex-row justify-between gap-2 items-center"
          >
            <div className="flex flex-col gap-0 tracking-tight">
              <div className="text-lg font-semibold">{client.businessName}</div>
              <div className="text-textSecondary">{client.email}</div>
            </div>
            <Link href={`/clients/${client.id}`}>
              <CardButtonOutline ctaText="View" styles="px-5 py-2 text-md" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
