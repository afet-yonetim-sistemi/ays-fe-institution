// Import React
import { Fragment, useState } from "react";

// Import Partials
import UsersFilter from "./_partials/UsersFilter";
import UsersTable from "./_partials/UsersTable";
import UsersCrud from "./_partials/UsersCrud";
import { User } from "../../client/services/user";
function Users() {
  // useStates
  const [search, setSearch] = useState<string>("");
  const [crudVisible, setCrudVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<User | null>(null);

  return (
    <Fragment>
      <UsersFilter setSearch={setSearch} />
      <UsersTable
        search={search}
        setCrudVisible={setCrudVisible}
        setRecord={setRecord}
      />
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
