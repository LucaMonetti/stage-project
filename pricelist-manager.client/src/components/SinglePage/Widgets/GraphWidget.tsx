import WidgetBase, { type QueryDimensions } from "./WidgetBase";
import { LineChart } from "@mui/x-charts/LineChart";

type Props = {
  dimensions?: QueryDimensions;
};
const GraphWidget = ({ dimensions }: Props) => {
  return (
    <WidgetBase dimensions={dimensions}>
      <LineChart
        series={[{ data: [null, null, 10, 11, 12] }]}
        xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6] }]}
      />
    </WidgetBase>
  );
};

export default GraphWidget;
