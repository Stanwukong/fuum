import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMoveVideos } from "@/hooks/useFolders";
import React, { useEffect, useState } from "react";

type Props = {
  videoId: string;
  currentFolder?: string;
  currentFolderName?: string;
  currentWorkspace?: string;
};

const ChangeVideoLocation = ({
  videoId,
  currentFolder,
  currentFolderName,
  currentWorkspace,
}: Props) => {
  const {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkspace!);

  // State to store folder and workspace details
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Update folder and workspace state in useEffect
  useEffect(() => {
    const folder =
      folders.find((folder) => folder.id === currentFolder) || null;
    const workspace =
      workspaces.find((workspace) => workspace.id === currentWorkspace) || null;

    setSelectedFolder(folder);
    setSelectedWorkspace(workspace);

    console.log(folder, "Current Folder");
    console.log(workspace, "Current Workspace");
  }, [folders, workspaces, currentFolder, currentWorkspace]);

  return (
    <form className="flex flex-col gap-y-5" onSubmit={() => onFormSubmit()}>
      <div className="border-[1px] rounded-xl p-5">
        <h2 className="text-xs text-neutral-400">Current Workspace</h2>
        {selectedWorkspace && <p>{selectedWorkspace.name}</p>}
        <h2 className="text-xs text-neutral-400 mt-4">Current Folder</h2>
        {selectedFolder ? (
          <p>{selectedFolder.name}</p>
        ) : (
          <p className="text-neutral-300 text-sm">This video has no folder</p>
        )}
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
        <h2 className="text-xs text-neutral-400">To</h2>
        <Label className="flex-col gap-y-2 flex">
          <p className="text-xs">Workspace</p>
          <select
            className="rounded-xl text-base h-8 bg-transparent"
            {...register("workspace_id")}
          >
            {workspaces.map((workspace) => (
              <option
                key={workspace.id}
                value={workspace.id}
                className="text-neutral-800"
              >
                {workspace.name}
              </option>
            ))}
          </select>
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="text-xs">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <select
                {...register("folder_id")}
                className="rounded-xl bg-transparent text-base"
              >
                {isFolders.map((folder, key) =>
                  key === 0 ? (
                    <option
                      className="text-neutral-400 "
                      key={folder.id}
                      value={folder.id}
                    >
                      {folder.name}
                    </option>
                  ) : (
                    <option
                      className="text-neutral-400 "
                      key={folder.id}
                      value={folder.id}
                    >
                      {folder.name}
                    </option>
                  )
                )}
              </select>
            ) : (
              <p className="text-neutral-400 text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>
      <Button type="submit">
        <Loader state={isPending} color="#000">
          Transfer
        </Loader>
      </Button>
    </form>
  );
};

export default ChangeVideoLocation;
