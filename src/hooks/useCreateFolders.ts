import { createFolder } from "@/actions/workspace";
import { useMutationData } from "./useMutationData";

export const useCreateFolders = (workSpaceId: string) => {
  const { mutate } = useMutationData(
    ["create-folder"],
    () => createFolder(workSpaceId),
    "workspace-folders"
  );

  const onCreateNewFolder = () =>
    mutate({ name: "Untitled", id: "optimistic--id" });

  return { onCreateNewFolder };
};
