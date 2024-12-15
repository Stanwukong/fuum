import { Search, UploadIcon } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import VideoRecorderIcon from "../icons/video-recorder";

type Props = {};

const InfoBar = (props: Props) => {
  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search size={25} className="text-neutral-400" />
        <Input
          className="bg-transparent border-none !placeholder-neutral-500"
          placeholder="Search for people, projects & folders"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button className="bg-neutral-500 flex items-center gap-2">
            <UploadIcon size={20}/>
            <span className="flex items-center gap-2">Upload</span>
        </Button>
        <Button className="bg-neutral-500 flex items-center gap-2">
            <VideoRecorderIcon />
            <span className="flex items-center gap-2">Record</span>
        </Button>
      </div>
    </header>
  );
};

export default InfoBar;
