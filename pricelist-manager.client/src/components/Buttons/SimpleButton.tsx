import { Link } from "react-router";

type Props = {
  route: string;
  color: "blue" | "purple" | "yellow" | "green";
  Icon: React.ComponentType<{ className?: string }>;
  className?: string;
};

const bgColor = {
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  yellow: "bg-yellow-600",
  green: "bg-green-600",
};

const SimpleIconButton = ({ route, Icon, color, className = "" }: Props) => {
  return (
    <Link to={route} className={`p-2 rounded ${bgColor[color]} ${className}`}>
      <Icon className="text-white" />
    </Link>
  );
};

export default SimpleIconButton;
