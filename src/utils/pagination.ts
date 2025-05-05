interface PaginationInfo {
  current: number;
  next: number | null;
  prev: number | null;
  total: number;
}

function getPaginationInfo(totalData: number, currentPage: number, limit: number): PaginationInfo {
  const total = limit > 0 ? Math.ceil(totalData / limit) : 0;
  const current = total > 0 ? currentPage : 0;
  const next = current < total ? current + 1 : null;
  const prev = current > 1 ? current - 1 : null;

  return {
    current: currentPage,
    next,
    prev,
    total,
  };
}

export default getPaginationInfo;
