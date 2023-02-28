// Import Utils
import { tableFilter } from "../../common/utils/tableFilterUtil";

// Import Constants
import { ICON_LIST } from "../../common/contants/iconList";
import { ICON_STATUS } from "../../common/contants/iconStatus";
import { STATUS } from "../../common/contants/status";
import { BUTTON_SIZES } from "../../common/contants/buttonSizes";

// Import Components
import PopConfirm from "../../components/popconfirm/PopConfirm";
import Table from "../../components/table/Table";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";

interface IUsersTable {
	search: string;
	setCrudVisible: (status: boolean) => void;
	setRecord: (record: Record<string, any> | null) => void;
}

function UsersTable(props: IUsersTable) {
	// Props Destruction
	const { search, setCrudVisible, setRecord } = props;

	// Columns
	const columns = [
		{
			title: "TABLE.COLUMN.NAME",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "TABLE.COLUMN.AGE",
			dataIndex: "age",
			key: "age",
		},
		{
			title: "TABLE.COLUMN.ADDRESS",
			dataIndex: "address",
			key: "address",
		},
		{
			title: "TABLE.COLUMN.ACTIONS",
			dataIndex: "actions",
			width: 100,
			render: (_: any, record: any) => (
				<>
					<Button
						sizes={BUTTON_SIZES.SM}
						name="cta_edit"
						icon={<Icon icon={ICON_LIST.EDIT} status={ICON_STATUS.WHITE} />}
						status={STATUS.SECONDARY}
						onClick={() => {
							setRecord(record);
							setCrudVisible(true);
						}}
					/>
					<PopConfirm onConfirm={() => console.log("deleted")} title="POPCONFIRM.TITLES.DELETE">
						<Button
							name="cta_delete"
							sizes={BUTTON_SIZES.SM}
							marginleft={10}
							icon={<Icon icon={ICON_LIST.DELETE} status={ICON_STATUS.WHITE} />}
							status={STATUS.DANGER}
						/>
					</PopConfirm>
				</>
			),
		},
	];

	// FakeData
	const data = [
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
			tags: ["nice", "developer"],
		},
		{
			key: "2",
			name: "Jim Green",
			age: 42,
			address: "London No. 1 Lake Park",
			tags: ["loser"],
		},
		{
			key: "3",
			name: "Joe Black",
			age: 32,
			address: "Sydney No. 1 Lake Park",
			tags: ["cool", "teacher"],
		},
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
			tags: ["nice", "developer"],
		},
		{
			key: "2",
			name: "Jim Green",
			age: 42,
			address: "London No. 1 Lake Park",
			tags: ["loser"],
		},
		{
			key: "3",
			name: "Joe Black",
			age: 32,
			address: "Sydney No. 1 Lake Park",
			tags: ["cool", "teacher"],
		},
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
			tags: ["nice", "developer"],
		},
		{
			key: "2",
			name: "Jim Green",
			age: 42,
			address: "London No. 1 Lake Park",
			tags: ["loser"],
		},
		{
			key: "3",
			name: "Joe Black",
			age: 32,
			address: "Sydney No. 1 Lake Park",
			tags: ["cool", "teacher"],
		},
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
			tags: ["nice", "developer"],
		},
		{
			key: "2",
			name: "Jim Green",
			age: 42,
			address: "London No. 1 Lake Park",
			tags: ["loser"],
		},
		{
			key: "3",
			name: "Joe Black",
			age: 32,
			address: "Sydney No. 1 Lake Park",
			tags: ["cool", "teacher"],
		},
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
			tags: ["nice", "developer"],
		},
		{
			key: "2",
			name: "Jim Green",
			age: 42,
			address: "London No. 1 Lake Park",
			tags: ["loser"],
		},
		{
			key: "3",
			name: "Joe Black",
			age: 32,
			address: "Sydney No. 1 Lake Park",
			tags: ["cool", "teacher"],
		},
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
			tags: ["nice", "developer"],
		},
		{
			key: "2",
			name: "Jim Green",
			age: 42,
			address: "London No. 1 Lake Park",
			tags: ["loser"],
		},
		{
			key: "3",
			name: "Joe Black",
			age: 32,
			address: "Sydney No. 1 Lake Park",
			tags: ["cool", "teacher"],
		},
	];
	return (
		<Table
			name="example"
			columns={columns}
			dataSource={tableFilter(search, ["name"], data)}
			title="TABLE.TITLES.USERS"
			headerControls={
				<Button
					name="add_cta"
					label="FORM_ELEMENTS.CTA.ADD_NEW"
					sizes={BUTTON_SIZES.SM}
					status={STATUS.PRIMARY}
					icon={<Icon icon={ICON_LIST.PLUS} status={ICON_STATUS.WHITE} />}
					onClick={() => setCrudVisible(true)}
				/>
			}
		/>
	);
}

export default UsersTable;
