type Props = {
  children?: React.ReactNode;
  className?: string;
  name?: string;
};

const Fieldset = ({ children, name, className }: Props) => {
  return (
    <fieldset
      className={`flex-1 bg-gray-800 border-2 border-gray-700 rounded-md px-8 py-4 flex gap-4 ${className}`}
    >
      {name && <legend className="p-2 text-xl">{name}</legend>}
      {children}
    </fieldset>
  );
};

export default Fieldset;
