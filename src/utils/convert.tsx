export function convertDate(date: Date) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("vi-VN");
}