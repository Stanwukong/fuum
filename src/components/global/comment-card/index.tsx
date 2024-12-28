"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommentRepliesProps } from "@/types";
import React, { useState } from "react";

type Props = {
  comment: string;
  author: { image: string; firstname: string; lastname: string };
  videoId: string;
  commentId: string;
  isReply?: boolean;
  reply: CommentRepliesProps[];
};

const CommentCard = ({
  comment,
  author,
  videoId,
  commentId,
  isReply,
  reply,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false);

  return (
    <Card
      className={cn(
        isReply
          ? "bg-neutral-800 pl-10 border-none"
          : "border bg-neutral-800 p-5"
      )}
    >
      <div>
        <Avatar>
          <AvatarImage src={author.image} alt="author" />
        </Avatar>
        <p className="capitalize text-sm text-neutral-400">
          {author.firstname} {author.lastname}
        </p>
      </div>
    </Card>
  );
};

export default CommentCard;
