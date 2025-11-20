import { CalendarEvent } from "../../types/Event";
import { format, startOfDay, differenceInMinutes } from "date-fns";

interface Props {
  days: Date[];
  hours: number[];
  events: CalendarEvent[];
  onSlotClick: (day: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const WeekGrid: React.FC<Props> = ({
  days,
  hours,
  events,
  onSlotClick,
  onEventClick,
}) => {
  const now = new Date();

  const totalMinutesInDay = 24 * 60;

  const getEventStyle = (ev: CalendarEvent) => {
    const start = new Date(ev.start);
    const end = new Date(ev.end);
    const startMinutes = differenceInMinutes(start, startOfDay(start));
    const duration = Math.max(
      differenceInMinutes(end, start),
      15 // minimum height
    );
    const top = (startMinutes / totalMinutesInDay) * 100;
    const height = (duration / totalMinutesInDay) * 100;
    return {
      top: `${top}%`,
      height: `${height}%`,
    };
  };

  return (
    <div className="flex flex-1 overflow-auto">
      {/* Time column */}
      <div className="w-14 border-r bg-white">
        <div className="h-10" />
        {hours.map((h) => (
          <div key={h} className="h-16 relative text-xs text-right pr-1">
            <span className="absolute -top-2 right-1 text-gray-400">
              {h === 0
                ? ""
                : format(new Date().setHours(h, 0, 0, 0), "ha").toLowerCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="flex-1 grid grid-cols-7 border-l border-t bg-white">
        {days.map((day) => {
          const isToday =
            day.toDateString() === now.toDateString();

          const dayEvents = events.filter(
            (e) => new Date(e.start).toDateString() === day.toDateString()
          );

          const minutesNow =
            differenceInMinutes(now, startOfDay(now));

          const currentLineTop =
            (minutesNow / totalMinutesInDay) * 100;

          return (
            <div
              key={day.toISOString()}
              className={`relative border-r last:border-r-0`}
            >
              {/* Day header */}
              <div
                className={`sticky top-0 z-10 flex flex-col items-center py-2 border-b bg-white ${
                  isToday ? "text-blue-600" : "text-gray-700"
                }`}
              >
                <span className="text-xs">
                  {format(day, "EEE")}
                </span>
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${
                    isToday ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Time slots clickable */}
              <div className="relative h-[calc(100%-40px)]">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="h-16 border-b border-gray-100 hover:bg-blue-50/40 cursor-pointer"
                    onClick={() => onSlotClick(day, h)}
                  />
                ))}

                {/* current time line */}
                {isToday && (
                  <div
                    className="absolute left-0 right-0 h-[2px] bg-red-500"
                    style={{ top: `${currentLineTop}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1" />
                  </div>
                )}

                {/* Events */}
                {dayEvents.map((ev) => (
                  <button
                    key={ev._id}
                    className="absolute left-[5%] right-[5%] rounded-md text-xs px-1 py-0.5 text-white shadow-sm overflow-hidden"
                    style={{
                      ...getEventStyle(ev),
                      backgroundColor: ev.color || "#3b82f6",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev);
                    }}
                  >
                    <div className="font-semibold truncate">
                      {ev.title}
                    </div>
                    <div className="text-[10px] truncate">
                      {format(new Date(ev.start), "HH:mm")} –{" "}
                      {format(new Date(ev.end), "HH:mm")}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekGrid;
