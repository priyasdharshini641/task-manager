import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId || null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(tasks);
}

export async function POST(request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const body = await request.json();
  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description || '',
      priority: body.priority || 'medium',
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      userId,
    },
  });
  return NextResponse.json(task);
}