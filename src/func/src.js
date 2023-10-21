import { api } from '../context';

export const src = (url) => {
  return api + '/admin/file/' + url;
};
