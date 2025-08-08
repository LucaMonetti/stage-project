import WidgetBase, { type QueryDimensions } from "./WidgetBase";
import { FaTag } from "react-icons/fa6";
import type { Action } from "../../Buttons/ActionRenderer";
import ActionRenderer from "../../Buttons/ActionRenderer";

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  callout?: React.ReactNode;
  CalloutIcon?: React.ComponentType<{ className?: string }>;
  actions: Action[];
  dimensions?: QueryDimensions;
};

const InfoWidget = ({
  title,
  subtitle,
  callout,
  actions,
  CalloutIcon = FaTag,
  dimensions,
}: Props) => {
  return (
    <WidgetBase
      dimensions={dimensions}
      className="flex justify-between gap-4 flex-wrap-reverse"
    >
      <div>
        {title && <h1 className="font-medium text-3xl">{title}</h1>}
        {subtitle && <p className="text-gray-400 mb-4">{subtitle}</p>}
        {callout && (
          <div className="inline-block px-2 py-1 bg-blue-600 rounded text-sm font-mono">
            <CalloutIcon className="inline" />
            <p className="inline ml-2">{callout}</p>
          </div>
        )}
      </div>
      <div className="flex gap-4 flex-wrap items-start">
        <ActionRenderer actions={actions} />
      </div>
    </WidgetBase>
  );
};

export default InfoWidget;
