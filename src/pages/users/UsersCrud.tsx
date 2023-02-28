// Import React
import { useEffect } from "react";

// Import Constants
import { STATUS } from "../../common/contants/status";
import { FORM_RULES } from "../../common/contants/formRules";

// Import Antd
import { useForm } from "antd/lib/form/Form";

// Import Components
import Form from "../../components/form-elements/Form";
import Drawer from "../../components/drawer/Drawer";
import Button from "../../components/Button/Button";
import Input from "../../components/form-elements/Input";

interface IUsersCrud {
	visible: boolean;
	setVisible: (status: boolean) => void;
	setRecord: (record: Record<string, any> | null) => void;
	record: Record<string, any> | null;
}

function UsersCrud(props: IUsersCrud) {
	// Props Destruction
	const { visible, setVisible, record, setRecord } = props;

	// Form
	const [form] = useForm();

	// Actions
	const drawerCloser = () => {
		setVisible(false);
		setRecord(null);
		form.resetFields();
	};

	const onSubmit = (values: Record<string, any>) => {
		console.log(values);
		drawerCloser();
	};

	// useEffect
	useEffect(() => {
		record && form.setFieldsValue(record);
	}, [record]);

	return (
		<Drawer
			title={record ? "DRAWER.TITLES.EDIT_USER" : "DRAWER.TITLES.ADD_USER"}
			visible={visible}
			onClose={drawerCloser}
			footer={
				<>
					<Button
						name="cancel_cta"
						onClick={drawerCloser}
						label="FORM_ELEMENTS.CTA.CANCEL"
						status={STATUS.SECONDARY}
					/>

					<Button
						name="submit_cta"
						marginleft={10}
						onClick={() => {
							form.submit();
						}}
						label="FORM_ELEMENTS.CTA.SAVE"
						status={STATUS.SUCCESS}
					/>
				</>
			}
		>
			<Form form={form} onFinish={onSubmit}>
				<Input name="name" rules={[FORM_RULES.REQUIRED]} label="FORM_ELEMENTS.LABELS.NAME" />
				<Input name="age" rules={[FORM_RULES.REQUIRED]} label="FORM_ELEMENTS.LABELS.AGE" />
				<Input name="address" rules={[FORM_RULES.REQUIRED]} label="FORM_ELEMENTS.LABELS.ADDRESS" />
			</Form>
		</Drawer>
	);
}

export default UsersCrud;
