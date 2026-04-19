import { Nav } from './components/ui/Nav';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { TechStack } from './sections/TechStack';
import { Projects } from './sections/Projects';
import { Services } from './sections/Services';
import { Certificates } from './sections/Certificates';
import { Contact } from './sections/Contact';

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Services />
        <Certificates />
        <Contact />
      </main>
    </>
  );
}
