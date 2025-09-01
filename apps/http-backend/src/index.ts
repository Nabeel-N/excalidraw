// server.ts
import "dotenv/config";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { JWT_SECRET } from "./config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

async function main() {
  // Dynamically import bcrypt-ts (ESM). This avoids CommonJS/ESM mismatch issues.
  // If you prefer to use bcryptjs (CJS) instead, replace this with:
  // import bcrypt from "bcryptjs";
  const bcryptModule = await import("bcrypt-ts");
  const bcrypt: any = (bcryptModule as any).default ?? bcryptModule;

  const app = express();
  app.use(express.json());
  app.use(cors());

  app.post("/signup", async (req: Request, res: Response): Promise<void> => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Incorrect inputs" });
      return;
    }

    const { username, password, name } = parsedData.data;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prismaClient.user.create({
        data: {
          email: username,
          password: hashedPassword,
          name,
        },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({ token });
    } catch (e: any) {
      console.error("signup error:", e);
      // 409 conflict for existing resource
      res.status(409).json({
        message: "User already exists with this email",
      });
    }
  });

  app.post("/signin", async (req: Request, res: Response): Promise<void> => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Incorrect inputs" });
      return;
    }

    const { username, password } = parsedData.data;

    try {
      const user = await prismaClient.user.findFirst({
        where: {
          email: username,
        },
      });

      if (!user) {
        res.status(403).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(403).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({ token });
    } catch (err: any) {
      console.error("signin error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post(
    "/room",
    middleware,
    async (req: Request, res: Response): Promise<void> => {
      const parsedData = CreateRoomSchema.safeParse(req.body);
      if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
      }

      const userId = (req as any).userId as string | undefined;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      try {
        const room = await prismaClient.room.create({
          data: {
            slug: parsedData.data.name,
            adminId: userId,
          },
        });
        res.json({ roomId: room.id });
      } catch (e: any) {
        console.error("create room error:", e);
        res.status(409).json({ message: "Room already exists with this name" });
      }
    }
  );

  app.get("/chats/:roomId", async (req: Request, res: Response) => {
    const roomId = Number(req.params.roomId);
    if (Number.isNaN(roomId)) {
      res.status(400).json({ message: "Invalid roomId" });
      return;
    }

    try {
      const messages = await prismaClient.chat.findMany({
        where: {
          roomId: roomId,
        },
        orderBy: {
          id: "desc",
        },
        take: 1000,
      });
      res.json({ messages });
    } catch (err: any) {
      console.error("fetch chats error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/room/:slug", async (req: Request, res: Response) => {
    const slug = req.params.slug;
    try {
      const room = await prismaClient.room.findFirst({
        where: {
          slug,
        },
      });

      res.json({ room });
    } catch (err: any) {
      console.error("fetch room error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
