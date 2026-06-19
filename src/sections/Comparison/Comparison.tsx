import { SectionShell } from '../../lib/SectionShell';

export function ComparisonA() {
  return (
    <SectionShell>
      <div className="cmp-scroll">
        <table className="cmp">
          <thead><tr><th></th><th>Starter</th><th className="cmp__pop">Team</th><th>Enterprise</th></tr></thead>
          <tbody>
            <tr><th>Projects</th><td>1</td><td className="cmp__pop">Unlimited</td><td>Unlimited</td></tr>
            <tr><th>Components</th><td>Core</td><td className="cmp__pop">All 64</td><td>All 64</td></tr>
            <tr><th>Dark mode &amp; themes</th><td className="cmp__no">—</td><td className="cmp__pop"><span className="cmp__yes">✓</span></td><td><span className="cmp__yes">✓</span></td></tr>
            <tr><th>SSO &amp; SAML</th><td className="cmp__no">—</td><td className="cmp__pop cmp__no">—</td><td><span className="cmp__yes">✓</span></td></tr>
            <tr><th>Support</th><td>Community</td><td className="cmp__pop">Priority</td><td>Dedicated</td></tr>
            <tr><th></th><td><button className="srx-btn srx-btn--outline srx-btn--sm">Start</button></td><td className="cmp__pop"><button className="srx-btn srx-btn--primary srx-btn--sm">Choose Team</button></td><td><button className="srx-btn srx-btn--outline srx-btn--sm">Contact</button></td></tr>
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

export function Comparison() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Plans × features, popular highlighted</span><ComparisonA /></div>
    </div>
  );
}
