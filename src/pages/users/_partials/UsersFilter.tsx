// Import Constants
import { ICON_LIST } from "../../../common/contants/iconList";

// Import Components
import Icon from "../../../components/Icon/Icon";
import FilterWrapper from "../../../components/filter-wrapper/FilterWrapper";
import Input from "../../../components/form-elements/Input";

interface IUsersFilter {
	setSearch: (val: string) => void;
}

function UsersFilter(props: IUsersFilter) {
	// Props Destruction
	const { setSearch } = props;

	return (
		<FilterWrapper>
			<Input
				name="deme"
				onChange={e => setSearch(e.target.value)}
				label="FORM_ELEMENTS.LABELS.SEARCH"
				size="large"
				prefix={<Icon icon={ICON_LIST.SEARCH} />}
			/>
		</FilterWrapper>
	);
}

export default UsersFilter;
