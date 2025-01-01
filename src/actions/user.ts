"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string);

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smpt.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    to,
    subject,
    text,
    html,
  };

  return { transporter, mailOptions };
};

export const handleAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkId: user.id,
            },
          },
        },
      },
    });

    if (existingUser) {
      return { status: 200, user: existingUser };
    }

    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (newUser) {
      return { status: 201, user: newUser };
    }

    return { status: 403 };
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
};
export const getNotifications = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 404 };
    }

    const notifications = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notifications && notifications.notification.length > 0) {
      return { status: 200, data: notifications };
    }

    return { status: 404, data: [] };
  } catch (error) {
    console.log(error);
    return { status: 403, data: [] };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 404 };
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        NOT: [{ clerkId: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    });

    if (users && users.length > 0) {
      return { status: 200, data: users };
    }

    return { status: 404, data: undefined };
  } catch (error) {
    return { status: 500, data: undefined };
  }
};

export const getPaymentInfo = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const payment = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    });

    if (payment) return { status: 200, data: payment };
  } catch (error) {
    return { status: 400 };
  }
};

export const getFirstView = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const userData = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        firstView: true,
      },
    });
    if (userData) return { status: 200, data: userData.firstView };
    return { status: 404, data: false };
  } catch (error) {
    return { status: 400 };
  }
};

export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const view = await prisma.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        firstView: state,
      },
    });
    if (view) {
      return { status: 200, data: "Setting updated" };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      });

      if (reply) return { status: 200, data: "Reply posted" };
    }

    const newComment = await prisma.comment.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    });

    if (newComment) return { status: 200, data: "New comment added" };
  } catch (error) {
    return { status: 400 };
  }
};

export const getUserProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const profileIdAndImage = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    });

    if (profileIdAndImage) return { status: 200, data: profileIdAndImage };
  } catch (error) {
    return { status: 400 };
  }
};

export const getVideoComments = async (Id: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    });

    return { status: 200, data: comments };
  } catch (error) {
    return { status: 400 };
  }
};

export const inviteMembers = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const senderInfo = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });
    if (senderInfo?.id) {
      const workspace = await prisma.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      });
      if (workspace) {
        const invitation = await prisma.invite.create({
          data: {
            senderId: senderInfo.id,
            recieverId,
            workSpaceId: workspaceId,
            content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
          },
          select: {
            id: true,
          },
        });

        await prisma.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstname} into ${workspace.name}`,
              },
            },
          },
        });
        if (invitation) {
          const { transporter, mailOptions } = await sendEmail(
            email,
            "You got an invitation",
            `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
          );

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("🔴", error.message);
            } else {
              console.log("✅ Email sent", info);
            }
          });
          return { status: 200, data: "Invite sent" };
        }
        return { status: 400, data: "invitation failed" };
      }
      return { status: 404, data: "workspace not found" };
    }
    return { status: 404, data: "recipient not found" };
  } catch (error) {
    console.log(error);
    return { status: 400, data: "Oops! something went wrong" };
  }
};

export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser();
    if (!user)
      return {
        status: 404,
      };
    const invitation = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        reciever: {
          select: {
            clerkId: true,
          },
        },
      },
    });

    if (user.id !== invitation?.reciever?.clerkId) return { status: 401 };
    const acceptInvite = prisma.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    });

    const updateMember = prisma.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    });

    const membersTransaction = await prisma.$transaction([
      acceptInvite,
      updateMember,
    ]);

    if (membersTransaction) {
      return { status: 200 };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 400 };
  }
};

export const completeSubscription = async (sessionId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session) {
      const customer = await prisma.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          subscription: {
            update: {
              data: {
                customerId: session.customer as string,
                plan: "PRO",
              },
            },
          },
        },
      });

      if (customer) {
        return { status: 200, data: customer };
      }
    }
    return { status: 404 };
  } catch (error) {
    return { status: 400 };
  }
};
