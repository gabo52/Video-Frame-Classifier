"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function UploadFile({ loadVideo }: { loadVideo: (videoPath: string) => void }) {
  const [videoPath, setVideoPath] = useState("");
  return (
    <>
      <div>
        <div className=" justify-center items-center">
          <h2 className="h-12 flex justify-center items-center font-bold text-xl">
            Please write a path where you store a lung sweep video :)
          </h2>
          <h3 className="h-12 flex justify-center items-center">
            Lets try to classify all frames!
          </h3>
        </div>
        <div className="h-12 flex justify-center items-center px-5 py-10">
          <Input
            className="flex "
            type="video-path"
            placeholder="C:/user/Desktop/example.avi"
            onChange={(e) => setVideoPath(e.target.value)}
          />
          <Button
            className="flex"
            type="submit"
            onClick={() => loadVideo(videoPath)}
          >
            Upload video
          </Button>
        </div>
      </div>
    </>
  );
}

export default UploadFile;
