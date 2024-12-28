"use client";

import { getNotifications } from "@/actions/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryData } from "@/hooks/useQueryData";
import { User } from "lucide-react";
import React from "react";

type Props = {};

const NotificationsPage = (props: Props) => {
  const { data } = useQueryData(["user-notifications"], getNotifications);

  const { data: notifications, status } = data as {
    status: number;
    data: {
      notification: {
        id: string;
        userId: string | null;
        content: string;
      }[];
    };
  };

  if (status !== 200) {
    return (
      <div className="flex  justify-center items-center h-full w-full">
        <p>No notifications</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {notifications.notification.map((notification) => (
        <div
          key={notification.id}
          className="border-2 flex gap-x-3 items-center rounded-lg p-3"
        >
          <Avatar>
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <p>{notification.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
