export default function addPagSortParams(
  page: number,
  size: number,
  sortOrder: string,
  field: string,
  searchParam: string,
  url: string,
) {
  let newUrl = url;
  if (page) newUrl += `?page=${page}`;
  if (size) newUrl += `&size=${size}`;
  if (sortOrder) newUrl += `&sort:order=${sortOrder}`;
  if (field) newUrl += `&search=${field}:${searchParam}`;
  return newUrl;
}
