// Import React
import { ReactElement } from "react";

import { Form } from "antd";

// Import Style
import "../../assets/style/_filterWrapper.scss";

interface IFilterWrapper {
	children?: ReactElement | ReactElement[];
}

function FilterWrapper(props: IFilterWrapper) {
	// Props Destruction
	const { children } = props;
	return (
		<div className="filterWrapper">
			<Form layout="vertical">{children}</Form>
		</div>
	);
}

export default FilterWrapper;
