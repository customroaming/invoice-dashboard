type TextAreaInputProps = {
  placeholderProp: string;
  valueProp: string;
  onChangeProp: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isDisabled?: boolean;
  label: string;
  styles?: string;
};
export default function TextAreaInput({
  placeholderProp,
  onChangeProp,
  valueProp,
  isDisabled,
  label,
  styles,
}: TextAreaInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${styles}`}>
      <label className="font-semibold">{label}</label>
      <textarea
        placeholder={placeholderProp}
        value={valueProp}
        onChange={onChangeProp}
        disabled={isDisabled}
        className="bg-surfaceContainer rounded-lg transition-all border border-outline focus:border-outlineFocus outline-none"
      ></textarea>
    </div>
  );
}
