import { Button as AntdButton, ButtonProps } from "antd";
import "./style.css";

type Color =
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "success"
  | "info"
  | "main"
  | "light"
  | "dark"
  | "link";

type Props = ButtonProps & {
  color?: Color;
};

const Button: React.FC<Props> = ({ color, ...props }) => {
  return <AntdButton {...props} className={`d-flex ${color && "btn btn-" + color}`} />;
};

export default Button;
