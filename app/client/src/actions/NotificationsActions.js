export const NOTIFY = 'NOTIFY';
export const CLEAR = 'CLEAR';

export const notify = (value) => {
  return { type: NOTIFY, value };
};

export const clear = () => {
  return { type: CLEAR };
};
