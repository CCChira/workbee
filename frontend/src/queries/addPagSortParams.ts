export default function addPagSortParams(page: number, size: number, sortOrder: string, url: string) {
  let newUrl = url;
  if (page) newUrl += `?page=${page}`;
  if (size) newUrl += `&size=${size}`;
  if (sortOrder) newUrl += `&sort:order=${sortOrder}`;
  return newUrl;
}
