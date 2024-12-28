"use client";

import { getAllUserVideos } from "@/actions/workspace";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import { useQueryData } from "@/hooks/useQueryData";
import { cn } from "@/lib/utils";
import React from "react";
import VideoCard from "./video-card";
import { VideosProps } from "@/types";

type AllVideosProps = {
  workspaceId: string;
};

const AllVideos = ({ workspaceId }: AllVideosProps) => {
  const { data: videoData } = useQueryData(
    ['workspace-videos', workspaceId], 
    () => getAllUserVideos(workspaceId)
  );

  const { status, data: videos } = videoData || { status: 404, data: [] } as VideosProps;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-neutral-300 text-xl">Videos</h2>
        </div>
      </div>
      <section
        className={cn(
          status !== 200
            ? "p-5"
            : 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
        )}
      >
        {status === 200 ? (
          videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard
                key={video.id}
                {...video}
                workspaceId={workspaceId}
                folderName={video.Folder?.name}
              />
            ))
          ) : (
            <p className="text-neutral-600 col-span-full text-center">
              No videos found in this workspace
            </p>
          )
        ) : (
          <p className="text-neutral-600 col-span-full text-center">
            {status === 404 
              ? "No videos found" 
              : "Unable to load videos"}
          </p>
        )}
      </section>
    </div>
  );
};

export default AllVideos;