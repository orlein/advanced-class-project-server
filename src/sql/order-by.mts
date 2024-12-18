export const ORDER_BY = ['created_at', 'updated_at'] as const;
export const SORT_ORDER = ['ASC', 'DESC'] as const;

export type OrderBy = (typeof ORDER_BY)[number];
export type SortOrder = (typeof SORT_ORDER)[number];

export const CREATED_AT = ORDER_BY[0];
export const UPDATED_AT = ORDER_BY[1];

export const ASC = SORT_ORDER[0];
export const DESC = SORT_ORDER[1];
