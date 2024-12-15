"use client"

import { getFolderInfo } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { FolderProps } from "@/types";

type Props = {
  folderId: string;
};

const FolderInfo = ({ folderId }: Props) => {
  const { data } = useQueryData(["folder-info"], () => getFolderInfo(folderId));

  const {data: folder} = data as FolderProps


  return <div className="flex items-center">
    <h2 className="text-neutral-400 text-2xl">{folder.name}</h2>
  </div>;
};

export default FolderInfo;
