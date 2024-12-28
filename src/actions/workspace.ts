"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const verifyAccessToWorkSpace = async (workspaceId: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 403 };
    }

    const isUserInWorkspace = await prisma.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkId: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkId: user.id,
                },
              },
            },
          },
        ],
      },
    });

    return { status: 200, data: { workspace: isUserInWorkspace } };
  } catch (error) {
    return { status: 500, error, data: { workspace: null } };
  }
};

export const getWorkSpaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await prisma.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders };
    }

    return { status: 404, data: [] };
  } catch (error) {
    console.log(error);
    return { status: 403, data: [] };
  }
};

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 404 };
    }

    const videos = await prisma.video.findMany({
      where: {
        OR: [{ workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (videos && videos.length > 0) {
      return { status: 200, data: videos };
    }

    return { status: 404, data: [] };
  } catch (error) {
    console.log(error);
    return { status: 403, data: [] };
  }
};

export const getWorkspaces = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 404 };
    }

    const workspaces = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (workspaces) {
      return { status: 200, data: workspaces };
    }

    return { status: 404, data: [] };
  } catch (error) {
    console.log(error);
    return { status: 403, data: [] };
  }
};

export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const authorized = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (authorized?.subscription?.plan === "PRO") {
      const workspace = await prisma.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: "PUBLIC",
            },
          },
        },
      });

      if (workspace) {
        return { status: 201, data: "Workspace created!" };
      }
    }

    return {
      status: 401,
      data: "You are not authorized to create a workspace",
    };
  } catch (error) {
    return { status: 400 };
  }
};

export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    });

    if (folder) {
      return { status: 200, data: "Folder renamed!" };
    }

    return { status: 400, data: "Folder does not exist!" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong!" };
  }
};

export const createFolder = async (workSpaceId: string) => {
  try {
    const isNewFolder = await prisma.workSpace.update({
      where: {
        id: workSpaceId,
      },
      data: {
        folders: {
          create: { name: "Untitled" },
        },
      },
    });

    if (isNewFolder) {
      return { status: 200, message: "New folder created" };
    }
  } catch (error) {
    return { status: 500, message: "Oops! Something went wrong!" };
  }
};

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (folder) return { status: 200, data: folder };

    return { status: 400, data: null };
  } catch (error) {
    console.log(error);
    return { status: 500, data: null };
  }
};

export const moveVideoLocation = async (
  videoId: string,
  folderId: string,
  workSpaceId: string
) => {
  try {
    const location = await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId,
      },
    });
    if (location) {
      return { status: 200, data: "Folder changed successfully!" };
    }
    return { status: 404, data: "Video/Folder not found" };
  } catch (error) {
    return { status: 500, data: "Oops! Something went wrong!" };
  }
};

export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 404 };
    }

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summary: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkId: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });

    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkId ? true : false,
      };
    }

    return { status: 404, data: null };
  } catch (error) {
    return { status: 500, data: null };
  }
};
