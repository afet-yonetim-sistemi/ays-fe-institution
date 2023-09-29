import { SingleAssignment} from "@/types";
import {Show} from "@refinedev/antd";
import {useShowReturnType, useTranslate} from "@refinedev/core";
import {Drawer, Typography} from "antd";
import { useState} from "react";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import TwoLocationMap from "@/components/map/TwoLocationMap";

const { Title, Text } = Typography;

type Props = useShowReturnType<SingleAssignment> & {
  setVisibleShowDrawer: (visible: boolean) => void;
  visibleShowDrawer: boolean;
};

export default function ShowAssignment({setVisibleShowDrawer, visibleShowDrawer, ...props}: Props) {
    const t = useTranslate();
    const {data: showQueryResult, isLoading: showIsLoading} = props.queryResult;
    const record = showQueryResult?.data;
    const [map, setMap] = useState<any>(null);

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
            <Show
                isLoading={showIsLoading}
                headerButtons={<></>}
                title={t("assignments.actions.show")}
            >
                <Title level={5}>{t("assignments.fields.firstName")}</Title>
                <Text>{record?.firstName}</Text>
                <Title level={5}>{t("assignments.fields.lastName")}</Title>
                <Text>{record?.lastName}</Text>
                <Title level={5}>{t("assignments.fields.description")}</Title>
                <Text>{record?.description}</Text>
                {(record?.user?.location && record?.location)
                    ? (
                        <>
                            <Title level={5}>{t("assignments.fields.coordinates")}</Title>
                            <TwoLocationMap
                                location={[
                                    record?.user?.location?.latitude || 0,
                                    record?.user?.location?.longitude || 0,
                                ]}
                                userLocation={[
                                    record?.location?.latitude || 0,
                                    record?.location?.longitude || 0,
                                ]}
                                id={record?.id}
                            />
                        </>
                    ) : (
                        <></>
                    )}
            </Show>
        </Drawer>
    );
}
