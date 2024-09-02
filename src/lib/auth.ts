import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
  } catch (error) {
    return null;
  }
}

export function withAuth(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    userId: number
  ) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    await handler(req, res, decoded.userId);
  };
}
