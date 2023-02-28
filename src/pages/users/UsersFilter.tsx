// Import Components
import FilterWrapper from "../../components/filter-wrapper/FilterWrapper";
import Input from "../../components/form-elements/Input";

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
			/>
		</FilterWrapper>
	);
}

export default UsersFilter;
