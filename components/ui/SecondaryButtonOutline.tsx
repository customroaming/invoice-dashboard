type SecondaryButtonOutlineProps = {
  ctaText: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  active?: boolean;
  styles?: string;
};
export default function SecondaryButtonOutline({
  ctaText,
  onClick,
  isDisabled,
  active,
  styles,
}: SecondaryButtonOutlineProps) {
  return (
    <button
      onClick={onClick}
      className={`text-realSecondary ${active ? "border-realPrimary" : "border-outline"} ${active ? "bg-realPrimary" : ""} ${active ? "text-onPrimary" : ""} text-lg md:text-xl transition-all  ${styles} border hover:border-realPrimary/20 hover:bg-realPrimary/80 leading-none md:leading-normal py-2 px-4 md:py-3 md:px-8 rounded-full font-manrope capitalize ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} `}
      disabled={isDisabled}
    >
      {ctaText}
    </button>
  );
}
