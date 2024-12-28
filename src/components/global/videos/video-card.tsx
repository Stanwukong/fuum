import React from "react";
import Loader from "../loader";
import CardMenu from "./video-card-menu";
import CopyLink from "./copy-link";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, Share2, User } from "lucide-react";

type Props = {
  User: {
    firstname: string | null;
    lastname: string | null;
    image: string | null;
  } | null;
  id: string;
  Folder: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  title: string | null;
  source: string;
  processing: boolean;
  workspaceId: string;
};

const VideoCard = (props: Props) => {
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  console.log(props.Folder?.id, "Current Folder"); // Debug log
  return (
    <Loader
      className="bg-neutral-800 flex justify-center items-center border-[1px] border-neutral-600 rounded-xl"
      state={props.processing}
    >
      <div
        className=" group cursor-pointer overflow-hidden
        bg-neutral-900 relative border-[1px] border-neutral-700 
        flex flex-col rounded-xl"
      >
        <div className="absolute top-3 right-3 z-50 hidden gap-x-3 group-hover:flex">
          <CardMenu
            currentFolder={props.Folder?.id}
            videoId={props.id}
            currentWorkspace={props.workspaceId}
            currentFolderName={props.Folder?.name}
          />
          <CopyLink
            variant={"ghost"}
            className="p-[5px] h-5 bg-hover:bg-transparent bg-neutral-800"
            videoId={props.id}
          />
        </div>
        <Link
          href={`/dashboard/${props.workspaceId}/video/${props.id}`}
          className="hover:bg-neutral-800 transition duration-150 flex flex-col justify-between h-full"
        >
          <video
            controls={false}
            preload="metadata"
            className="w-full aspect-video opacity-50 z-20"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`}
            />
          </video>
          <div className="px-5 py-3 flex flex-col gap-y-2 z-20">
            <h2 className="text-sm font-semibold text-neutral-400">
              {props.title}
            </h2>
            <div className="flex gap-x-2 items-center mt-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={props.User?.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="capitaliza text-xs text-neutral-400">
                  {props.User?.firstname} {props.User?.lastname}
                </p>
                <p className="text-neutral-500 text-xs flex items-center">
                  <Dot /> {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span className="flex gap-x-1 items-center">
                <Share2 fill="#9D9D9D" className="text-[#9D9D9D]" size={12} />
                <p className="text-xs text-[#9D9D9D] capitalize">
                  {props.User?.firstname}'s Workspace
                </p>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </Loader>
  );
};

export default VideoCard;
