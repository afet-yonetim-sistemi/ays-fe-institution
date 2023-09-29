import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
  id: string;
};

export const ResizeMap = ({ id }: Props) => {
  const map = useMap();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    const container = document.getElementById(id);
    if (!container) return;
    resizeObserver.observe(container);
    console.log("observe");

    return () => {
      console.log("unobserve");
      resizeObserver.unobserve(container);
    };
  }, [id, map]);

  return null;
};
