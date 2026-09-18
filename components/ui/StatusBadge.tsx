import { statusStyles } from "@/constants/invoice-status";
import { Invoice } from "@/types";

type StatusBadgeProps = {
  status: Invoice["status"];
};
export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyle = statusStyles;

  return (
    <span
      className={`capitalize h-fit font-manrope text-sm px-4 py-1 font-semibold rounded-full ${statusStyle[status]}`}
    >
      {status}
    </span>
  );
}
