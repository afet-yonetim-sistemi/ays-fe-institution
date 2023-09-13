import { useTranslate } from "@refinedev/core";
import Map from "../map/Map";

type Props = {
  location: [number, number];
  open: boolean;
  onCancel: () => void;
};

export default function WhereAmI({ location, open, onCancel }: Props) {
  const t = useTranslate();

  const mapId = "map-container-where-am-i";

  return (
    <Map
      location={location}
      open={open}
      onCancel={onCancel}
      id={mapId}
      title={t("locationModal.myLocation")}
    />
  );
}
