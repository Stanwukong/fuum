"use client";

import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import CommentForm from "@/components/forms/comment-form";
import CommentCard from "../comment-card";
import { useQueryData } from "@/hooks/useQueryData";
import { getVideoComments } from "@/actions/user";
import { VideoCommentProps } from "@/types";

type Props = {
  author: string;
  videoId: string;
};

const Activities = ({ author, videoId }: Props) => {
  const { data } = useQueryData(["video-comments"], () =>
    getVideoComments(videoId)
  );

  const { data: comments } = data as VideoCommentProps;

  return (
    <TabsContent
      value="Activity"
      className="p-5 bg-neutral-800 flex flex-col gap-y-5"
    >
      <CommentForm videoId={videoId} author={author} commentId={""} />
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment.comment}
          author={{
            image: comment.User?.image!,
            firstname: comment.User?.firstname!,
            lastname: comment.User?.lastname!,
          }}
          videoId={videoId}
          commentId={comment.id}
          reply={comment.reply}
        />
      ))}
    </TabsContent>
  );
};

export default Activities;
