import { NavbarA, HeroA, FooterA } from 'raditz';
import { ThemeRuntime } from './ThemeRuntime';

export default function App() {
  return (
    <>
      <ThemeRuntime />
      {/* .rdz-page flattens the per-section preview frame so sections stack
          seamlessly edge-to-edge and the Navbar pins sticky. Compose every real
          page's sections inside it. */}
      <div className="rdz-page">
        <NavbarA
          brand={{ name: 'Your brand', href: '/' }}
          links={[{ label: 'Home', href: '/' }]}
          actions={[{ label: 'Get started', href: '#' }]}
        />
        <HeroA
          title="Hello from Raditz"
          lede="Replace this with your own sections — discover them in node_modules/raditz/catalog/llms.txt."
          actions={[{ label: 'Get started', href: '#' }]}
        />
        <FooterA brand={{ name: 'Your brand' }} copyright="© Your brand" />
      </div>
    </>
  );
}
