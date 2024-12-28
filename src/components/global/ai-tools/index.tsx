import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import Loader from "../loader";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import { FileDuoToneBlack } from "@/components/icons";
import { Bot, DownloadIcon, StarIcon, StarsIcon } from "lucide-react";

type Props = {
  plan: "PRO" | "FREE" | undefined;
  trial: boolean | undefined;
  videoId: string;
};

const AiTools = ({ plan, trial, videoId }: Props) => {
  // WIP: Setup AI hook
  return (
    <TabsContent
      value="AI tools"
      className="p-5 bg-neutral-800 rounded-xl flex flex-col gap-y-10"
    >
      <div className="flex items-center">
        <div className="w-8/12">
          <h2 className="text-3xl font-bold">AI Tools</h2>
          <p className="text-neutral-500">
            Take your video to the next level <br /> with the power of AI!
          </p>
        </div>
        <div className="flex w-full items-end space-x-4">
          <Button className={"w-4/12 mt-2 text-sm"}>
            <Loader state={false} color="#000">
              Try now
            </Loader>
          </Button>
          <Button
            variant={"secondary"}
            className={
              "w-4/12 border border-neutral-100 mt-2 text-sm hover:bg-neutral-100 hover:text-neutral-800"
            }
          >
            <Loader state={false} color="#000">
              Pay
            </Loader>
          </Button>
          <Button className={"w-4/12 mt-2 text-sm"}>
            <Loader state={false} color="#000">
              Generate now
            </Loader>
          </Button>
        </div>
      </div>
      <div className="border rounded-xl p-4 gap-4 flex flex-col bg-neutral-700 ">
        <span className="flex space-x-4">
          <p className="text-2xl font-semibold">Fuum AI</p>
          <StarsIcon size={36} color="#fff" fill="#fff" />
        </span>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-20">
            <VideoRecorderDuotone width="36" height="36" />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-semibold">Summary</p>
              <p>Generate a description for your video using AI.</p>
            </div>
          </div>
          <div className="flex items-center space-x-20">
            <FileDuoToneBlack width="36" height="36" />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-semibold">AI Transcription</p>
              <p>Transcribe your videos with AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-20">
            <Bot size={36} className="text-neutral-100" />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-semibold">AI Agent</p>
              <p>
                Viewers can ask questions on your video and our ai agent will
                respond.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default AiTools;
