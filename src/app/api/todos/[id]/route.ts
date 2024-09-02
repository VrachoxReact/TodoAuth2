import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const id = parseInt(params.id);

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== decoded.userId) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const id = parseInt(params.id);

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== decoded.userId) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
