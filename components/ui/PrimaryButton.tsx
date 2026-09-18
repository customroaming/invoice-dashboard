type PrimaryButtonProps = {
  ctaText: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  styles?: string;
};
export default function PrimaryButton({
  ctaText,
  onClick,
  isDisabled,
  styles,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-realPrimary text-onRealPrimary text-xl transition-all cursor-pointer leading-normal tracking-tight hover:bg-primary hover:text-onPrimary py-2 px-8 rounded-full font-manrope font-semibold ${styles}`}
      disabled={isDisabled}
    >
      {ctaText}
    </button>
  );
}
