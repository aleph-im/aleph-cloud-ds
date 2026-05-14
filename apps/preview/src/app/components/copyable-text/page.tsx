"use client";

import { CopyableText } from "@aleph-front/ds/copyable-text";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

const HASH = "0x1234567890abcdef1234567890abcdef12345678";
const SHORT = "0x1a2b3c";
const API_KEY = "sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx";

export default function CopyableTextPage() {
  return (
    <>
      <DocHeader
        title="CopyableText"
        description="Truncated text with copy-to-clipboard and optional external link. Click copy to see the stroke-draw micro-animation."
      />

      <DemoSection title="Sizes">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">sm</span>
            <CopyableText text={HASH} size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-8">md</span>
            <CopyableText text={HASH} size="md" />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Custom Truncation">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              startChars=8, endChars=6
            </p>
            <CopyableText text={HASH} startChars={8} endChars={6} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Short text (no truncation)
            </p>
            <CopyableText text={SHORT} />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="With External Link">
        <CopyableText
          text={HASH}
          href="https://explorer.aleph.cloud"
        />
      </DemoSection>

      <DemoSection title="Use Cases">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Wallet address
            </p>
            <CopyableText
              text="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              href="https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">API key</p>
            <CopyableText text={API_KEY} startChars={10} endChars={6} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Transaction hash
            </p>
            <CopyableText
              text="bafy2bzacedxyz123abc456def789ghi012jkl345mno678pqr"
              startChars={8}
              endChars={8}
              href="https://explorer.aleph.cloud"
              size="sm"
            />
          </div>
        </div>
      </DemoSection>
    </>
  );
}
