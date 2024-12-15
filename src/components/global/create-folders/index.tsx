"use client";

import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import { Button } from "@/components/ui/button";
import { useCreateFolders } from "@/hooks/useCreateFolders";
import React from "react";

type Props = {workspaceId: string};

const CreateFolders = ({ workspaceId }: Props) => {
    const { onCreateNewFolder } = useCreateFolders(workspaceId)
  return (
    <Button onClick={onCreateNewFolder} className="bg-neutral-900 text-neutral-600 flex items-center gap-2 py-6 px-4 rounded-2xl">
      <FolderPlusDuotine/>
      Create a folder
    </Button>
  );
};

export default CreateFolders;
