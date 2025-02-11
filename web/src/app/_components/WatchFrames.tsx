"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function WatchFrames({
  idx,
  handleCountChange,
  assignLabel,
  downloadCSV,
}: {
  idx: number;
  handleCountChange: (idx: number) => void;
  assignLabel: (label: string) => void;
  downloadCSV: () => void;
}) {
  return (
    <>
      <div>
        <div
          className="h
        -12 flex justify-center items-center font-bold text-xl "
        >
          <h1>Frame number {idx}</h1>{" "}
        </div>
        <div className="flex justify-center items-center">
          <Button
            size="icon"
            className="mx-6"
            onClick={() => handleCountChange(idx - 1)}
          >
            <ChevronLeft />
          </Button>
          <Image
            src={`/tmp_frames/frame_${idx}.png`}
            width={500}
            height={500}
            alt="image"
            className="rounded-md"
          ></Image>

          <Button
            size="icon"
            className="mx-6"
            onClick={() => handleCountChange(idx + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex justify-center items-center my-4">
          <Button className="mx-6" onClick={() => assignLabel("normal")}>
            Normal
          </Button>
          <Button className="mx-6" onClick={() => assignLabel("abnormal")}>
            Abnormal
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
