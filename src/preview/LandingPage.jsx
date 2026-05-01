import CtaPreview from "../sections/cta/CtaPreview.jsx";
import FaqPreview from "../sections/faq/FaqPreview.jsx";
import FooterPreview from "../sections/footer/FooterPreview.jsx";
import HeroPreview from "../sections/hero/HeroPreview.jsx";
import ProblemsPreview from "../sections/problems/ProblemsPreview.jsx";
import SolutionsPreview from "../sections/solutions/SolutionsPreview.jsx";
import TeamPreview from "../sections/team/TeamPreview.jsx";
import TestimonialsPreview from "../sections/testimonials/TestimonialsPreview.jsx";
import ValuePreview from "../sections/value/ValuePreview.jsx";

export function LandingPage({ project }) {
  return (
    <>
      <HeroPreview project={project} />
      <main>
        <ProblemsPreview section={project.sections.problems} />
        <SolutionsPreview section={project.sections.solutions} />
        <ValuePreview project={project} />
        <TeamPreview section={project.sections.team} />
        <TestimonialsPreview section={project.sections.testimonials} />
        <CtaPreview project={project} />
        <FaqPreview project={project} />
      </main>
      <FooterPreview project={project} />
    </>
  );
}

export default LandingPage;
