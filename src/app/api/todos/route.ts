import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const todos = await prisma.todo.findMany({
      where: { userId: decoded.userId },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const { title } = await request.json();

  try {
    const todo = await prisma.todo.create({
      data: { title, userId: decoded.userId },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
