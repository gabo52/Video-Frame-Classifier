"use client";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useRef, useState } from "react";
import * as helpers from "../utils/helpers";
import VideoFilePicker from "./_components/VideoFilePicker";
import RangeInput from "./_components/RangeInput";

const FF = createFFmpeg({
  // log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});

(async function () {
  await FF.load();
})();

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const [rStart, setRstart] = useState(0);
  const [rEnd, setRend] = useState(10);

  const [inputVideoFile, setInputVideoFile] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [URL, setURL] = useState([]);

  const [thumbNails, setThumbNails] = useState([]);
  const [trimmedVideoFile, setTrimmedVideoFile] = useState(null);
  const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);
  const [trimIsProcessing, setTrimIsProcessing] = useState(false);

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
    const NUMBER_OF_IMAGES = duration < MAX_NUMBER_OF_IMAGES ? duration : 15;
    const offset =
      duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / NUMBER_OF_IMAGES;

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

        let blob = new Blob([data.buffer], { type: "image/png" });
        let dataURI = await helpers.readFileAsBase64(blob);
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
    console.log({ meta });
    setVideoMeta(meta);
    const thumbNails = await getThumbnails(meta);
    setThumbNails(thumbNails);
  };

  const handleUpdateRange = (func) => {
    return ({ target: { value } }) => {
      func(value);
    };
  };

  const handleTrim = async () => {
    setTrimIsProcessing(true);

    let startTime = ((rStart / 100) * videoMeta.duration).toFixed(2);
    let offset = ((rEnd / 100) * videoMeta.duration - startTime).toFixed(2);
    console.log(
      startTime,
      offset,
      helpers.toTimeString(startTime),
      helpers.toTimeString(offset)
    );

    try {
      FF.FS("writeFile", inputVideoFile.name, await fetchFile(inputVideoFile));
      // await FF.run('-ss', '00:00:13.000', '-i', inputVideoFile.name, '-t', '00:00:5.000', 'ping.mp4');
      await FF.run(
        "-ss",
        helpers.toTimeString(startTime),
        "-i",
        inputVideoFile.name,
        "-t",
        helpers.toTimeString(offset),
        "-c",
        "copy",
        "ping.mp4"
      );

      const data = FF.FS("readFile", "ping.mp4");
      console.log(data);
      const dataURL = await helpers.readFileAsBase64(
        new Blob([data.buffer], { type: "video/mp4" })
      );

      setTrimmedVideoFile(dataURL);
    } catch (error) {
      console.log(error);
    } finally {
      setTrimIsProcessing(false);
    }
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
                  rEnd={rEnd}
                  rStart={rStart}
                  handleUpdaterStart={handleUpdateRange(setRstart)}
                  handleUpdaterEnd={handleUpdateRange(setRend)}
                  loading={thumbnailIsProcessing}
                  videoMeta={videoMeta}
                  thumbNails={thumbNails}
                />
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
