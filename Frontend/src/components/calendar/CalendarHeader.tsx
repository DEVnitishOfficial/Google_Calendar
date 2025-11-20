import { format, startOfWeek, endOfWeek } from "date-fns";

interface Props {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<Props> = ({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onToday,
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const rangeLabel =
    format(weekStart, "MMM d") +
    " – " +
    (weekStart.getMonth() === weekEnd.getMonth()
      ? format(weekEnd, "d, yyyy")
      : format(weekEnd, "MMM d, yyyy"));

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium"
          onClick={onToday}
        >
          Today
        </button>
        <div className="flex items-center border rounded-full">
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-full"
            onClick={onPrevWeek}
          >
            ‹
          </button>
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-full"
            onClick={onNextWeek}
          >
            ›
          </button>
        </div>
        <div className="ml-4 text-xl font-semibold text-gray-800">
          {rangeLabel}
        </div>
      </div>
      <div className="text-sm text-gray-500 font-medium">
        Week view
      </div>
    </header>
  );
};

export default CalendarHeader;
