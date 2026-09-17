import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  const body = await request.json();
  const task = await prisma.task.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(task);
}

export async function DELETE(request, { params }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}