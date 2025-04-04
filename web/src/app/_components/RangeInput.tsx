import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ClipBox from "./ClipBox";
import { RangeClip } from "../../../types";
import Image from "next/image";

export default function RangeInput({
  labelName,
  color,
  loading,
  videoMeta,
  thumbNails,
  handleRangeUpdateOnRangesLabeled,
}: {
  labelName: string;
  color: string;
  loading: boolean;
}) {
  const [rangesClipBox, setRangesClipsBox] = useState<RangeClip[]>([]);
  const [idxBox, setIdxBox] = useState<string>("");

  useEffect(() => {
    handleRangeUpdateOnRangesLabeled(labelName, rangesClipBox);
  }, [rangesClipBox]);

  const handleUpdateRangeClip = (rangeClip) => {
    setRangesClipsBox(
      rangesClipBox.map((range) => {
        if (rangeClip.id === range.id) {
          return rangeClip;
        }
        return range;
      })
    );
  };

  const addRangeClipBox = () => {
    const newRange: RangeClip = {
      rStart: 0,
      rEnd: 10,
      id: new Date().getTime().toString(),
    };
    setRangesClipsBox([...rangesClipBox, newRange]);
    setIdxBox(newRange.id);
    //addRangeToRangesLabeled({ range: newRange, id: `${labelName}_${idxBox}` });
  };

  const removeClipBox = () => {
    setRangesClipsBox(rangesClipBox.filter((range) => range.id != idxBox));
    //removeRangeFromRangesLabeled(`${labelName}_${idxBox}`);
  };

  if (thumbNails.length === 0 && !loading) {
    return null;
  }

  if (loading) {
    return (
      <center>
        <h2> processing thumbnails.....</h2>
      </center>
    );
  }

  return (
    <>
      <div className="range_pack">
        <div className="flex items-center justify-center mx-10  rounded-md">
          <Label
            className="text-white flex items-center justify-center w-24 h-12 rounded-md"
            style={{ backgroundColor: color }}
          >
            {labelName}
          </Label>
        </div>
        <div className="image_box">
          {thumbNails.map((imgURL, id) => (
            <Image
              src={imgURL}
              alt={`sample_video_thumbnail_${id}`}
              key={id}
              width={100}
              height={80}
            />
          ))}
          {rangesClipBox.map((rangeClipBox) => {
            return (
              <ClipBox
                setIdxBox={setIdxBox}
                color={color}
                key={rangeClipBox.id}
                idx={rangeClipBox.id}
                videoMeta={videoMeta}
                handleUpdateRangeClip={handleUpdateRangeClip}
                addRangeClipBox={addRangeClipBox}
              ></ClipBox>
            );
          })}
        </div>
        <div className="flex-col justify-center items-center mx-8">
          <div className="h-12 flex justify-center items-center">
            <Button className="w-32" onClick={addRangeClipBox}>
              Add interval
            </Button>
          </div>
          <div className="h-12 flex justify-start items-start">
            <Button className="w-32" onClick={removeClipBox}>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
