"use client";

import { DocHeader } from "@preview/components/doc-header";
import {
  ArrowRight,
  Bell,
  CaretDown,
  CaretUp,
  Check,
  Copy,
  Eye,
  Gear,
  Heart,
  House,
  MagnifyingGlass,
  Pencil,
  Plus,
  SignOut,
  Spinner,
  Star,
  Trash,
  User,
  Warning,
  X,
  type IconWeight,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

type PhosphorIcon = ComponentType<{
  weight?: IconWeight;
  size?: number | string;
  className?: string;
}>;

const SHOWCASE_ICONS: { name: string; Icon: PhosphorIcon }[] = [
  { name: "House", Icon: House },
  { name: "User", Icon: User },
  { name: "Gear", Icon: Gear },
  { name: "Bell", Icon: Bell },
  { name: "MagnifyingGlass", Icon: MagnifyingGlass },
  { name: "Plus", Icon: Plus },
  { name: "X", Icon: X },
  { name: "Check", Icon: Check },
  { name: "Pencil", Icon: Pencil },
  { name: "Trash", Icon: Trash },
  { name: "Copy", Icon: Copy },
  { name: "Eye", Icon: Eye },
  { name: "Heart", Icon: Heart },
  { name: "Star", Icon: Star },
  { name: "Warning", Icon: Warning },
  { name: "ArrowRight", Icon: ArrowRight },
  { name: "CaretDown", Icon: CaretDown },
  { name: "CaretUp", Icon: CaretUp },
  { name: "SignOut", Icon: SignOut },
  { name: "Spinner", Icon: Spinner },
];

const WEIGHTS: IconWeight[] = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
];

const ICON_SIZES = [
  { name: "2xl", px: 36 },
  { name: "xl", px: 24 },
  { name: "lg", px: 16 },
  { name: "md", px: 14 },
  { name: "sm", px: 12 },
  { name: "xs", px: 8 },
] as const;

export default function IconsPage() {
  return (
    <div>
      <DocHeader
        title="Icons"
        description="Phosphor Icons — 7,000+ icons in 6 weights. MIT licensed."
      />
      <div className="space-y-12">
        <section>
          <h3 className="text-lg font-bold mb-2">Icon Weights</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Each icon comes in 6 weights: thin, light, regular, bold, fill, and
            duotone. The DS uses <code>bold</code> for internal component icons.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-edge">
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                    Icon
                  </th>
                  {WEIGHTS.map((w) => (
                    <th
                      key={w}
                      className="px-3 py-2 text-center font-semibold text-muted-foreground capitalize"
                    >
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHOWCASE_ICONS.map(({ name, Icon }) => (
                  <tr key={name} className="border-b border-edge/50">
                    <td className="px-3 py-2.5 text-muted-foreground font-mono text-xs">
                      {name}
                    </td>
                    {WEIGHTS.map((w) => (
                      <td key={w} className="px-3 py-2.5 text-center">
                        <Icon weight={w} className="size-5 inline-block" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-2">Icon Sizes</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Size tokens map to Tailwind sizing utilities. Use{" "}
            <code>className=&quot;size-N&quot;</code> to control icon dimensions.
          </p>
          <div className="space-y-3">
            {ICON_SIZES.map(({ name, px }) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-10 text-sm text-muted-foreground text-right font-mono">
                  {name}
                </span>
                <Star
                  weight="bold"
                  style={{ width: px, height: px }}
                />
                <span className="text-xs text-muted-foreground">
                  {px}px
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-2">Usage</h3>
          <div className="rounded-2xl bg-muted/50 p-6 font-mono text-sm space-y-1.5 text-muted-foreground">
            <p>
              <span className="text-primary-400">import</span>
              {" { Star } "}
              <span className="text-primary-400">from</span>
              {' "@phosphor-icons/react"'}
            </p>
            <p className="mt-3">
              {"<Star weight=\"bold\" className=\"size-5\" />"}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
