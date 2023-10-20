import { api } from '../context';

export const workbookLoad = async (link, token) => {
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
    window.open(URL.createObjectURL(blob), '_blank');
  } catch (error) {
    console.error('Error in onLoad:', error);
  }
};
