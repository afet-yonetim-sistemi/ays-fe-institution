// Import React
import { useMemo, ReactElement } from "react";

// Import Utils
import { translate } from "../../common/utils/translateUtils";
import { lastUpdateTimeStampFormat } from "../../common/utils/dateTimeUtils";

// Import Antd
import { Table as AntdTable } from "antd";
import type { TableProps } from "antd/es/table";

// Import Style
import "../../assets/style/_table.scss";

interface ITable extends Omit<TableProps<any>, "title"> {
	tablePaginate?: boolean;
	headerControls?: ReactElement | ReactElement[];
	title?: string;
	totalCount?: number;
	lastUpdate?: number;
	name: string;
}

function Table(props: ITable) {
	// Props Destruction
	const {
		name,
		columns,
		tablePaginate = true,
		headerControls,
		title,
		dataSource,
		totalCount = dataSource?.length,
		scroll,
		lastUpdate,
	} = props;

	// Columns Formatter
	const formattedColumns = useMemo(
		() =>
			columns?.map((item, index) => {
				return {
					...item,
					key: `${index}_${item?.key}`,
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
				pagination={tablePaginate && { position: ["bottomRight"] }}
				size="small"
				bordered
				rowKey={(record, index) => `${name}_row_${record?.id}_${record?.name}_${index}`}
				scroll={scroll ? scroll : { x: "auto", y: undefined }}
				tableLayout="auto"
				title={() => (
					<div className="tableHead">
						<div className="table-titles">
							<h4 className="table-title"> {translate(title)} </h4>
							<h5> {totalCount + " " + translate("TABLE.TITLES.RECORD_LISTINING")} </h5>
						</div>
						<div className="tableControls">
							{lastUpdate && (
								<div className="lastUpdate margin_right_10">
									<span className="title"> {translate("TABLE.TITLES.LAST_UPDATE")} </span>
									<span className="time">{lastUpdateTimeStampFormat(new Date(lastUpdate))}</span>
								</div>
							)}
							{headerControls}
						</div>
					</div>
				)}
			/>
		</div>
	);
}

export default Table;
