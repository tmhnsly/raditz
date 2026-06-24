import { useEffect, useState } from 'react';

// Tiny dependency-free hash router. The route is the slug after "#/", so
// "#/components/actions/button" → "components/actions/button" and "" → overview.
const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));

export function useHashRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (slug: string) => {
    window.location.hash = slug ? '/' + slug : '/';
    // hashchange doesn't fire when setting the same value — keep state in sync.
    setRoute(slug);
  };

  return { route, navigate };
}
