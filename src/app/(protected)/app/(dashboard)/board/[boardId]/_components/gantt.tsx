import {
  min,
  max,
  addWeeks,
  startOfWeek,
  differenceInWeeks,
  addDays,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CardWithPeople } from "@/types";
import { CalendarHeader } from "./calendar-header";
import Flow from "./flow";
import { Node } from "reactflow";

interface GanttProps {
  data: CardWithPeople[];
}

export const Gantt = ({ data }: GanttProps) => {
  const container = useRef(null);
  const startDates = data.map((card) => new Date(card.startDate as Date));
  const earliestStartDate = min(startDates);
  const [currentDate, setCurrentDate] = useState(earliestStartDate);
  const [columnWidth, setColumnWidth] = useState(0);

  useEffect(() => {
    const calculateColumnWidth = () => {
      if (container.current) {
        const containerWidth = (container.current as HTMLElement).clientWidth;
        const columnCount = 7; // Assuming 7 columns for a week
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
    index: number,
    nodes: any[]
  ) => {
    const startWeek = startOfWeek(startDate, { weekStartsOn: 1 });
    const currentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const colStart = differenceInWeeks(startWeek, currentWeek);
    const nodesInSameWeek = nodes.filter(
      (node) =>
        differenceInWeeks(
          startOfWeek(new Date(node.data.startDate), { weekStartsOn: 1 }),
          currentWeek
        ) === colStart
    );
    const rowStart = nodesInSameWeek.findIndex(
      (node) => node.id === nodes[index].id
    );

    const endWeek = startOfWeek(endDate, { weekStartsOn: 1 });
    const colEnd = differenceInWeeks(endWeek, currentWeek);
    const colSpan = colEnd - colStart + 1;

    return {
      x: colStart * columnWidth + 5,
      y: rowStart * 75 + 10,
      width: colSpan * columnWidth - 50,
    };
  };

  const nodes = data
    .map((card) => {
      const startDate = new Date(card.startDate as Date);
      const endDate = addDays(new Date(card.dueDate as Date), 1);
      const isEventInPast = endDate < currentDate;

      if (!isEventInPast) {
        return {
          id: card.id,
          data: {
            label: card.title,
            startDate: card.startDate,
          },
        };
      }
      return null;
    })
    .filter((node): node is Node => node !== null);

  nodes.forEach((node, index) => {
    if (!node.data || !node.data.startDate) return;

    const card = data.find((card) => card.id === node.id);
    if (!card || !card.dueDate) return;

    const { x, y, width } = calculateNodePosition(
      new Date(node.data.startDate),
      new Date(card.dueDate),
      index,
      nodes
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

              {/* Events 
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{
                  gridTemplateRows: `1.75rem repeat(${rowsNeeded}, minmax(0, 1fr)) auto`,
                }}
              >
                {data.map((card, index) => {
                  const startDate = new Date(card.startDate as Date);
                  const dueDate = new Date(card.dueDate as Date);
                  const startWeek = startOfWeek(startDate, { weekStartsOn: 1 });
                  const currentWeek = startOfWeek(currentDate, {
                    weekStartsOn: 1,
                  });

                  // Calculate the column position based on the start date
                  const colStart =
                    Math.floor(
                      (startWeek.getTime() - currentWeek.getTime()) /
                        (1000 * 3600 * 24 * 7)
                    ) + 1;

                  // Check if the event's end date is before the start of the current week
                  const isEventInPast = dueDate < currentWeek;

                  // Set a fixed number of rows for each event (e.g., 3 rows)
                  const spanRows = 3 * 24;

                  // Render the event only if it's not in the past
                  if (!isEventInPast) {
                    return (
                      <li
                        key={index}
                        className="relative mt-px flex"
                        style={{
                          gridColumn: `${colStart} / span 1`,
                          gridRow: ` span ${spanRows}`,
                        }}
                      >
                        <a
                          href="#"
                          className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                        >
                          <p className="order-1 font-semibold text-blue-700">
                            {card.title}
                          </p>
                        </a>
                      </li>
                    );
                  }

                  // Return null if the event is in the past
                  return null;
                })}
              </ol>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
