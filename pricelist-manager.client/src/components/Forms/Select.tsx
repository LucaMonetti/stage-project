type Props = {
  id: string;
  label: string;
  className?: string;
};

const Select = ({ id, label, className }: Props) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select
        name={id}
        id={id}
        className={`border-2 border-gray-700 rounded px-4 py-2 bg-gray-900 ${className}`}
      />
    </>
  );
};

export default Select;
