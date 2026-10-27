import { useState } from "react";
import type { ComponentProps } from "react";
import "./FadeImage.css";

export default function FadeImage({ className = "", onLoad, onError, ...props }: ComponentProps<"img">) {
  const [ready, setReady] = useState(false);

  return (
    <img
      {...props}
      className={`fade-image ${className}`}
      data-ready={ready}
      ref={image => {
        if (image?.complete && image.naturalWidth > 0) setReady(true);
      }}
      onLoad={event => {
        setReady(true);
        onLoad?.(event);
      }}
      onError={event => {
        setReady(true);
        onError?.(event);
      }}
    />
  );
}
