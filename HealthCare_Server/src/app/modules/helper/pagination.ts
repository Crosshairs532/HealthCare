const pagination = (paginationItem: any) => {
  const page = Number(paginationItem.page) || 1;
  const limit = Number(paginationItem.limit) || 10;
  const skip = (Number(page) - 1) * limit;

  const sortBy = paginationItem.sortBy ? paginationItem.sortBy : "createdAt";
  const sortOrder = paginationItem.sortBy ? paginationItem.sortBy : "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
export default pagination;
