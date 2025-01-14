import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("CALLED", id);
  const body = await req.json();

  const studio = await prisma.user.update({
    where: {
      id,
    },
    data: {
      studio: {
        update: {
          screen: body.screen,
          mic: body.mic,
          preset: body.preset,
        },
      },
    },
  });

  if (studio) {
    return NextResponse.json({
      status: 200,
      message: "Studio settings updated!",
    });
  }

  return NextResponse.json({
    status: 400,
    message: "Failed to update studio",
  });
}
