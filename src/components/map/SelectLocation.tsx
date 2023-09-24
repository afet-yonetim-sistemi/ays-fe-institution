import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { useTranslate } from "@refinedev/core";
import { Modal } from "antd";
import { ResizeMap } from "./ResizeMap";
import CustomMarker from "./CustomMarker";

type Props = {
  open: boolean;
  onOk: (location: { lat: number; lng: number }) => void;
  id?: string;
  onCancel?: () => void;
  modalTitle?: string;
  location?: { lat: number; lng: number };
};

const ZOOM_LEVEL = 14;
const ZOOM_LEVEL_NO_LOCATION = 5;

function SelectLocation({ open, id = "", onCancel, modalTitle, onOk, location }: Props) {
  const t = useTranslate();
  const title = useMemo(() => modalTitle ?? t("table.location"), [modalTitle, t]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng);
        map.flyTo(e.latlng, map.getZoom() === ZOOM_LEVEL_NO_LOCATION ? ZOOM_LEVEL : map.getZoom(), {
          duration: 1,
        });
      },
      dragend: (e) => {
        if (e.target.getLatLng) {
          setSelectedLocation(e.target.getLatLng());
          map.flyTo(
            e.target.getLatLng(),
            map.getZoom() === ZOOM_LEVEL_NO_LOCATION ? ZOOM_LEVEL : map.getZoom(),
            {
              duration: 1,
            }
          );
        }
      },
    });
    return null;
  }
  const onOkClick = () => {
    if (selectedLocation) {
      onOk({
        lat: +selectedLocation.lat.toFixed(6),
        lng: +selectedLocation.lng.toFixed(6),
      });
    }
  };

  const CENTER_OF_TURKEY: LatLngExpression = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [39.925533, 32.866287];

  const mapId = "map-container-select-" + id;

  useEffect(() => {
    if (location?.lat && location?.lng) {
      setSelectedLocation(location);
    }
  }, [location]);

  return (
    <Modal
      width={window.innerWidth > 576 ? "80%" : "95%"}
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={onOkClick}
    >
      <MapContainer
        key={mapId}
        id={mapId}
        center={CENTER_OF_TURKEY}
        zoom={selectedLocation !== null ? ZOOM_LEVEL : ZOOM_LEVEL_NO_LOCATION}
        style={{ width: "100%", height: "400px" }}
      >
        <TileLayer
          url="https://www.google.com.tr/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"

          // make map is available in turkish
        />
        <LocationMarker />
        {selectedLocation && <CustomMarker position={selectedLocation} draggable></CustomMarker>}
        <ResizeMap id={mapId} />
      </MapContainer>
    </Modal>
  );
}

export default SelectLocation;
