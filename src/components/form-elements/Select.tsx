import { Select as SelectAntd } from "antd";
import { SelectProps as SelectPropsAntd } from "antd/lib/select";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Components
import FormItem from "./FormItem";

export type MergedProps = SelectPropsAntd & {
  placeholder?: string;
};

function Select(props: MergedProps) {
  const { placeholder } = props;

  return (
    <FormItem {...props}>
      <SelectAntd
        allowClear
        {...props}
        placeholder={placeholder && translate(placeholder)}
      />
    </FormItem>
  );
}

export default Select;
