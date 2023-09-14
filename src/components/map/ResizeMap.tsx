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
    resizeObserver.observe(container!);

    return () => {
      resizeObserver.unobserve(container!);
    };
  }, [id, map]);

  return null;
};
