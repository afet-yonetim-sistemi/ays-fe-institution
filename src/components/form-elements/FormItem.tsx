// Import Antd
import { Form } from "antd";
import { FormItemProps as FormItemPropsAntd } from "antd/lib/form";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Style
import "../../assets/style/_form.scss";

export interface FormItemProps extends FormItemPropsAntd {
  label?: string | null;
  notForm?: boolean;
  marginReset?: boolean;
  children?: any;
  picker?: "time" | "date";
}

function FormItem(props: FormItemProps) {
  // Destruct Props
  const { children, label, notForm, className, marginReset, rules } = props;

  const translatedRules = Array.isArray(rules)
    ? rules?.map((item: any) => {
        return {
          ...item,
          message: item?.message ? translate(item?.message) : undefined,
        };
      })
    : [];

  return (
    <div className="custom-form-item">
      {notForm ? (
        <div>{children}</div>
      ) : (
        <Form.Item
          {...props}
          label={label && translate(label)}
          className={`${className} ${marginReset && "no_margin"}`}
          rules={translatedRules}
        >
          {children}
        </Form.Item>
      )}
    </div>
  );
}

export default FormItem;
