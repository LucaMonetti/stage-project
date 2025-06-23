type Props = {
  children?: React.ReactNode;
  name?: string;
};

const Fieldset = ({ children, name }: Props) => {
  return (
    <fieldset className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-md px-8 py-4 flex flex-col gap-4">
      {name && <legend className="p-2 text-xl">{name}</legend>}
      {children}
    </fieldset>
  );
};

export default Fieldset;
