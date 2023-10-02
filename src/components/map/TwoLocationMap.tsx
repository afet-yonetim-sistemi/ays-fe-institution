import { useRef, useState } from "react";
import "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet-routing-machine";
import { Popover, QRCode } from "antd";
import { useTranslate } from "@refinedev/core";
import Button from "../formItems/Button";
import CopyIcon from "../icons/CopyIcon";
import PhoneIcon from "../icons/PhoneIcon";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import GoogleMapIcon from "../icons/GoogleMapIcon";
import { createControlComponent } from "@react-leaflet/core";
import CustomMarker from "@/components/map/CustomMarker";

declare const L: any;

type Props = {
  location: [number, number];
  userLocation: [number, number];
  id?: string;
  title?: string;
};

export default function TwoLocationMap({ location, userLocation, id = "" }: Props) {
  const t = useTranslate();
  const mapContainerRef = useRef(null);
  const mapId = "map-container" + id;
  const LOCATION_GOOGLE_MAPS_URL = `https://google.com/maps/?q=${location?.[0]},${location?.[1]}`;
  const [_copiedText, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const copyLocation = () => {
    try {
      setIsCopied(true);
      let value = ``;
      value += `${t("locationModal.latitude")}: ${location?.[0]}\n`;
      value += `${t("locationModal.longitude")}: ${location?.[1]}\n`;
      value += `${t("locationModal.googleMaps")}: ${LOCATION_GOOGLE_MAPS_URL}\n`;
      copy(value);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  const createRoutineMachineLayer = (_props: any) => {
    return L.Routing.control({
      waypoints: [L.latLng(location[0], location[1]), L.latLng(userLocation[0], userLocation[1])],
      lineOptions: {
        styles: [{ color: "#f35917", weight: 4 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      createMarker: function () {
        return null;
      },
    });
  };

  const RoutingMachine = createControlComponent(createRoutineMachineLayer);

  return (
    <div style={{ width: "95%" }}>
      <MapContainer
        ref={mapContainerRef}
        id={mapId}
        key={mapId + "key"}
        style={{ height: 300 }}
        center={location}
        zoom={16}
      >
        <TileLayer
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        />
        <RoutingMachine />
        <CustomMarker position={location} isMyLocation={false} />
        <CustomMarker position={userLocation} isMyLocation={false} />
      </MapContainer>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 15 }}>
        <Button
          style={{ marginBottom: 10 }}
          icon={<GoogleMapIcon />}
          onClick={() => {
            window.open(LOCATION_GOOGLE_MAPS_URL, "_blank");
          }}
        >
          {t("locationModal.openWithGoogleMaps")}
        </Button>

        <Button
          style={{ marginBottom: 10 }}
          onClick={copyLocation}
          color={isCopied ? "success" : "secondary"}
          icon={<CopyIcon />}
        >
          {isCopied ? t("locationModal.copied") : t("locationModal.copyTheLocation")}
        </Button>

        <Popover
          content={
            <div>
              <QRCode
                style={{ margin: "0 auto" }}
                bordered={false}
                value={LOCATION_GOOGLE_MAPS_URL}
              />
              {t("locationModal.scanQRCode")}
            </div>
          }
          trigger="click"
          title={t("locationModal.QRCode")}
        >
          <Button color="main" icon={<PhoneIcon />}>
            {t("locationModal.openOnMyPhone")}
          </Button>
        </Popover>
      </div>
    </div>
  );
}
