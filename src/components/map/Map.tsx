import { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { ResizeMap } from "./ResizeMap";
import { Modal, Popover, QRCode, Row, Col, Alert } from "antd";
import { useTranslate } from "@refinedev/core";
import Button from "../formItems/Button";
import CopyIcon from "../icons/CopyIcon";
import PhoneIcon from "../icons/PhoneIcon";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import GoogleMapIcon from "../icons/GoogleMapIcon";
import { checkLocationIsValid, getDistance } from "@/utilities";
type Props = {
  location: [number, number];
  open: boolean;
  id?: string;
  onCancel?: () => void;
  title?: string;
};

export default function Map({ location, open, id = "", onCancel, title }: Props) {
  const t = useTranslate();
  const modalTitle = title || t("table.location");

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

  const isLocationValid = useMemo(
    () =>
      checkLocationIsValid({
        lat: location?.[0],
        lng: location?.[1],
      }),
    [location]
  );

  if (!open) return null;

  return (
    <Modal
      width={window.innerWidth > 576 ? "80%" : "95%"}
      open={open}
      title={modalTitle}
      onCancel={onCancel}
      footer={
        isLocationValid && (
          <Row gutter={[16, 8]}>
            <Col xs={24} xl={8}>
              <Button
                block
                onClick={() => {
                  window.open(LOCATION_GOOGLE_MAPS_URL, "_blank");
                }}
                icon={<GoogleMapIcon />}
              >
                {t("locationModal.openWithGoogleMaps")}
              </Button>
            </Col>
            <Col xs={24} xl={8}>
              <Button
                block
                onClick={copyLocation}
                color={isCopied ? "success" : "secondary"}
                icon={<CopyIcon />}
              >
                {isCopied ? t("locationModal.copied") : t("locationModal.copyTheLocation")}
              </Button>
            </Col>
            <Col xs={24} xl={8}>
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
                <Button block color="main" icon={<PhoneIcon />}>
                  {t("locationModal.openOnMyPhone")}
                </Button>
              </Popover>
            </Col>
          </Row>
        )
      }
    >
      {!isLocationValid ? (
        <Alert
          message={t("locationModal.invalidLocation.title")}
          description={t("locationModal.invalidLocation.message")}
          type="error"
          style={{ marginTop: "1.5em" }}
        />
      ) : (
        <MapContainer
          id={mapId}
          style={{ height: window.innerWidth > 767 ? 500 : 300 }}
          center={location}
          zoom={15}
        >
          <TileLayer
            attribution="Google Maps"
            url="https://www.google.com.tr/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          />
          <Marker position={location}></Marker>
          <ResizeMap id={mapId} />
        </MapContainer>
      )}
    </Modal>
  );
}
