import { NextRequest, NextResponse } from "next/server";
import {prisma }from "@/lib/prisma";

export async function POST(req: NextRequest, { params}: {params: { id: string }}) {
    try {
        const body = await req.json();
        const { id } = params;

        const completeProcessing = await prisma.video.update({
            where: {
                userId: id,
                source: body.filename
            },
            data: {
                processing: false
            }
        })

        if (completeProcessing) {
            console.log("🟢 Processing Complete")
            return NextResponse.json({ status: 200 })
        }

        console.log("🔴 Something went wrong")
        return NextResponse.json({ status: 400 })
    } catch (error) {
        console.log("🔴 Processing failed")
        return NextResponse.json({ status: 400 })
    }
}