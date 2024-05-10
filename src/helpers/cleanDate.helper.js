//changing date format to display only YYYY-MM-DD
export const cleanDate = (date) => {
  return date.toISOString().split("T")[0];
};
