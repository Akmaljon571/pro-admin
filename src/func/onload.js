import { api } from '../context';

export const onLoad = async (e, link, token) => {
  try {
    const res = await fetch(api + `/admin/file/${link}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await res.blob();
    e.target.src = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error in onLoad:', error);
  }
};
