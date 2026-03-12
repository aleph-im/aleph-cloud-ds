"use client";

import { useState } from "react";
import { LogoFull, Logo } from "@aleph-front/ds/logo";
import { Button } from "@aleph-front/ds/button";
import { Card } from "@aleph-front/ds/card";
import { Badge } from "@aleph-front/ds/badge";
import { StatusDot } from "@aleph-front/ds/status-dot";
import { Alert } from "@aleph-front/ds/alert";
import { Table, type Column } from "@aleph-front/ds/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@aleph-front/ds/tabs";
import { Input } from "@aleph-front/ds/input";
import { Select } from "@aleph-front/ds/select";
import { Switch } from "@aleph-front/ds/switch";
import { Slider } from "@aleph-front/ds/slider";
import { Checkbox } from "@aleph-front/ds/checkbox";
import { FormField } from "@aleph-front/ds/form-field";
import { CopyableText } from "@aleph-front/ds/copyable-text";
import { Pagination } from "@aleph-front/ds/pagination";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@aleph-front/ds/breadcrumb";

export default function OverviewPage() {
  return (
    <>
      {/* Hero — bleeds past max-w-4xl */}
      <div className="-mx-4 sm:-mx-8 -mt-6 sm:-mt-8 mb-12">
        <div className="gradient-fill-main fx-grain-lg px-6 py-16 sm:py-20 text-center">
          <LogoFull className="mx-auto h-10 sm:h-12 text-white mb-6" />
          <p className="font-heading text-2xl sm:text-3xl font-extrabold italic text-white mb-3">
            Build with confidence
          </p>
          <p className="text-white/70 max-w-lg mx-auto mb-6">
            Tokens-first design system with OKLCH color scales,
            semantic theming, and accessible components.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge>Components</Badge>
            <Badge>Foundations</Badge>
            <Badge>Dark Mode</Badge>
          </div>
        </div>
      </div>

      {/* Showcase grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Blocks will be added in subsequent tasks */}
      </div>
    </>
  );
}
