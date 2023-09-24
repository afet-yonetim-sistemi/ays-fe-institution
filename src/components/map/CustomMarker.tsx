import { Marker, MarkerProps } from "react-leaflet";
import L from "leaflet";

type Props = MarkerProps & {
  isMyLocation?: boolean;
};

const CustomMarker = ({ position, isMyLocation, ...props }: Props) => {
  const icon = L.icon({
    iconUrl: isMyLocation ? "/images/my-marker.png" : "/images/marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  return <Marker position={position} icon={icon} {...props} />;
};

export default CustomMarker;
