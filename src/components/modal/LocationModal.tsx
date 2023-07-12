// Import React
import { useEffect, useState } from "react";

// Import Leaflet
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Constants
import { STATUS } from "../../common/contants/status";
import { ICON_STATUS } from "../../common/contants/iconStatus";
import { ICON_LIST } from "../../common/contants/iconList";

// Import Antd
import { Popover, QRCode } from "antd";

// Import Components
import Modal, { IModal } from "./Modal";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

// Import Style
import "../../assets/style/_locationModal.scss";

interface ILocationModal extends Omit<IModal, "children"> {
	location: [number, number];
	zoom?: number;
	markerDescription?: string;
}

function LocationModal(props: ILocationModal) {
	// Props Destruction
	const { location, markerDescription } = props;

	// useStates
	const [isCopy, setIsCopy] = useState(false);

	// Variables
	const LOCATION_GOOGLE_MAPS_URL = `https://google.com/maps/?q=${location?.[0]},${location?.[1]}`;

	// Resize Handler (Required to work in modal)
	const ResizeMap = () => {
		const map = useMap();

		useEffect(() => {
		  const resizeObserver = new ResizeObserver(() => {
			map.invalidateSize();
		  });
	  
		  const container = document.getElementById('map-container');
		  resizeObserver.observe(container!);
	  
		  return () => {
			resizeObserver.unobserve(container!); 
		  };
		}, [map]);
	  
		return null;
	};

	return (
		<Modal
			{...props}
			width={"80%"}
			footer={
				<div className="location-modal-footer">
					<Button
						name="open_google_maps_cta"
						block
						label="FORM_ELEMENTS.CTA.OPEN_IN_GOOGLE_MAPS"
						status={STATUS.WHITE}
						icon={<Icon icon={ICON_LIST.MAP_LOCATION} status={ICON_STATUS.BLACK} />}
						onClick={() => {
							window.open(LOCATION_GOOGLE_MAPS_URL, "_blank");
						}}
					/>
					<Button
						name="open_google_maps_cta"
						block
						label={isCopy ? "FORM_ELEMENTS.CTA.COPIED" : "FORM_ELEMENTS.CTA.COPY_LOCATION"}
						status={isCopy ? STATUS.SUCCESS : STATUS.SECONDARY}
						icon={
							<Icon
								icon={ICON_LIST.COPY}
								status={isCopy ? ICON_STATUS.WHITE : ICON_STATUS.LIGHT_GREY}
							/>
						}
						onClick={() => {
							navigator.clipboard.writeText(`
							LATITUDE: ${location?.[0]} -
							LONGITUDE: ${location?.[1]} -
							GOOGLE MAPS: ${LOCATION_GOOGLE_MAPS_URL}
							`);
							setIsCopy(true);
							setTimeout(() => setIsCopy(false), 2000);
						}}
					/>
					{window.innerWidth > 576 && (
						<Popover
							content={
								<div className="qr-code-popover">
									<QRCode
										style={{ margin: "0 auto" }}
										bordered={false}
										value={LOCATION_GOOGLE_MAPS_URL}
									/>
									{translate("OTHERS.SCAN_QR_CODE")}
								</div>
							}
							title={translate("OTHERS.QR_CODE")}
							trigger="click"
						>
							<Button
								name="open_google_maps_cta"
								label="FORM_ELEMENTS.CTA.OPEN_ON_MY_PHONE"
								status={STATUS.PRIMARY}
								icon={<Icon icon={ICON_LIST.MOBILE} status={ICON_STATUS.WHITE} />}
								block
							/>
						</Popover>
					)}
				</div>
			}
		>
			<MapContainer
				id="map-container"
				style={{ height: window.innerWidth > 767 ? 500 : 300 }}
				center={location}
				zoom={16}
			>
				<TileLayer
					attribution="Afet Yönetim Sistemi"
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={location}>
					<Popup>{translate(markerDescription)}</Popup>
				</Marker>
				<ResizeMap />
			</MapContainer>
		</Modal>
	);
}

export default LocationModal;
