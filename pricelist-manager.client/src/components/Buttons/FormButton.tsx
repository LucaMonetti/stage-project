import { Link } from "react-router";

type Props = {
  formId: string;
  color: "blue" | "purple" | "yellow" | "green";
  Icon?: React.ComponentType<{ className?: string }>;
  text?: string;
  className?: string;
  disabled?: boolean;
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
}: Props) => {
  return (
    <button
      type="submit"
      form={formId}
      className={`p-2 rounded flex gap-2 items-center ${bgColor[color]} ${className}`}
      {...(disabled ? { disabled: true } : "")}
    >
      {Icon && <Icon className="text-white" />}
      {text}
    </button>
  );
};

export default FormButton;
