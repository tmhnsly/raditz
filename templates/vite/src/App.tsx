import { Button } from 'raditz';
import { ThemeRuntime } from './ThemeRuntime';

export default function App() {
  return (
    <>
      <ThemeRuntime />
      <main style={{ padding: '2rem' }}>
        <Button>Hello from Raditz</Button>
      </main>
    </>
  );
}
