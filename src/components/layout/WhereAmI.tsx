import { useTranslate } from "@refinedev/core";
import { Col, Modal, Popover, QRCode, Row, Space, Button as AntdButton } from "antd";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import GoogleMapIcon from "../icons/GoogleMapIcon";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import Button from "../formItems/Button";
import CopyIcon from "../icons/CopyIcon";
import PhoneIcon from "../icons/PhoneIcon";

type Props = {
  location: [number, number];
  open: boolean;
  onCancel: () => void;
};

export default function WhereAmI({ location, open, onCancel }: Props) {
  const t = useTranslate();
  const LOCATION_GOOGLE_MAPS_URL = `https://google.com/maps/?q=${location?.[0]},${location?.[1]}`;
  const [copiedText, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const ResizeMap = () => {
    const map = useMap();

    useEffect(() => {
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });

      const container = document.getElementById("map-container");
      resizeObserver.observe(container!);

      return () => {
        resizeObserver.unobserve(container!);
      };
    }, [map]);

    return null;
  };

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

  return (
    <Modal
      width={window.innerWidth > 576 ? "80%" : "95%"}
      open={open}
      title={t("locationModal.myLocation")}
      onCancel={onCancel}
      footer={
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
      }
    >
      <MapContainer
        id="map-container"
        style={{ height: window.innerWidth > 767 ? 500 : 300 }}
        center={location}
        zoom={16}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={location}>
          <Popup>123</Popup>
        </Marker>
        <ResizeMap />
      </MapContainer>
    </Modal>
  );
}
