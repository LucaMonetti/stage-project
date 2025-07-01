import type { IconType } from "react-icons/lib";
import type { AllowedColors } from "../../types";
import SimpleIconButton from "./SimpleButton";

export type Action = {
  color: AllowedColors;
  Icon: IconType;
  route: string;
  text?: string;
};

type Props = {
  actions: Action[];
};

const ActionRenderer = ({ actions }: Props) => {
  return (
    <>
      {actions.map((action, index) => (
        <SimpleIconButton
          key={index}
          Icon={action.Icon}
          color={action.color}
          route={action.route}
          text={action.text}
        />
      ))}
    </>
  );
};

export default ActionRenderer;
