import React from "react";
import Modal from "../modal";
import { Move } from "lucide-react";
import ChangeVideoLocation from "@/components/forms/change-video-location";

type Props = {
  videoId: string;
  currentWorkspace?: string;
  currentFolder?: string;
  currentFolderName?: string;
};

const CardMenu = ({
  videoId,
  currentFolder,
  currentFolderName,
  currentWorkspace,
}: Props) => {
  console.log(currentFolder, "Current Folder"); // Debug log
  return (
    <Modal
      title="Video Options"
      description="This action will permanently delete this video from your library"
      className="flex items-center cursor-pointer gap-x-2"
      trigger={<Move size={20} fill="#4f4f4f" className="text-[#4f4f4f]" />}
    >
      <ChangeVideoLocation
        currentFolder={currentFolder}
        videoId={videoId}
        currentWorkspace={currentWorkspace}
        currentFolderName={currentFolderName}
      />
    </Modal>
  );
};

export default CardMenu;
