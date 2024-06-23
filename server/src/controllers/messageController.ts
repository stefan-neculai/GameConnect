import { Request, Response } from "express";
import Message from "../models/Message"; // Adjust the import path according to your project structure

export const getMessages = async (req: Request, res: Response) => {
  // get receiver and sender
  const {receiver, sender } = req.query;
  try {
    // get messages between the receiver and sender
    console.log(receiver, sender)
    const messages = await Message.find({receiver: { $in: [receiver, sender] }, sender: { $in: [receiver, sender] }});
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(message);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const message = new Message({
    receiver: req.params.id,
    content: req.body.content,
    sender: user.id, // This should be determined by your authentication logic
    createdAt: new Date(),
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(message);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
