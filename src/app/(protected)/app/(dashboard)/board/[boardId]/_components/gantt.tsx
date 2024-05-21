import { min, addWeeks, startOfWeek, differenceInWeeks } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CardWithPeople } from "@/types";
import { CalendarHeader } from "./calendar-header";
import Flow from "./flow";
import { Node } from "reactflow";
import Empty from "./empty";

interface GanttProps {
  data: CardWithPeople[];
}

export const Gantt = ({ data }: GanttProps) => {
  const container = useRef(null);
  const startDates = data
    .map((card) => card.startDate)
    .filter((startDate) => startDate !== null)
    .map((startDate) => new Date(startDate as Date));

  const earliestStartDate = min(startDates);
  console.log(earliestStartDate);
  const [currentDate, setCurrentDate] = useState(earliestStartDate);
  const [columnWidth, setColumnWidth] = useState(0);

  useEffect(() => {
    const calculateColumnWidth = () => {
      if (container.current) {
        const containerWidth = (container.current as HTMLElement).clientWidth;
        const columnCount = 7; // Assuming 7 columns for each week
        const newColumnWidth = containerWidth / columnCount;
        setColumnWidth(newColumnWidth);
      }
    };

    calculateColumnWidth();
    window.addEventListener("resize", calculateColumnWidth);
    return () => {
      window.removeEventListener("resize", calculateColumnWidth);
    };
  }, []);

  const calculateNodePosition = (
    startDate: Date,
    endDate: Date,
    index: number
  ) => {
    const startWeek = startOfWeek(startDate, { weekStartsOn: 1 });
    const currentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const colStart = differenceInWeeks(startWeek, currentWeek);
    const rowStart = index;
    const endWeek = startOfWeek(endDate, { weekStartsOn: 1 });
    const colEnd = differenceInWeeks(endWeek, currentWeek);
    const colSpan = colEnd - colStart + 1;

    return {
      x: colStart === 0 ? colStart * columnWidth + 5 : colStart * columnWidth,
      y: rowStart * 75 + 10,
      width: colSpan * columnWidth - 75,
    };
  };

  const nodes = data
    .map((card) => {
      return {
        id: card.id,
        data: {
          label: card.title,
          startDate: card.startDate,
          dueDate: card.dueDate,
        },
      };
    })
    .filter(
      (node): node is Node =>
        node?.data.startDate !== null &&
        node?.data.startDate !== undefined &&
        node?.data.dueDate !== undefined
    );

  nodes.forEach((node, index) => {
    const { x, y, width } = calculateNodePosition(
      new Date(node.data.startDate),
      new Date(node.data.dueDate),
      index
    );

    node.position = { x, y };
    node.style = { width };
  });

  const handlePrevWeek = () => {
    setCurrentDate(addWeeks(currentDate, -1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  if (data.length === 0) {
    return <Empty />;
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime="2022-01">January 2022</time>
        </h1>

        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              onClick={handlePrevWeek}
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous week</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              onClick={handleNextWeek}
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next week</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div
        ref={container}
        className="isolate flex flex-auto flex-col overflow-auto bg-white"
      >
        <div
          style={{ width: "165%" }}
          className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <CalendarHeader startDate={currentDate} />
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              <Flow nodes={nodes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
