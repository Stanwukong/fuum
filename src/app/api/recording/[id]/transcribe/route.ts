import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        // WIP: Setup AI agent
        const body = await req.json();
        const { id } = params;

        const content = JSON.parse(body.content);

        const transcribed = await prisma?.video.update({
            where: {
                userId: id,
                source: body.filename
            },
            data: {
                title: content.title,
                description: content.summary,
                summary: body.transcript,
            }
        })

        if (transcribed) {
            console.log("🟢 Transcribed")
            return NextResponse.json({ status: 200 })
        }

        console.log("🔴 Something went wrong")
        return NextResponse.json({ status: 400 })
    } catch (error) {
        console.log("🔴 Transcription failed")
        return NextResponse.json({ status: 400 })
    }
}
