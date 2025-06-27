type Dimensions = {
  startCol?: number;
  endCol?: number;
};

export type QueryDimensions = {
  default: Dimensions;
  sm?: Dimensions;
  md?: Dimensions;
  lg?: Dimensions;
};

type Props = {
  children: React.ReactNode;
  dimensions?: QueryDimensions;
  className?: string;
};

const WidgetBase = ({
  children,
  dimensions = { default: { startCol: 1, endCol: 5 } },
  className,
}: Props) => {
  let gridCols = "";

  if (dimensions) {
    Object.entries(dimensions).forEach(([key, value]) => {
      let prefix = key == "default" ? "" : key + ":";

      gridCols += value.startCol ? `${prefix}col-start-${value.startCol} ` : "";
      gridCols += value.endCol ? `${prefix}col-end-${value.endCol} ` : "";
    });
  }

  return (
    <div
      className={`p-4 rounded border-2 border-gray-700 ${gridCols} ${className}`}
    >
      {children}
    </div>
  );
};

export default WidgetBase;
