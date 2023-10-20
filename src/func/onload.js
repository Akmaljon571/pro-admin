import { api } from '../context';

export const onLoad = async (e, link, token) => {
  const res = await fetch(api + `/admin/file/${link}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const blob = await res.blob();
  e.target.src = URL.createObjectURL(blob);
};
