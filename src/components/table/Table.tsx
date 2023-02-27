// Import React
import { useMemo, ReactElement } from "react";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Antd
import { Table as AntdTable } from "antd";
import type { TableProps } from "antd/es/table";

// Import Style
import "../../assets/style/_table.scss";

interface ITable extends Omit<TableProps<any>, "title"> {
	data?: Record<string, any>[];
	tablePaginate?: boolean;
	headerControls?: ReactElement | ReactElement[];
	title?: string;
}

function Table(props: ITable) {
	// Props Destruction
	const { columns, data, tablePaginate = true, headerControls, title } = props;

	// Columns Formatter
	const formattedColumns = useMemo(
		() =>
			columns?.map(item => {
				return {
					...item,
					title: typeof item?.title === "string" ? translate(item?.title) : "",
				};
			}),
		[columns]
	);
	return (
		<div className="table-wrapper">
			<AntdTable
				{...props}
				columns={formattedColumns}
				dataSource={data}
				pagination={tablePaginate && { position: ["bottomRight"] }}
				size="small"
				bordered
				title={() => (
					<div className="tableHead">
						<span className="table-title"> {translate(title)} </span>
						<div className="tableControls">{headerControls}</div>
					</div>
				)}
			/>
		</div>
	);
}

export default Table;
