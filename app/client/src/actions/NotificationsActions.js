export const NOTIFY = 'NOTIFY';
export const CLEAR = 'CLEAR';

export const START_PAGE_LOAD = 'START_PAGE_LOAD';
export const END_PAGE_LOAD = 'END_PAGE_LOAD';

export const notify = (value) => {
  return { type: NOTIFY, value };
};

export const clear = () => {
  return { type: CLEAR };
};

export const startPageLoad = () => {
  return { type: START_PAGE_LOAD };
};

export const endPageLoad = () => {
  return { type: END_PAGE_LOAD };
};
