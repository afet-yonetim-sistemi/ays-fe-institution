// Import Components
import Table from "../../components/table/Table";
import Button from "../../components/Button/Button";
import { STATUS } from "../../common/contants/status";
function Homepage() {
	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
	];

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
	];
	return (
		<Table
			columns={columns}
			data={data}
			title="Deneme Tablo"
			headerControls={
				<Button
					name="add_cta"
					label="FORM_ELEMENTS.CTA.ADD_NEW"
					status={STATUS.PRIMARY}
					type="primary"
				/>
			}
		/>
	);
}

export default Homepage;
