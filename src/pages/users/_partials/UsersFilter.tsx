// Import Constants
import { ICON_LIST } from "../../../common/contants/iconList";

// Import Components
import Icon from "../../../components/Icon/Icon";
import FilterWrapper from "../../../components/filter-wrapper/FilterWrapper";
import Input from "../../../components/form-elements/Input";
import { setSearch } from "../../../store/reducers/usersReducer";
import { useAppDispatch } from "../../../store/store";

function UsersFilter() {
  // Props Destruction

  const dispatch = useAppDispatch();

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value));
  };

  return (
    <FilterWrapper>
      <Input
        name="deme"
        onChange={(e) => handleSearchChange(e.target.value)}
        label="FORM_ELEMENTS.LABELS.SEARCH"
        size="large"
        prefix={<Icon icon={ICON_LIST.SEARCH} />}
      />
    </FilterWrapper>
  );
}

export default UsersFilter;
