import { SingleAssignment } from "@/types";
import { Show } from "@refinedev/antd";
import { useShowReturnType, useTranslate } from "@refinedev/core";
import { Drawer, Typography } from "antd";
import { useEffect, useState } from "react";
import L, { LatLngExpression } from "leaflet";

const { Title, Text } = Typography;

type Props = useShowReturnType<SingleAssignment> & {
  setVisibleShowDrawer: (visible: boolean) => void;
  visibleShowDrawer: boolean;
};

export default function ShowAssignment({
  setVisibleShowDrawer,
  visibleShowDrawer,
  ...props
}: Props) {
  const t = useTranslate();
  const { data: showQueryResult, isLoading: showIsLoading } = props.queryResult;
  const record = showQueryResult?.data;
  const [map, setMap] = useState<any>(null); // Initialize map as state
  const [polyline, setPolyline] = useState<any>(null); // Initialize polyline as state

  useEffect(() => {
    const mapElement = document.getElementById("map");
    if (mapElement) {
      // Initialize the map when the component mounts
      const leafletMap = L.map("map"); // Remove initial view for now
      setMap(leafletMap); // Store the map in state

      // Add a tile layer (adjust the URL to a valid tile provider)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(leafletMap);

      // Create markers for the points
      let centerCoordinates: LatLngExpression = [0, 0]; // Default center coordinates

      if (
        record &&
        record?.location?.latitude !== undefined &&
        record?.location?.longitude !== undefined
      ) {
        const point1 = L.marker([record?.location?.latitude, record?.location?.longitude])
          .addTo(leafletMap)
          .bindPopup("Point 1");

        centerCoordinates = [record.location.latitude, record.location.longitude];
      }

      if (
        record &&
        record?.user?.location?.latitude !== undefined &&
        record?.user?.location?.longitude !== undefined
      ) {
        const point2 = L.marker([
          record?.user?.location?.latitude,
          record?.user?.location?.longitude,
        ])
          .addTo(leafletMap)
          .bindPopup("Point 2");
      }

      // Set the map's initial view to the center coordinates
      leafletMap.setView(centerCoordinates, 10); // Adjust the zoom level as needed

      // Create a polyline between the points
      const latlngs: LatLngExpression[] = [
        [record?.location?.latitude || 0, record?.location?.longitude || 0],
        [record?.user?.location?.latitude || 0, record?.user?.location?.longitude || 0],
      ];

      const newPolyline = L.polyline(latlngs, { color: "red" }).addTo(leafletMap);
      setPolyline(newPolyline);
    }
  }, [record]);

  return (
    <Drawer
      open={visibleShowDrawer}
      onClose={() => {
        setVisibleShowDrawer(false);
        if (map) {
          map.remove();
          setMap(null);
        }
      }}
      width="500"
    >
      <Show isLoading={showIsLoading} headerButtons={<></>} title={t("assignments.actions.show")}>
        <Title level={5}>{t("assignments.fields.firstName")}</Title>
        <Text>{record?.firstName}</Text>
        <Title level={5}>{t("assignments.fields.lastName")}</Title>
        <Text>{record?.lastName}</Text>
        <Title level={5}>{t("assignments.fields.description")}</Title>
        <Text>{record?.description}</Text>
        <Title level={5}>{t("assignments.fields.coordinates")}</Title>
        {record?.location && record?.user?.location ? (
          <div id="map" style={{ height: "300px" }}></div>
        ) : (
          <Text style={{ display: "block" }}>{t("formErrors.assignments.coordinateNotFound")}</Text>
        )}
      </Show>
    </Drawer>
  );
}
