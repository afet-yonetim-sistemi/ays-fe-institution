// Import React
import { ReactNode } from "react";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Components
import { Button as ButtonAntd } from "antd";
import { ButtonProps as ButtonPropsAntd } from "antd/lib/button";

// Import Constants
import { STATUS } from "../../common/contants/status";

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
}

function Button(props: ButtonProps) {
	// Desctruct Props
	const {
		label,
		customLabel,
		icon,
		rightIcon,

		name,

		disabled,
	} = props;

	const buttonTemplate = (
		<ButtonAntd
			{...props}
			disabled={disabled}
			id={name}
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
