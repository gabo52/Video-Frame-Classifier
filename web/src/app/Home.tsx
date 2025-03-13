"use client";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState } from "react";
import * as helpers from "../utils/helpers";
import VideoFilePicker from "./_components/VideoFilePicker";
import RangeInput from "./_components/RangeInput";
import { RangeClip, RangeLabeled } from "../../types";
import { Button } from "@/components/ui/button";
import { rangesLabeledDefault } from "./mock";

const FF = createFFmpeg({
  // log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});

(async function () {
  await FF.load();
})();

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const [inputVideoFile, setInputVideoFile] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [URL, setURL] = useState([]);

  const [thumbNails, setThumbNails] = useState([]);
  const [thumbnailIsProcessing, setThumbnailIsProcessing] =
    useState<boolean>(false);

  const [rangesLabeled, setRangesLabeled] =
    useState<RangeLabeled[]>(rangesLabeledDefault);

  const addRangeToRangesLabeled = (newRange: RangeLabeled) => {
    setRangesLabeled([...rangesLabeled, newRange]);
  };

  const handleRangeUpdateOnRangesLabeled = (
    label: string,
    newRangesLabeled: RangeClip[]
  ) => {
    setRangesLabeled(
      rangesLabeled.map((rangeLabeled) => {
        if (rangeLabeled.label === label) {
          return { rangesClip: newRangesLabeled, label: label };
        }
        return rangeLabeled;
      })
    );
  };

  console.log(rangesLabeled);

  //El id es {label}_{id}
  const removeRangeFromRangesLabeled = (id: string) => {
    setRangesLabeled(rangesLabeled.filter((range) => range.id !== id));
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    setInputVideoFile(file);

    setURL(await helpers.readFileAsBase64(file));
    setIsLoading(true);
  };

  const getThumbnails = async ({ duration }) => {
    if (!FF.isLoaded()) await FF.load();
    setThumbnailIsProcessing(true);
    const MAX_NUMBER_OF_IMAGES = 15;
    //const NUMBER_OF_IMAGES = duration < MAX_NUMBER_OF_IMAGES ? duration : 15;
    const NUMBER_OF_IMAGES = duration < 7 ? duration : 7;
    const offset =
      duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / NUMBER_OF_IMAGES;
    console.log(NUMBER_OF_IMAGES);
    const arrayOfImageURIs = [];
    FF.FS("writeFile", inputVideoFile.name, await fetchFile(inputVideoFile));

    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
      let startTimeInSecs = helpers.toTimeString(Math.round(i * offset));

      try {
        await FF.run(
          "-ss",
          startTimeInSecs,
          "-i",
          inputVideoFile.name,
          "-t",
          "00:00:1.000",
          "-vf",
          `scale=150:-1`,
          `img${i}.png`
        );
        const data = FF.FS("readFile", `img${i}.png`);

        const blob = new Blob([data.buffer], { type: "image/png" });
        const dataURI = await helpers.readFileAsBase64(blob);
        FF.FS("unlink", `img${i}.png`);
        arrayOfImageURIs.push(dataURI);
      } catch (error) {
        console.log({ message: error });
      }
    }
    setThumbnailIsProcessing(false);

    return arrayOfImageURIs;
  };

  const handleLoadedData = async (e) => {
    const el = e.target;

    const meta = {
      name: inputVideoFile.name,
      duration: el.duration,
      videoWidth: el.videoWidth,
      videoHeight: el.videoHeight,
    };
    setVideoMeta(meta);
    const thumbNails = await getThumbnails(meta);
    setThumbNails(thumbNails);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-200 flex justify-center items-center font-mono">
        <div className="w-[70vw] m-[5rem 0]  max-w-[1170px] rounded-sm p-[1.5rem 2rem] border-red-500">
          <VideoFilePicker
            handleChange={handleVideoChange}
            showVideo={!!inputVideoFile}
          >
            <div className="flex justify-center items-center">
              <video
                src={inputVideoFile ? URL : null}
                autoPlay
                controls
                muted
                onLoadedMetadata={handleLoadedData}
                width="450"
              ></video>
            </div>
          </VideoFilePicker>
          {isLoading && (
            <>
              <div className="flex justify-center items-center">
                <RangeInput
                  labelName={"normal"}
                  color={"#2b6cb0"}
                  loading={thumbnailIsProcessing}
                  videoMeta={videoMeta}
                  thumbNails={thumbNails}
                  handleRangeUpdateOnRangesLabeled={
                    handleRangeUpdateOnRangesLabeled
                  }
                />
              </div>
              <div className="flex justify-center items-center">
                <RangeInput
                  labelName={"abnormal"}
                  color={"#ea580c"}
                  loading={thumbnailIsProcessing}
                  videoMeta={videoMeta}
                  thumbNails={thumbNails}
                  addRangeToRangesLabeled={addRangeToRangesLabeled}
                  removeRangeFromRangesLabeled={removeRangeFromRangesLabeled}
                  handleRangeUpdateOnRangesLabeled={
                    handleRangeUpdateOnRangesLabeled
                  }
                />
              </div>
              <div className="flex justify-center items-center">
                <RangeInput
                  labelName={"NA"}
                  color={"#dc2626"}
                  loading={thumbnailIsProcessing}
                  videoMeta={videoMeta}
                  thumbNails={thumbNails}
                  addRangeToRangesLabeled={addRangeToRangesLabeled}
                  removeRangeFromRangesLabeled={removeRangeFromRangesLabeled}
                  handleRangeUpdateOnRangesLabeled={
                    handleRangeUpdateOnRangesLabeled
                  }
                />
              </div>
              <div className="flex justify-end items-end">
                <Button className="bg-green-600 hover:bg-green-800">
                  Export results
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // set HTTP header

  context.res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  context.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  console.log({ isSecureContext: context });
  return {
    props: {},
  };
}
