// src/index.ts
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

    // Accept either `email` or legacy `username` key
    const raw = parsedData.data as any;
    const email = raw.email ?? raw.username;
    const password = raw.password;
    const name = raw.name;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    try {
      // Check if user already exists to avoid P2002 on create
      const existingUser = await prismaClient.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        res
          .status(409)
          .json({ message: "User already exists with this email" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prismaClient.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({ token });
    } catch (e: any) {
      console.error("signup error:", e);
      // handle Prisma unique constraint (race condition)
      if (e?.code === "P2002") {
        res
          .status(409)
          .json({ message: "User already exists with this email" });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.post("/signin", async (req: Request, res: Response): Promise<void> => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Incorrect inputs" });
      return;
    }

    const raw = parsedData.data as any;
    const email = raw.email ?? raw.username;
    const password = raw.password;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    try {
      const user = await prismaClient.user.findUnique({
        where: { email },
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

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
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
        const rawName = (parsedData.data as any).name as string;
        const slug = String(rawName)
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 100);

        const room = await prismaClient.room.create({
          data: {
            slug,
            adminId: userId,
          },
        });
        res.json({ roomId: room.id });
      } catch (e: any) {
        console.error("create room error:", e);
        if (e?.code === "P2002") {
          res
            .status(409)
            .json({ message: "Room already exists with this name" });
        } else {
          res.status(500).json({ message: "Server error" });
        }
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

  const PORT = process.env.PORT ? Number(process.env.PORT) : 3005;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
