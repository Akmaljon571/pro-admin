// eslint-disable-next-line import/no-anonymous-default-export
export default (son) => {
  const a = String(son).split('');

  if (a.length === 12) {
    a.splice(0, 3);
  }

  let b = '';
  for (let i = 0; i < a.length; i++) {
    if (i === 2 || i === 5 || i === 7) {
      b += '-' + a[i];
    } else {
      b += a[i];
    }
  }
  return '(+998) ' + b.split('').join('');
};
