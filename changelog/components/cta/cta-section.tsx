import React from "react";
import CTABackground from "./cta-background";
import CTATextBox from "./cta-text-box";

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-section-container --scroll -scroll-animation --title-animation-container -scroll-animated -title-animated">
          <img className="cta-section__unit" src="/unit.png" alt="sitename.com" />
          <div className="cta-section__block">
            <CTATextBox />
            <CTABackground />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
