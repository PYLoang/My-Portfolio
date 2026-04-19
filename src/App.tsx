import { Nav } from './components/ui/Nav';
import { Reveal } from './components/ui/Reveal';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { TechStack } from './sections/TechStack';
import { Projects } from './sections/Projects';
import { Experience } from './sections/Experience';
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
        <Reveal><About /></Reveal>
        <Reveal><TechStack /></Reveal>
        <Reveal><Projects /></Reveal>
        <Reveal><Experience /></Reveal>
        <Reveal><Services /></Reveal>
        <Reveal><Certificates /></Reveal>
        <Reveal><Contact /></Reveal>
      </main>
    </>
  );
}
