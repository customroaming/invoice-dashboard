import { MonzoBalance } from "@/types";

interface CurrentBalanceProps {
  balance: MonzoBalance;
}

export default function CurrentBalance({ balance }: CurrentBalanceProps) {
  const currentBalance = balance.balance / 100;
  return (
    <div className="flex flex-col gap-2 mb-8">
      <h2 className="md:text-md uppercase font-manrope text-sm font-semibold text-textSecondary">
        Current Balance:
      </h2>
      <span className="font-serif text-6xl md:text-7xl mb-2">
        £{currentBalance.toFixed(2)}
      </span>
      <span className="font-manrope text-textTertiary text-sm">
        Synced from Monzo just now
      </span>
    </div>
  );
}
