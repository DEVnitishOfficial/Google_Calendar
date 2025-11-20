import { useEffect, useState } from "react";
import { CalendarEvent } from "../../types/Event";
import { formatISO } from "date-fns";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialEvent: CalendarEvent | null;
  slotInfo: { start: Date; end: Date } | null;
  onSave: (payload: {
    _id?: string;
    title: string;
    description?: string;
    start: string;
    end: string;
    color?: string;
  }) => void;
  onDelete?: () => void;
}

const EventModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialEvent,
  slotInfo,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState("#3b82f6");

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description || "");
      setStart(initialEvent.start.slice(0, 16)); // yyyy-MM-ddTHH:mm
      setEnd(initialEvent.end.slice(0, 16));
      setColor(initialEvent.color || "#3b82f6");
    } else if (slotInfo) {
      setTitle("");
      setDescription("");
      setStart(formatISO(slotInfo.start).slice(0, 16));
      setEnd(formatISO(slotInfo.end).slice(0, 16));
      setColor("#3b82f6");
    }
  }, [initialEvent, slotInfo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !start || !end) return;
    const payload: any = {
      title,
      description,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      color,
    };
    if (initialEvent && initialEvent._id) {
      payload._id = initialEvent._id;
    }
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            {initialEvent ? "Edit event" : "Create event"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              className="mt-1 w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting, task, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start
              </label>
              <input
                type="datetime-local"
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End
              </label>
              <input
                type="datetime-local"
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="color"
              className="mt-1 w-10 h-8 border rounded-md p-1"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 text-sm rounded-md border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
