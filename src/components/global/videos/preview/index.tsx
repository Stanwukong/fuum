"use client";

import { getPreviewVideo } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { VideoProps } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";
import CopyLink from "../copy-link";
import RichLink from "../rich-link";
import { truncateString } from "@/lib/utils";
import TabMenu from "@/components/forms/tabs";
import AiTools from "../../ai-tools";
import VideoTranscript from "../../video-transcript";
import { TabsContent } from "@/components/ui/tabs";
import Activities from "../../activities";

type Props = {
  videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
  // WIP: Setup notify first view
  // WIP: Setup Activity
  const router = useRouter();
  const { data } = useQueryData(["preview-video"], () =>
    getPreviewVideo(videoId)
  );

  const { data: video, status, author } = data as VideoProps;
  if (status !== 200) router.push("/");

  const daysAgo = Math.floor(
    (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );
  return (
    <div
      className="grid grid-cols-1 xl:grid-cols-3 p-10 
      lg:px-20 lg:py-10 overflow-y-auto gap-5"
    >
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="text-white text-4xl font-bold">{video.title}</h2>
            {/* {author ? (
                <EditVideo 
                videoId={videoId} 
                title={video.title as string} 
                description={video.description as string}/>
            ) : ()} */}
          </div>
          <span className="flex gap-x-3 mt-2">
            <p className="text-neutral-300 captitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-neutral-400">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        <video
          preload="metadata"
          className="w-full aspect-video opacity-50 rounded-xl"
          controls
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
          />
        </video>
        <div className="flex flex-col text-2xl gap-y-4">
          <div className=" flex gap-x-5 items-center justify-between">
            <p className="text-neutral-400 font-semibold">Description</p>
            {/* {author ? (
                <EditVideo 
                videoId={videoId} 
                title={video.title as string} 
                description={video.description as string}/>
            ) : ()} */}
          </div>
          <p className="text-neutral-500 text-lg font-medium">
            {video.description}
          </p>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-3">
          <CopyLink
            variant={"outline"}
            className="rounded-full bg-transparent border border-neutral-600 px-10"
            videoId={videoId}
          />
          <RichLink
            description={truncateString(video.description as string, 150)}
            id={videoId}
            source={video.source}
            title={video.title as string}
          />
        </div>
        <div>
          <TabMenu
            triggers={["AI tools", "Transcript", "Activity"]}
            defaultValue="AI tools"
          >
            <AiTools
              videoId={videoId}
              trial={video.User?.trial}
              plan={video.User?.subscription?.plan}
            />
            <VideoTranscript transcript={video.description} />
            <Activities
              videoId={videoId}
              author={video.User?.firstname as string}
            />
          </TabMenu>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
