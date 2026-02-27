import { ThemeSwitcher } from "@ac/components/theme-switcher";
import { PreviewTabs } from "@ac/components/preview-tabs";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="sticky top-0 z-10 flex items-center justify-between
                         bg-background/80 backdrop-blur-sm py-4 mb-8
                         border-b border-edge">
        <h1 className="text-2xl font-heading font-extrabold italic">
          Aleph Cloud DS
        </h1>
        <ThemeSwitcher />
      </header>
      <main>
        <PreviewTabs />
      </main>
    </div>
  );
}
