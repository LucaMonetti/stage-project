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

const responsiveGridClasses = {
  default: {
    start: {
      1: "col-start-1",
      2: "col-start-2",
      3: "col-start-3",
      4: "col-start-4",
      5: "col-start-5",
      6: "col-start-6",
      7: "col-start-7",
      8: "col-start-8",
      9: "col-start-9",
      10: "col-start-10",
      11: "col-start-11",
      12: "col-start-12",
    },
    end: {
      1: "col-end-1",
      2: "col-end-2",
      3: "col-end-3",
      4: "col-end-4",
      5: "col-end-5",
      6: "col-end-6",
      7: "col-end-7",
      8: "col-end-8",
      9: "col-end-9",
      10: "col-end-10",
      11: "col-end-11",
      12: "col-end-12",
      13: "col-end-13",
    },
  },
  sm: {
    start: {
      1: "sm:col-start-1",
      2: "sm:col-start-2",
      3: "sm:col-start-3",
      4: "sm:col-start-4",
      5: "sm:col-start-5",
      6: "sm:col-start-6",
      7: "sm:col-start-7",
      8: "sm:col-start-8",
      9: "sm:col-start-9",
      10: "sm:col-start-10",
      11: "sm:col-start-11",
      12: "sm:col-start-12",
    },
    end: {
      1: "sm:col-end-1",
      2: "sm:col-end-2",
      3: "sm:col-end-3",
      4: "sm:col-end-4",
      5: "sm:col-end-5",
      6: "sm:col-end-6",
      7: "sm:col-end-7",
      8: "sm:col-end-8",
      9: "sm:col-end-9",
      10: "sm:col-end-10",
      11: "sm:col-end-11",
      12: "sm:col-end-12",
      13: "sm:col-end-13",
    },
  },
  md: {
    start: {
      1: "md:col-start-1",
      2: "md:col-start-2",
      3: "md:col-start-3",
      4: "md:col-start-4",
      5: "md:col-start-5",
      6: "md:col-start-6",
      7: "md:col-start-7",
      8: "md:col-start-8",
      9: "md:col-start-9",
      10: "md:col-start-10",
      11: "md:col-start-11",
      12: "md:col-start-12",
    },
    end: {
      1: "md:col-end-1",
      2: "md:col-end-2",
      3: "md:col-end-3",
      4: "md:col-end-4",
      5: "md:col-end-5",
      6: "md:col-end-6",
      7: "md:col-end-7",
      8: "md:col-end-8",
      9: "md:col-end-9",
      10: "md:col-end-10",
      11: "md:col-end-11",
      12: "md:col-end-12",
      13: "md:col-end-13",
    },
  },
  lg: {
    start: {
      1: "lg:col-start-1",
      2: "lg:col-start-2",
      3: "lg:col-start-3",
      4: "lg:col-start-4",
      5: "lg:col-start-5",
      6: "lg:col-start-6",
      7: "lg:col-start-7",
      8: "lg:col-start-8",
      9: "lg:col-start-9",
      10: "lg:col-start-10",
      11: "lg:col-start-11",
      12: "lg:col-start-12",
    },
    end: {
      1: "lg:col-end-1",
      2: "lg:col-end-2",
      3: "lg:col-end-3",
      4: "lg:col-end-4",
      5: "lg:col-end-5",
      6: "lg:col-end-6",
      7: "lg:col-end-7",
      8: "lg:col-end-8",
      9: "lg:col-end-9",
      10: "lg:col-end-10",
      11: "lg:col-end-11",
      12: "lg:col-end-12",
      13: "lg:col-end-13",
    },
  },
};

const WidgetBase = ({
  children,
  dimensions = { default: { startCol: 1, endCol: 5 } },
  className,
}: Props) => {
  let gridCols = "";

  if (dimensions) {
    Object.entries(dimensions).forEach(([key, value]) => {
      const prefix = key as keyof typeof responsiveGridClasses;

      if (typeof value.startCol === "number") {
        const startClass =
          responsiveGridClasses[prefix]?.start[
            value.startCol as keyof (typeof responsiveGridClasses)[typeof prefix]["start"]
          ];
        if (startClass) {
          gridCols += `${startClass} `;
        }
      }

      if (typeof value.endCol === "number") {
        const endClass =
          responsiveGridClasses[prefix]?.end[
            value.endCol as keyof (typeof responsiveGridClasses)[typeof prefix]["end"]
          ];
        if (endClass) {
          gridCols += `${endClass} `;
        }
      }
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
