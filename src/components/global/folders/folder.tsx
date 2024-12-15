"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import Loader from "../loader";
import FolderDuotone from "@/components/icons/folder-duotone";
import { useMutationData } from "@/hooks/useMutationData";
import { renameFolders } from "@/actions/workspace";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  id: string;
  optimistic?: boolean;
  count?: number;
};

const Folder = ({ name, id, optimistic, count }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const folderCardRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [rename, setRename] = useState(false);

  const Rename = () => setRename(true);
  const Renamed = () => setRename(false);

  const { mutate, isPending } = useMutationData(
    ["rename-folders"],
    (data: { name: string }) => renameFolders(id, name),
    "workspace-folders",
    Renamed
  );

  const handleFolderClick = () => {
    router.push(`${pathname}/folder/${id}`);
  };

  const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    Rename();
  };

  const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputRef.current && folderCardRef.current) {
      if (
        !inputRef.current.contains(e.target as Node | null) &&
        !folderCardRef.current.contains(e.target as Node | null)
      ) {
        if (inputRef.current.value) {
          mutate({ name: inputRef.current.value });
        } else {
          Renamed();
        }
      }
    }
  };

  return (
    <div
      onClick={handleFolderClick}
      ref={folderCardRef}
      className={cn( optimistic && "opacity-60",
        "flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg border-[1px]"
      )}
    >
      <Loader state={false}>
        <div className="flex flex-col gap-[1px]">
          {rename ? (
            <Input
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateFolderName(e)}
              autoFocus
              ref={inputRef}
              placeholder={name}
              className="border-none text-base w-full outline-none text-neutral-300 bg-transparent px-2"
            />
          ) : (
            <p
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleNameDoubleClick}
              className="text-neutral-300"
            >
              {name}
            </p>
          )}

          <span className="text-sm text-neutral-500">{count || 0} videos</span>
        </div>
      </Loader>
      <FolderDuotone />
    </div>
  );
};

export default Folder;
