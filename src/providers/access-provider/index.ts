import { newEnforcer } from "casbin";
import { adapter, model } from "./casbin";
import { AccessControlProvider } from "@refinedev/core";

const accessProvider = (role: string): AccessControlProvider => {
  return {
    can: async ({ action, params, resource }) => {
      const enforcer = await newEnforcer(model, adapter);
      if (action === "delete" || action === "edit" || action === "show") {
        return Promise.resolve({
          can: await enforcer.enforce(role, `${resource}/${params?.id}`, action),
        });
      }
      if (action === "field") {
        return Promise.resolve({
          can: await enforcer.enforce(role, `${resource}/${params?.field}`, action),
        });
      }

      return {
        can: await enforcer.enforce(role, resource, action),
      };
    },
    options: {
      buttons: {
        hideIfUnauthorized: true,
      },
    },
  };
};

export default accessProvider;
