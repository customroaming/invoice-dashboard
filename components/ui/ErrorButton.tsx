type ErrorButtonProps = {
  ctaText: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  styles?: string;
};
export default function ErrorButton({
  ctaText,
  onClick,
  isDisabled,
  styles,
}: ErrorButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`border-error border text-error text-xl leading-none md:leading-normal transition-all cursor-pointer font-manrope capitalize w-fit  hover:bg-error/75 hover:text-onError py-2 px-4 md:py-3 md:px-8 ${styles} rounded-full`}
      disabled={isDisabled}
    >
      {ctaText}
    </button>
  );
}
