import { TabsContent } from "@/components/ui/tabs";
import React from "react";

type Props = {
  transcript: string | null;
};

const VideoTranscript = ({ transcript }: Props) => {
  return (
    <TabsContent
      value="Transcript"
    >
      <p className="text-neutral-100">{transcript}</p>
    </TabsContent>
  );
};

export default VideoTranscript;
