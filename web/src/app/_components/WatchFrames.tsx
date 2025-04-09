"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnKeyPress } from "../hooks/useOnKeyPress";

const FRAMES_STEP = 3;

function WatchFrames({
  idx,
  handleCountChange,
  assignLabel,
  downloadCSV,
  filename,
}: {
  idx: number;
  handleCountChange: (idx: number) => void;
  assignLabel: (label: string) => void;
  downloadCSV: () => void;
  filename: string;
}) {
  useOnKeyPress(() => handleCountChange(idx + 1), "ArrowRight");
  useOnKeyPress(() => handleCountChange(idx - 1), "ArrowLeft");

  useOnKeyPress(() => assignLabel("normal"), "n");
  useOnKeyPress(() => assignLabel("abnormal"), "a");
  useOnKeyPress(() => assignLabel("ignore"), "i");
  return (
    <>
      <div>
        <div className="h-16 flex justify-center items-center font-bold text-xl ">
          <div className="flex justify-center items-center text-center">
            <h1 className="flex justify-center items-center">
              {filename}
              <br />
              Frame number {idx * FRAMES_STEP}
            </h1>
            <br />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button
            size="icon"
            className="mx-6"
            onClick={() => handleCountChange(idx - 1)}
          >
            <ChevronLeft />
          </Button>
          <img
            src={`/tmp_frames/frame_${idx * FRAMES_STEP}.png`}
            width={900}
            height={900}
            alt="image"
            className="rounded-md"
          ></img>

          <Button
            size="icon"
            className="mx-6"
            onClick={() => handleCountChange(idx + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex justify-center items-center my-4">
          <Button
            className="mx-6 bg-blue-600 shadow-xl hover:bg-blue-700"
            onClick={() => assignLabel("normal")}
          >
            Normal
          </Button>
          <Button
            className="mx-6 bg-orange-600 shadow-xl hover:bg-orange-700"
            onClick={() => assignLabel("abnormal")}
          >
            Abnormal
          </Button>
          <Button
            className="mx-6 shadow-xl"
            onClick={() => assignLabel("Discard")}
          >
            Ignore
          </Button>
        </div>

        <div className="flex justify-end items-end my-2">
          <Button
            className="mx-6 bg-green-600 shadow-xl  hover:bg-green-800"
            onClick={downloadCSV}
          >
            Download CSV
          </Button>
        </div>
      </div>
    </>
  );
}

export default WatchFrames;
