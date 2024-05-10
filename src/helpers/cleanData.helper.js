//clean recived data
export const cleanData = (data) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (value === "" || value === null) {
      return acc;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};
