import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const architectures = await prisma.architecture.findMany({
      orderBy: { order: "asc" },
      select: {
        slug: true, name: true, shortName: true,
        icon: true, color: true, description: true, order: true,
      },
    });
    return NextResponse.json(architectures);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}