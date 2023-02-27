// Import React
import { ReactNode } from "react";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Components
import { Button as ButtonAntd } from "antd";
import { ButtonProps as ButtonPropsAntd } from "antd/lib/button";

// Import Constants
import { STATUS } from "../../common/contants/status";
import { MARGIN_SIZES } from "../../common/contants/marginSizes";
import { BUTTON_SIZES } from "../../common/contants/buttonSizes";

// Import Style
import "../../assets/style/_buttons.scss";

export interface ButtonProps extends Omit<ButtonPropsAntd, "size"> {
	status?: STATUS | undefined;
	label?: string | undefined;
	customLabel?: string | React.ReactElement | ReactNode | undefined;
	icon?: ReactNode;
	rightIcon?: ReactNode;
	className?: string | undefined;
	isform?: boolean;
	name: string;
	disabled?: boolean;
	marginright?: MARGIN_SIZES;
	marginleft?: MARGIN_SIZES;
	margintop?: MARGIN_SIZES;
	marginbottom?: MARGIN_SIZES;
	sizes?: BUTTON_SIZES;
}

function Button(props: ButtonProps) {
	// Desctruct Props
	const {
		label,
		customLabel,
		icon,
		rightIcon,
		status,
		name,
		disabled,
		className,
		marginright,
		marginleft,
		margintop,
		marginbottom,
		sizes = BUTTON_SIZES.MD,
	} = props;

	const buttonTemplate = (
		<ButtonAntd
			{...props}
			disabled={disabled}
			id={name}
			className={
				status
					? `btn-${status} ${className} ${sizes} 
				margin_right_${marginright} margin_left_${marginleft} margin_top_${margintop} margin_bottom_${marginbottom}`
					: `${className} 
				margin_right_${marginright} margin_left_${marginleft} margin_top_${margintop} margin_bottom_${marginbottom}`
			}
			icon={
				icon && (
					<span className={`btn-icon ${(label || customLabel) && "margin_right_5"}`}>{icon}</span>
				)
			}
		>
			{label ? translate(label) : ""}
			{customLabel && <span>{customLabel}</span>}
			{rightIcon && <span className={`btn-icon ${label && "margin_left_10"}`}>{rightIcon}</span>}
		</ButtonAntd>
	);

	return buttonTemplate;
}
export default Button;
