"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkspaces } from "@/actions/workspace";
import { NotificationProps, WorkspaceProps } from "@/types";
import Modal from "../modal";
import { Menu, PlusCircle } from "lucide-react";
import Search from "../search";
import { usePathname, useRouter } from "next/navigation";
import { MENU_ITEMS } from "@/constants";
import SidebarItem from "./Sidebar-item";
import { getNotifications } from "@/actions/user";
import WorkspacePlaceholder from "./workspace-placeholder";
import GlobalCard from "../global-card";
import { Button } from "@/components/ui/button";
import Loader from "../loader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "@/components/info-bar";

type Props = {
  activeWorkspaceId: string;
};

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkspaces);

  const menuItems = MENU_ITEMS(activeWorkspaceId);
  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  const { data: workspaces } = data as WorkspaceProps;
  const { data: count } = notifications as NotificationProps;

  const handleChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  const currentWorkspace = workspaces.workspace.find(
    (s) => s.id == activeWorkspaceId
  );

  let trigger = (
    <span
      className="text-sm cursor-pointer flex items-center justify-center 
    bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm 
    p-[5px] gap-2 group"
    >
      <PlusCircle
        size={25}
        className="text-neutral-800/90 fill-neutral-500 group-hover:scale-90 transition-all"
      />
      <span className="text-neutral-400 font-semibold text-xs">
        Invite To Workspace
      </span>
    </span>
  );
  const SidebarSection = (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image src={"/share.png"} height={40} width={40} alt="logo" />
        <p className="text-2xl">Fuum</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={handleChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace"></SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspaces.workspace.map((workspace) => (
              <SelectItem value={workspace.id} key={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
            {workspaces.members.length > 0 &&
              workspaces.members.map(
                (workspace) =>
                  workspace.Workspace && (
                    <SelectItem
                      value={workspace.Workspace.id}
                      key={workspace.Workspace.id}
                    >
                      {workspace.Workspace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currentWorkspace?.type === "PUBLIC" &&
        workspaces.subscription?.plan == "PRO" && (
          <Modal
            trigger={trigger}
            title="Invite To Workspace"
            description="Invite other users to your workspace"
          >
            <Search workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <p className="w-full text-neutral-500 font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              href={item.href}
              icon={item.icon}
              selected={pathname === item.href}
              title={item.title}
              notifications={
                (item.title === "Notifications" &&
                  count._count &&
                  count._count.notifications) ||
                0
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full text-neutral-500 font-bold mt-4">Workspaces</p>
      {workspaces.workspace.length === 1 && workspaces.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-[#4b4848] font-medium text-sm">
            {workspaces.subscription?.plan === "FREE"
              ? "Upgrade to create workspaces"
              : "No workspaces"}
          </p>
        </div>
      )}
      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspaces.workspace.length > 0 &&
            workspaces.workspace.map(
              (item) =>
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    key={item.name}
                    href={`/dashboard/${item.id}`}
                    selected={pathname === `/dashboard/${item.id}`}
                    title={item.name}
                    notifications={0}
                    icon={
                      <WorkspacePlaceholder>
                        {item.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                )
            )}
          {workspaces.members.length > 0 &&
            workspaces.members.map((item) => (
              <SidebarItem
                key={item.Workspace.name}
                href={`/dashboard/${item.Workspace.id}`}
                selected={pathname === `/dashboard/${item.Workspace.id}`}
                title={item.Workspace.name}
                notifications={0}
                icon={
                  <WorkspacePlaceholder>
                    {item.Workspace.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
              />
            ))}
        </ul>
      </nav>
      <Separator className="W-4/5" />
      {workspaces.subscription?.plan === "FREE" && (
        <GlobalCard
          title="Upgrade to Pro"
          description="Unlock AI features like transcription, AI summary and more"
        >
          <Button className="text-sm w-full mt-2">
            <Loader>Upgrade</Loader>
          </Button>
        </GlobalCard>
      )}
    </div>
  );

  return (
    <div className="full">
      {/* INFOBAR */}
      <InfoBar/>
      {/* SHEET mobile and Desktop */}
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block h-full">{SidebarSection}</div>
    </div>
  );
};

export default Sidebar;
