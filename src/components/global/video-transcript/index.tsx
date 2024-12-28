import { TabsContent } from "@/components/ui/tabs";
import React from "react";

type Props = {
  transcript: string | null;
};

const VideoTranscript = ({ transcript }: Props) => {
  return (
    <TabsContent
      value="Transcript"
      className="p-5 bg-neutral-800 flex flex-col gap-y-6"
    >
      <p className="text-neutral-100">{transcript}</p>
    </TabsContent>
  );
};

export default VideoTranscript;
