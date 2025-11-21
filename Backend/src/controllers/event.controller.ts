import { Request, Response } from "express";
import * as eventService from "../services/event.service";
import { internalServerError } from "../utils/errors/app.error";

const DEMO_USER_ID = "demo-user";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
     res.status(400).json({ message: "start and end query required" });
    }

    const startDate = new Date(start as string);
    const endDate = new Date(end as string);

    const events = await eventService.getEventsForRange(
      DEMO_USER_ID,
      startDate,
      endDate
    );

    res.json(events);
  } catch (err) {
    console.error(err);
    throw new internalServerError("Server error occurred while fetching events");
  }
};

export const postEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, start, end, color } = req.body;

    if (!title || !start || !end) {
     res.status(400).json({ message: "title, start, end required" });
    }

    const event = await eventService.createEvent({
      userId: DEMO_USER_ID,
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      color,
    });

    res.status(201).json({
        success:true,
        message : "Event created successfully",
        data:event
    });
  } catch (err) {
    console.error(err);
    throw new internalServerError("Server error occurred while creating event");
  }
};

export const putEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updates: any = {};
    ["title", "description", "start", "end", "color"].forEach((key) => {
      if (req.body[key] !== undefined) {
        updates[key] =
          key === "start" || key === "end"
            ? new Date(req.body[key])
            : req.body[key];
      }
    });

    const updated = await eventService.updateEvent(id, DEMO_USER_ID, updates);

    if (!updated) {
     res.status(404).json({ message: "Event not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    throw new internalServerError("Server error occurred while updating event");
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await eventService.deleteEvent(id, DEMO_USER_ID);

    if (!deleted) {
     res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    throw new internalServerError("Server error occurred while deleting event");
  }
};
