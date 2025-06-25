import "dotenv/config"; // this reads that app’s ./apps/ws-backend/.env
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  console.log(parsedData);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({ message: "Incorrect inputs" });
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        // TODO: Hash the password
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });
    res.json({ userId: user.id });
  } catch (e) {
    console.log(e);
    res.status(411).json({
      message: "User already exists with this email",
    });
  }
});

app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({ message: "Incorrect inputs" });
    return;
  }

  // TODO: Compare the hashed passwords here
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

app.post(
  "/room",
  middleware,
  async (req: Request, res: Response): Promise<void> => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.json({ message: "Incorrect inputs" });
      return;
    }
    // @ts-ignore:
    const userId = req.userId;
    console.log(userId);
    try {
      const room = await prismaClient.room.create({
        data: {
          slug: parsedData.data.name,
          adminId: userId,
        },
      });
      res.json({ roomId: room.id });
    } catch (e) {
      res.status(411).json({ message: "Room already exists with this name" });
    }
  }
);
app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });
  res.json({
    messages: messages,
  });
  console.log(messages);
});

app.listen(3001, () => {
  console.log("Server running on port 3001 ");
});
