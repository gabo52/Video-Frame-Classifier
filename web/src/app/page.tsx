"use client";
import axios from "axios";
import { useState } from "react";
import UploadFile from "./_components/UploadFile";
import WatchFrames from "./_components/WatchFrames";
import { useOnKeyPress } from "./hooks/useOnKeyPress";
import { sleep } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Were taking 5fps from 15fps original video
const FRAMES_STEP = 3;

const CSV_URL = "http://localhost:3000/results.csv";

export default function Home() {
  const [idx, setIdx] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [maxLength, setMaxLength] = useState(0);
  const [labels, setLabels] = useState<Array<string>>([]);
  const [framesIdx, setFramesIdx] = useState<Array<number>>([]);
  const { toast } = useToast();

  const handleCountChange = (newValue: number) => {
    if (newValue < maxLength && newValue >= 0) {
      setIdx(newValue);
    }
  };

  const assignLabel = async (label: string) => {
    labels[idx] = label;
    framesIdx[idx] = idx * FRAMES_STEP;
    setLabels(labels);
    setFramesIdx(framesIdx);
    toast({
      description: `${label} label assigned`,
      variant: `${label}_label`,
    });
  };

  const loadVideo = async (videoPath: string) => {
    // Aca se llama la api en back y se procesan todos los frames del video guardandose en una carpeta
    // Luego se muestra la imagen que corresponde al indice de la variable count y con ello ya se muestran resultados

    const response = await axios.post("http://localhost:5000/api/video", {
      video_path: videoPath,
    });

    if (response.data === 0) {
      toast({
        description: `Video file on ${videoPath} not found`,
        variant: `destructive`,
      });
      return;
    }
    setIsVideoSelected(true);
    await sleep(2000);
    setMaxLength(response.data);
    const maxLength = response.data;

    setLabels(new Array<string>(maxLength));
    setFramesIdx(Array.from({ length: maxLength }, (e, i) => i * 3));
  };

  const getFramesWithoutLabel = async () => {
    const empty_frames_idx = new Array<number>();
    for (let i = 0; i < maxLength; i++) {
      if (labels[i] == undefined) {
        empty_frames_idx.push(framesIdx[i]);
      }
    }
    return empty_frames_idx;
  };

  const downloadCSV = async () => {
    const emptyLabelFrames = await getFramesWithoutLabel();

    if (emptyLabelFrames.length > 0) {
      let frames_string = "";
      emptyLabelFrames.map((frame_idx, idx) => {
        if (idx == 0) {
          frames_string = frames_string + `${frame_idx}`;
        } else {
          frames_string = frames_string + `, ${frame_idx}`;
        }
      });
      toast({
        description: `Frames ${frames_string} without label`,
        variant: `destructive`,
      });
    }

    await axios.post("http://localhost:5000/api/video/extractResults", {
      labels: labels,
      frames_idx: framesIdx,
    });
    const aTag = document.createElement("a");
    aTag.href = CSV_URL;
    aTag.setAttribute("download", "labels_classified.csv");
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  return (
    <>
      <div className="min-h-screen bg-slate-200 flex justify-center items-center font-mono">
        {isVideoSelected ? (
          <WatchFrames
            idx={idx}
            handleCountChange={handleCountChange}
            assignLabel={assignLabel}
            downloadCSV={downloadCSV}
          ></WatchFrames>
        ) : (
          <div className="w-[70vw] m-[5rem 0] bg-blue-300 max-w-[1170px] rounded-sm p-[1.5rem 2rem] border-red-500 shadow-xl">
            <UploadFile loadVideo={loadVideo}></UploadFile>
          </div>
        )}
      </div>
    </>
  );
}
