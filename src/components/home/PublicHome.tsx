import { FormEvent } from "react";
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
    </main>
  );
}
