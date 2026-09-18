type TextInputProps = {
  placeholderProp: string;
  valueProp: string | number;
  onChangeProp?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  label: string;
  typeProp?: string;
  styles?: string;
};
export default function TextInput({
  placeholderProp,
  onChangeProp,
  valueProp,
  isDisabled,
  label,
  typeProp,
  styles,
  onBlur,
}: TextInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${styles}`}>
      <label className="font-semibold">{label}</label>
      <input
        type={typeProp ? typeProp : "text"}
        placeholder={placeholderProp}
        value={valueProp}
        onChange={onChangeProp}
        disabled={isDisabled}
        onBlur={onBlur}
        inputMode={typeProp ? "decimal" : "text"}
        className={`bg-surfaceContainer rounded-lg transition-all border border-outline focus:border-outlineFocus outline-none `}
      />
    </div>
  );
}
