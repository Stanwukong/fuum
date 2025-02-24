import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { useMutationData } from "./useMutationData";
import { getWorkSpaceFolders, moveVideoLocation } from "@/actions/workspace";
import useZodForm from "./useZodForm";
import { moveVideosSchema } from "@/components/forms/change-video-location/schema";

export const useMoveVideos = (videoId: string, currentWorkspace: string) => {
  const { folders } = useAppSelector((state) => state.FolderReducer);
  const { workspaces } = useAppSelector((state) => state.WorkSpaceReducer);

  const [isFetching, setIsFetching] = useState(false);
  const [isFolders, setIsFolders] = useState<
    | ({
        _count: {
          videos: number;
        };
      } & {
        id: string;
        name: string;
        createdAt: Date;
        workSpaceId: string | null;
      })[]
    | undefined
  >(undefined);

  const { mutate, isPending } = useMutationData(
    ["change-video-location"],
    (data: { folder_id: string; workspace_id: string }) =>
      moveVideoLocation(videoId, data.workspace_id, data.folder_id)
  );
  const { errors, onFormSubmit, watch, register } = useZodForm(
    moveVideosSchema,
    mutate,
    { folder_id: null, workspace_id: currentWorkspace }
  );

  const fetchFolders = async (workspace: string) => {
    setIsFetching(true);
    try {
      const folders = await getWorkSpaceFolders(workspace);
      console.log(folders, "Fetched Folders"); // Debug log
      setIsFolders(folders.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    fetchFolders(currentWorkspace);
  }, []);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.workspace_id) fetchFolders(value.workspace_id);
    });
  
    return () => subscription.unsubscribe(); // Ensure cleanup
  }, [watch]);

  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  };
};
