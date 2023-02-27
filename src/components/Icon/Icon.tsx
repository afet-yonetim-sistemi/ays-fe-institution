// Import FontAwesome
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

// Import Constants
import { ICON_STATUS } from "../../common/contants/iconStatus";
import { MARGIN_SIZES } from "../../common/contants/marginSizes";

interface IconProps extends FontAwesomeIconProps {
	status?: ICON_STATUS;
	marginRight?: MARGIN_SIZES;
	marginLeft?: MARGIN_SIZES;
	marginTop?: MARGIN_SIZES;
	marginBottom?: MARGIN_SIZES;
}
function Icon(props: IconProps) {
	// Desctruct Props
	const { status, marginRight, marginLeft, marginTop, marginBottom } = props;

	return (
		<FontAwesomeIcon
			{...props}
			color={status}
			className={`margin_right_${marginRight} margin_left_${marginLeft} margin_top_${marginTop} margin_bottom_${marginBottom}`}
		/>
	);
}

export default Icon;

Icon.defaultProps = {
	status: ICON_STATUS.SECONDARY,
	marginright: 0,
	marginleft: 0,
	margintop: 0,
	marginbottom: 0,
};
