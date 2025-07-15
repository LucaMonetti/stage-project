import { Link } from "react-router";
import BasicLoader from "../Loader/BasicLoader";

type Props = {
  formId: string;
  color: "blue" | "purple" | "yellow" | "green";
  Icon?: React.ComponentType<{ className?: string }>;
  text?: string;
  className?: string;
  disabled?: boolean;
  isPending?: boolean;
};

const bgColor = {
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  yellow: "bg-yellow-600",
  green: "bg-green-600",
};

const FormButton = ({
  formId,
  Icon,
  color,
  className = "",
  disabled,
  text = "Aggiungi",
  isPending = false,
}: Props) => {
  return (
    <button
      type="submit"
      form={formId}
      className={`p-2 rounded flex gap-2 items-center ${bgColor[color]} ${className}`}
      {...(disabled ? { disabled: true } : "")}
    >
      {isPending ? (
        <BasicLoader />
      ) : (
        <>
          {Icon && <Icon className="text-white" />}
          {text}
        </>
      )}
    </button>
  );
};

export default FormButton;
