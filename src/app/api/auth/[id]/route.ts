import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
    console.log("Endpoint hit ✅")
  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
      include: {
        studio: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (userProfile)
      return NextResponse.json({ status: 200, user: userProfile });
    const clerkUserInstance = (await clerkClient()).users.getUser(id);
    const createUser = await prisma.user.create({
      data: {
        clerkId: id,
        email: (await clerkUserInstance).emailAddresses[0].emailAddress,
        firstname: (await clerkUserInstance).firstName,
        lastname: (await clerkUserInstance).lastName,
        studio: {
          create: {},
        },
        workspace: {
          create: {
            name: `${(await clerkUserInstance).firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
        subscription: {
          create: {},
        },
      },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (createUser) return NextResponse.json({ status: 201, user: createUser });
    return NextResponse.json({ status: 400 });
  } catch (error) {
    console.log("Error creating user", error);
  }
}
