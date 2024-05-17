import {
  format,
  endOfWeek,
  eachWeekOfInterval,
  startOfWeek,
  isSameWeek,
} from "date-fns";
import { useRef, useState } from "react";

type CalendarHeaderProps = {
  startDate: Date;
};

export const CalendarHeader = ({ startDate }: CalendarHeaderProps) => {
  const containerNav = useRef(null);
  const [today, _] = useState(new Date());
  const startOfFirstWeek = startOfWeek(startDate, { weekStartsOn: 1 });
  const endOfLastWeek = endOfWeek(
    new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 42
    ),
    { weekStartsOn: 1 }
  );

  const weeks = eachWeekOfInterval(
    {
      start: startOfFirstWeek,
      end: endOfLastWeek,
    },
    { weekStartsOn: 1 }
  );

  return (
    <div
      ref={containerNav}
      className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
    >
      <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
        {weeks.map((weekStart) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          const formattedWeekRange = `${format(weekStart, "M/d")} - ${format(
            weekEnd,
            "M/d"
          )}`;
          const isCurrentWeek = isSameWeek(weekStart, today, {
            weekStartsOn: 1,
          });
          return (
            <div
              key={weekStart.getTime()}
              className="col-span-1 flex justify-center py-3"
            >
              {isCurrentWeek ? (
                <span className="flex h-8 items-center justify-center rounded-full bg-indigo-600 px-2.5 font-semibold text-white">
                  {formattedWeekRange}
                </span>
              ) : (
                <span>{formattedWeekRange}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
        <div className="col-end-1 w-14" />
        {weeks.map((weekStart) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          const formattedWeekRange = `${format(weekStart, "M/d")} - ${format(
            weekEnd,
            "M/d"
          )}`;
          const isCurrentWeek = isSameWeek(weekStart, today, {
            weekStartsOn: 1,
          });
          return (
            <div
              key={weekStart.getTime()}
              className="col-span-1 flex justify-center py-3"
            >
              {isCurrentWeek ? (
                <span className="flex h-8 items-center justify-center rounded-full bg-indigo-600 px-2.5 font-semibold text-white">
                  {formattedWeekRange}
                </span>
              ) : (
                <span>{formattedWeekRange}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
