// Import Antd
import { Input as InputAntd } from "antd";
import { InputProps as InputPropsAntd } from "antd/lib/input";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Components
import FormItem, { FormItemProps } from "./FormItem";

export type MergedProps = Omit<InputPropsAntd, "name"> & Omit<FormItemProps, "children">;

function Input(props: MergedProps) {
	// Desctruct Props
	const { placeholder } = props;

	return (
		<FormItem {...props}>
			<InputAntd
				allowClear
				{...props}
				name=""
				placeholder={placeholder && translate(placeholder)}
				autoComplete="off"
			/>
		</FormItem>
	);
}

export default Input;
