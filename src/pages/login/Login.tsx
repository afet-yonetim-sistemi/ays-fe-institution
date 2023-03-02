// Import Store
import { useDispatch } from "react-redux";
import { userLoginAction } from "../../store/actions/user/userLoginAction";

// Import Constants
import { FORM_RULES } from "../../common/contants/formRules";
import { STATUS } from "../../common/contants/status";

// Import Antd
import { useForm } from "antd/lib/form/Form";

// Import Components
import Button from "../../components/Button/Button";
import Form from "../../components/form-elements/Form";
import Input from "../../components/form-elements/Input";

// Import Style
import "../../assets/style/login.scss";

function Login() {
	// Variables
	const [form] = useForm();
	const dispatch = useDispatch();

	// Actions
	const onSubmit = (values: Record<string, any>) => {
		dispatch(userLoginAction(values));
	};

	return (
		<div className="login-wrapper">
			<h1 className="login-heading">AYS</h1>
			<div className="login-form">
				<Form form={form} onFinish={onSubmit}>
					<Input
						name="login_email"
						rules={[FORM_RULES.REQUIRED]}
						label="FORM_ELEMENTS.LABELS.EMAIL"
					/>
					<Input
						name="login_password"
						rules={[FORM_RULES.REQUIRED]}
						label="FORM_ELEMENTS.LABELS.PASSWORD"
					/>
					<Button
						name="login_cta"
						onClick={() => form.submit()}
						label="FORM_ELEMENTS.LABELS.LOGIN"
						status={STATUS.PRIMARY}
					/>
				</Form>
			</div>
		</div>
	);
}

export default Login;
