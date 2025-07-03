interface InputProps {
  classname: string;
  type: string;
  placeholder: string;
}

export function Input({ type, placeholder, classname }: InputProps) {
  return <input type={type} placeholder={placeholder} className={classname} />;
}
