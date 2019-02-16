exports.chunk = (array, size = 300) => {
  const chunkedArray = [];
  let i = 0;
  while (i < array.length) {
    chunkedArray.push(array.slice(i, i + size));
    i += size;
  }
  return chunkedArray;
};
