import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  function listItem(url: string, pageName: string) {
    const onPage = pathname === url;
    return (
      <li
        className={`py-1 ${onPage ? "border-b-darkText border-b" : "font-regular"}`}
      >
        <Link href={url} onClick={onClose}>
          {pageName}
        </Link>
      </li>
    );
  }
  return (
    <div
      className={`bg-secondary h-screen p-4 w-[66vw] fixed top-0 ${isOpen ? "left-0" : "-left-full"} transition-all duration-300 ease-in-out`}
    >
      <div className="pt-16 ">
        <ol className="text-lg flex flex-col gap-3 heading">
          {listItem("/", "dashboard")}
          {listItem("/invoices", "invoices")}
          {listItem("/clients", "clients")}
          {listItem("/expenses", "expenses")}
        </ol>
      </div>
    </div>
  );
}
