import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  userId: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    color: { type: String, default: "#3b82f6" }, // tailwind blue-500 style
  },
  { timestamps: true }
);

export const EventModel = mongoose.model<IEvent>("Event", EventSchema);
