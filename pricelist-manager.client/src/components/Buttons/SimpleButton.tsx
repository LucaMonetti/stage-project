import { Link } from "react-router";

type Props = {
  route: string;
  color: "blue" | "purple" | "yellow" | "green";
  Icon: React.ComponentType<{ className?: string }>;
  className?: string;
  text?: string;
};

const bgColor = {
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  yellow: "bg-yellow-600",
  green: "bg-green-600",
};

const SimpleIconButton = ({
  route,
  Icon,
  color,
  className = "",
  text,
}: Props) => {
  return (
    <Link
      to={route}
      className={`p-2 rounded flex items-center gap-2 ${bgColor[color]} ${className}`}
    >
      <Icon className="text-white" />
      {text && <p>{text}</p>}
    </Link>
  );
};

export default SimpleIconButton;
