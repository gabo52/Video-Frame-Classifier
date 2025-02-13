"use client";
import axios from "axios";
import { useState } from "react";
import UploadFile from "./_components/UploadFile";
import WatchFrames from "./_components/WatchFrames";
import { useOnKeyPress } from "./hooks/useOnKeyPress";
import { sleep } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CSV_URL = "http://localhost:3000/results.csv";

export default function Home() {
  const [idx, setIdx] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [maxLength, setMaxLength] = useState(0);
  const [videoPath, setVideoPath] = useState("");
  const [labels, setLabels] = useState<Array<string>>([]);
  const { toast } = useToast();

  const handleCountChange = (newValue: number) => {
    if (newValue !== maxLength && newValue >= 0) {
      setIdx(newValue);
    }
  };

  const assignLabel = async (label: string) => {
    labels[idx] = label;
    setLabels(labels);
    console.log(labels);
    toast({
      description: `${label} label assigned`,
      variant: `${label}_label`,
    });
  };

  const loadVideo = async (videoPath: string) => {
    setIsVideoSelected(true);
    setVideoPath(videoPath);
    // Aca se llama la api en back y se procesan todos los frames del video guardandose en una carpeta
    // Luego se muestra la imagen que corresponde al indice de la variable count y con ello ya se muestran resultados
    console.log(`El video path es ${videoPath}`);

    const response = await axios.post("http://localhost:5000/api/video", {
      video_path: videoPath,
    });
    await sleep(2000);
    setMaxLength(response.data);
    const newArray = new Array<string>(response.data);
    setLabels(newArray);
  };

  const downloadCSV = async () => {
    await axios.post("http://localhost:5000/api/video/extractResults", {
      labels: labels,
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
      <div className="min-h-screen bg-blue-200 flex justify-center items-center font-mono">
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
