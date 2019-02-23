exports.chunk = (array, size) => {
  const chunkedArray = [];
  let i = 0;
  while (i < array.length) {
    chunkedArray.push(array.slice(i, i + size));
    i += size;
  }
  return chunkedArray;
};
