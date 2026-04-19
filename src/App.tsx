import { Nav } from './components/ui/Nav';
import { Hero } from './sections/Hero';

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}
