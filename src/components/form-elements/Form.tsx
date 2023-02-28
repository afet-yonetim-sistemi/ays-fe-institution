// Import React
import { ReactNode } from "react";

// Import Antd
import { Form as AntdForm, FormProps } from "antd";

// Import Style
import "../../assets/style/_form.scss";

interface IForm extends FormProps {
	children?: ReactNode | ReactNode[];
}

function Form(props: IForm) {
	// Props Destructions
	const { children } = props;
	return (
		<AntdForm {...props} layout="vertical">
			{children}
		</AntdForm>
	);
}

export default Form;
