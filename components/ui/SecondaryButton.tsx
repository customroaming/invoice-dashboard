type SecondaryButtonProps = {
  ctaText: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
};
export default function SecondaryButton({
  ctaText,
  onClick,
  isDisabled,
}: SecondaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-realSecondary text-onRealSecondary text-xl transition-all cursor-pointer leading-4 w-fit pb-3 hover:bg-primary hover:text-onPrimary pt-2 px-6 rounded-full"
      disabled={isDisabled}
    >
      {ctaText}
    </button>
  );
}
