type PageItem = number | "ellipsis";

type BuildPageRangeArgs = {
  page: number;
  totalPages: number;
  siblingCount: number;
  showFirstLast: boolean;
};

function buildPageRange({
  page,
  totalPages,
  siblingCount,
  showFirstLast,
}: BuildPageRangeArgs): PageItem[] {
  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const items: PageItem[] = [];

  if (showFirstLast) {
    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 2;

    items.push(1);

    if (showLeftEllipsis) {
      items.push("ellipsis");
    } else {
      for (let i = 2; i < leftSibling; i++) {
        items.push(i);
      }
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(i);
      }
    }

    if (showRightEllipsis) {
      items.push("ellipsis");
    } else {
      for (let i = rightSibling + 1; i < totalPages; i++) {
        items.push(i);
      }
    }

    if (totalPages > 1) {
      items.push(totalPages);
    }
  } else {
    for (let i = leftSibling; i <= rightSibling; i++) {
      items.push(i);
    }
  }

  return items;
}

export { buildPageRange, type PageItem };
