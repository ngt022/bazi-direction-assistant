import { FormEvent } from "react";
import { BarChart3, Compass, MessageCircleQuestion, Sparkles } from "lucide-react";
import { DisclaimerFooter } from "@/components/site/DisclaimerFooter";
import { HeroSection } from "@/components/site/HeroSection";
import { OnboardingForm } from "./OnboardingForm";
import { SiteHeader } from "./SiteHeader";
import { FAQSection } from "./FAQSection";
import { ProductFeatures } from "./ProductFeatures";

type Props = {
  busy: boolean;
  error: string;
  onRegister: (event: FormEvent<HTMLFormElement>) => void;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
};

const bottomNav = [
  ["#top", Compass, "排盘"],
  ["#faq", MessageCircleQuestion, "常见问题"],
] as const;

export function PublicHome(props: Props) {
  return (
    <main className="product-home">
      <SiteHeader />

      <HeroSection busy={props.busy} error={props.error} onRegister={props.onRegister} onLogin={props.onLogin} />

      <section id="start" className="product-section" style={{ paddingBlock: "64px", background: "#0d1013" }}>
        <div className="product-shell" style={{ maxWidth: 720, marginInline: "auto" }}>
          <OnboardingForm busy={props.busy} error={props.error} onRegister={props.onRegister} onLogin={props.onLogin} />
        </div>
      </section>

      <ProductFeatures />

      <FAQSection />

      <DisclaimerFooter />

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-[rgba(216,180,142,0.22)] bg-[rgba(9,11,14,0.96)] px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.2)] backdrop-blur xl:hidden">
        {bottomNav.map(([href, Icon, label]) => (
          <a
            key={href}
            href={href}
            className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-xs text-[#aaa59b]"
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
      </nav>
    </main>
  );
}
