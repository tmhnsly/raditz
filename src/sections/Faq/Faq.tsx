import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';
import { Accordion } from '../../components/disclosure/Accordion';

const FAQ_ITEMS = [
  { value: '0', title: 'How do I install it?', content: 'Link one stylesheet in your <head>. styles.css is an import manifest that pulls in scales, tokens and components.' },
  { value: '1', title: 'Can I change the accent color?', content: 'Repoint the accent token block — every component, state and shadow follows automatically.' },
  { value: '2', title: 'Is dark mode included?', content: 'Yes — it follows the OS by default with a toggle to override. class="dark" on the root flips every token; content over dark media uses the on-dark surface context.' },
];

export function FaqA({ background = 'surface-2', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="sx-faq__wrap" background={background} {...props}>
      <Accordion id="faqAcc" type="single" collapsible defaultValue="0" items={FAQ_ITEMS} />
    </SectionShell>
  );
}

export function FaqB({ background = 'none', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="sx-faq2 sx-gap-6" background={background} {...props}>
      <div className="col sx-faq__item"><strong>What's the license?</strong><span className="muted sx-body-s">MIT — use it in commercial products freely.</span></div>
      <div className="col sx-faq__item"><strong>Does it need a build step?</strong><span className="muted sx-body-s">No. It works from a CDN link, or self-host for production.</span></div>
      <div className="col sx-faq__item"><strong>Which frameworks?</strong><span className="muted sx-body-s">Components are React; tokens and classes are framework-agnostic.</span></div>
      <div className="col sx-faq__item"><strong>Can I extend it?</strong><span className="muted sx-body-s">Yes — add tokens and components; everything composes.</span></div>
    </SectionShell>
  );
}
