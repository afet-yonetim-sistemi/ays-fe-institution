// Import React
import { Fragment } from "react";

// Import Partials
import UsersFilter from "./_partials/UsersFilter";
import UsersTable from "./_partials/UsersTable";
import UsersCrud from "./_partials/UsersCrud";

function Users() {
  return (
    <Fragment>
      <UsersFilter />
      <UsersTable />
      <UsersCrud />
    </Fragment>
  );
}

export default Users;
