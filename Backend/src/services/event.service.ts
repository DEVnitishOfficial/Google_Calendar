import { EventModel, IEvent } from "../models/event.model";

export const getEventsForRange = async (
  userId: string,
  start: Date,
  end: Date
): Promise<IEvent[]> => {
  return EventModel.find({
    userId,
    start: { $lt: end },
    end: { $gt: start }, // overlapping
  }).exec();
};

export const createEvent = async (data: {
  userId: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
}): Promise<IEvent> => {
  const event = new EventModel(data);
  return event.save();
};

export const updateEvent = async (
  id: string,
  userId: string,
  updates: Partial<IEvent>
): Promise<IEvent | null> => {
  return EventModel.findOneAndUpdate({ _id: id, userId }, updates, {
    new: true,
  }).exec();
};

export const deleteEvent = async (
  id: string,
  userId: string
): Promise<IEvent | null> => {
  return EventModel.findOneAndDelete({ _id: id, userId }).exec();
};
