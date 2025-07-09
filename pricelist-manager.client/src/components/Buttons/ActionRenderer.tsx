import type { IconType } from "react-icons/lib";
import type { AllowedColors } from "../../types";
import SimpleIconButton from "./SimpleButton";
import ActionButton, { type ModalConfig } from "./ActionButton";

export type Action = ActionButton | ActionLink;

interface ActionBase {
  color: AllowedColors;
  Icon: IconType;
  text?: string;
  className?: string;
}

interface ActionButton extends ActionBase {
  type: "button";
  confirmColor?: AllowedColors;
  handler: () => void;
  modalConfig?: ModalConfig;
}

interface ActionLink extends ActionBase {
  type: "link";
  route: string;
}

type Props = {
  actions: Action[];
};

const ActionRenderer = ({ actions }: Props) => {
  return (
    <>
      {actions.map((action, index) => {
        switch (action.type) {
          case "link":
            return (
              <SimpleIconButton
                key={index}
                Icon={action.Icon}
                color={action.color}
                route={action.route}
                text={action.text}
                className={action.className}
              />
            );
          case "button":
            return (
              <ActionButton
                key={index}
                callback={action.handler}
                Icon={action.Icon}
                text={action.text}
                color={action.color}
                modalConfig={action.modalConfig}
                className={action.className}
              />
            );
        }
      })}
    </>
  );
};

export default ActionRenderer;
