// eslint-disable-next-line import/no-anonymous-default-export
export default (son) => {
  const a = String(son).split('').reverse();
  let b = '';
  for (let i = 0; i < a.length; i++) {
    if (i % 3 === 0) {
      b += ' ' + a[i];
    } else {
      b += a[i];
    }
  }
  return b.split('').reverse().join('');
};
