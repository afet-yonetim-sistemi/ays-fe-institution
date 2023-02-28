// Import Utils
import { removeAccents } from './stringUtils';

export const tableFilter = (search: string, dataKeys: string[], data: unknown[]) => {
  if (data && Array.isArray(data)) {
    const filter = data?.filter((item: any) =>
      dataKeys
        ?.map((value) => item?.[value]?.toString())
        ?.some((item) => !!item && removeAccents(item)?.includes(removeAccents(search)))
    );

    return filter?.length ? filter : [];
  } else {
    return data;
  }
};
