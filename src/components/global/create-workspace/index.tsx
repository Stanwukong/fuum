"use client";

import { getWorkspaces } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import Modal from "../modal";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import WorkspaceForm from "@/components/forms/workspace-form";

type Props = {};

const CreateWorkspace = (props: Props) => {
  const { data } = useQueryData(["user-workspaces"], getWorkspaces);

  const { data: plan } = data as {
    status: number;
    data: {
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
    };
  };

  if (plan.subscription?.plan === "FREE") return <></>;

  if (plan.subscription?.plan) 
    return (
      <Modal
        title="Create a workspace"
        description="Workspaces help you collaborate with team members"
        trigger={
          <Button className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
            <FolderPlusDuotine />
            Create a workspace
          </Button>
        }
      >
        <WorkspaceForm />
      </Modal>
    );
};

export default CreateWorkspace;
