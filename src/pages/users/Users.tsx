// Import React
import { Fragment, useState } from "react";

// Import Partials
import UsersFilter from "./UsersFilter";
import UsersTable from "./UsersTable";
import UsersCrud from "./UsersCrud";
function Users() {
	// useStates
	const [search, setSearch] = useState<string>("");
	const [crudVisible, setCrudVisible] = useState<boolean>(false);
	const [record, setRecord] = useState<Record<string, any> | null>(null);

	return (
		<Fragment>
			<UsersFilter setSearch={setSearch} />
			<UsersTable search={search} setCrudVisible={setCrudVisible} setRecord={setRecord} />
			<UsersCrud
				visible={crudVisible}
				setVisible={setCrudVisible}
				setRecord={setRecord}
				record={record}
			/>
		</Fragment>
	);
}

export default Users;
