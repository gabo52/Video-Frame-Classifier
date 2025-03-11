"use client";

import NoSSRWrapper from "./NoSSRWrapper.tsx";
import Home from "./Home.tsx";

export default function Page() {
  return (
    <NoSSRWrapper>
      <Home />
    </NoSSRWrapper>
  );
}
