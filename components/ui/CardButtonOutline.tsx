type CardButtonOutlineProps = {
  ctaText: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  active?: boolean;
  styles?: string;
};
export default function CardButtonOutline({
  ctaText,
  onClick,
  isDisabled,
  active,
  styles,
}: CardButtonOutlineProps) {
  return (
    <button
      onClick={onClick}
      className={`text-realSecondary ${active ? "border-realPrimary" : "border-outline"} ${active ? "bg-realPrimary" : ""} ${active ? "text-onPrimary" : ""}  leading-normal transition-all  ${styles} border hover:border-realPrimary/20 hover:bg-realPrimary/80  rounded-full font-manrope capitalize ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} h-fit`}
      disabled={isDisabled}
    >
      {ctaText}
    </button>
  );
}
