import { SectionShell } from '../../lib/SectionShell';
import { Accordion } from '../../components/disclosure/Accordion';

const FAQ_ITEMS = [
  { value: '0', title: 'How do I install it?', content: 'Link one stylesheet in your <head>. styles.css is an import manifest that pulls in scales, tokens and components.' },
  { value: '1', title: 'Can I change the accent color?', content: 'Repoint the accent token block — every component, state and shadow follows automatically.' },
  { value: '2', title: 'Is dark mode included?', content: 'Yes. Add class="dark" to <html> or any subtree and the whole surface flips.' },
];

export function FaqA() {
  return (
    <SectionShell wrap="sx-faq__wrap">
      <Accordion id="faqAcc" type="single" collapsible defaultValue="0" items={FAQ_ITEMS} />
    </SectionShell>
  );
}

export function FaqB() {
  return (
    <SectionShell wrap="sx-faq2 sx-gap-6">
      <div className="col sx-faq__item"><strong>What's the license?</strong><span className="muted sx-body-s">MIT — use it in commercial products freely.</span></div>
      <div className="col sx-faq__item"><strong>Does it need a build step?</strong><span className="muted sx-body-s">No. It works from a CDN link, or self-host for production.</span></div>
      <div className="col sx-faq__item"><strong>Which frameworks?</strong><span className="muted sx-body-s">Components are React; tokens and classes are framework-agnostic.</span></div>
      <div className="col sx-faq__item"><strong>Can I extend it?</strong><span className="muted sx-body-s">Yes — add tokens and components; everything composes.</span></div>
    </SectionShell>
  );
}

export function Faq() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Accordion</span><FaqA /></div>
      <div className="variant"><span className="variant__tag">B · 2-column list</span><FaqB /></div>
    </div>
  );
}
