import { Button } from "@/components/ui/button";
import * as helpers from "../../utils/helpers";
import React, { useEffect, useState } from "react";
export default function ClipBox({
  videoMeta,
  color,
  setIdxBox,
  idx,
  handleUpdateRangeClip,
}) {
  const RANGE_MAX = 100;
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(10);

  const handleUpdateRange = (func) => {
    return ({ target: { value } }) => {
      func(value);
    };
  };
  console.log(videoMeta.duration);
  useEffect(() => {
    //console.log(idx);
    setIdxBox(idx);
    handleUpdateRangeClip({ id: idx, rStart: start, rEnd: end });
  }, [start, end]);

  return (
    <>
      <div
        className="clip_box"
        style={{
          width: `calc(${end - start}% )`,
          left: `${start}%`,
          border: `5px solid ${color}`,
        }}
        data-start={helpers.toTimeString(
          (start / RANGE_MAX) * videoMeta.duration,
          false
        )}
        data-end={helpers.toTimeString(
          (end / RANGE_MAX) * videoMeta.duration,
          false
        )}
      ></div>
      <input
        className="range"
        type="range"
        min={0}
        max={RANGE_MAX}
        onInput={handleUpdateRange(setStart)}
        value={start}
      />

      <input
        className="range"
        type="range"
        min={0}
        max={RANGE_MAX}
        onInput={handleUpdateRange(setEnd)}
        value={end}
      />
    </>
  );
}
