"use client";

import { useState } from "react";
import { Pagination } from "@aleph-front/ds/pagination";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function PaginationPage() {
  const [page1, setPage1] = useState(3);
  const [page2, setPage2] = useState(5);
  const [page3, setPage3] = useState(3);
  const [page4, setPage4] = useState(3);

  return (
    <>
      <PageHeader
        title="Pagination"
        description="Controlled pagination with configurable sibling count and first/last jump buttons."
      />
      <DemoSection title="Desktop Max (siblingCount=2, showFirstLast)">
        <Pagination
          page={page1}
          totalPages={10}
          onPageChange={setPage1}
          siblingCount={2}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page1} of 10
        </p>
      </DemoSection>
      <DemoSection title="Default (siblingCount=1, showFirstLast)">
        <Pagination
          page={page2}
          totalPages={20}
          onPageChange={setPage2}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page2} of 20
        </p>
      </DemoSection>
      <DemoSection title="Compact (siblingCount=1, no firstLast)">
        <Pagination
          page={page3}
          totalPages={10}
          onPageChange={setPage3}
          showFirstLast={false}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page3} of 10
        </p>
      </DemoSection>
      <DemoSection title="Minimal (siblingCount=0, no firstLast)">
        <Pagination
          page={page4}
          totalPages={10}
          onPageChange={setPage4}
          siblingCount={0}
          showFirstLast={false}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page4} of 10
        </p>
      </DemoSection>
    </>
  );
}
