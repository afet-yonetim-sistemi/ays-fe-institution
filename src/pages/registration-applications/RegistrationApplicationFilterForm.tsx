import { CrudFilters, getDefaultFilter, useTranslate } from "@refinedev/core";

import { Button, Col, Form, Row, Select } from "antd";
import { useMemo } from "react";

import { FormProps } from "antd/lib";

const statuses = ["WAITING", "COMPLETED", "VERIFIED", "REJECTED"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Props = {
  filters: CrudFilters;
  formProps: FormProps;
};

const RegistrationApplicationFilterForm: React.FC<{
  formProps: FormProps;
  filters: CrudFilters;
}> = (props) => {
  const t = useTranslate();
  const { formProps, filters } = props;
  const statusOptions = useMemo(
    () =>
      statuses.map((status) => ({
        label: t("registrationApplicationStatuses." + status),
        value: status,
      })),
    [t]
  );

  return (
    <Form
      layout="vertical"
      {...formProps}
      initialValues={{
        statuses: getDefaultFilter("statuses", filters),
      }}
    >
      <Row
        gutter={[10, 0]}
        align="bottom"
        style={{
          paddingTop: 10,
        }}
      >
        <Col xs={24}>
          <Form.Item label={t("registrationApplications.fields.status")} name="statuses">
            <Select
              allowClear
              mode="multiple"
              placeholder={t("registrationApplications.fields.status")}
              options={statusOptions}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item>
            <Button htmlType="submit" type="primary" size="large" block id="filter-button">
              {t("buttons.filter")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default RegistrationApplicationFilterForm;
