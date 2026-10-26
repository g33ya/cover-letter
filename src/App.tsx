import { useLayoutEffect } from "react";
import KineticHero from "./components/KineticHero/KineticHero";
import TechnicalSection from "./components/TechnicalSection/TechnicalSection";
import PeopleSection from "./components/PeopleSection/PeopleSection";
import HenHacksSection from "./components/HenHacksSection/HenHacksSection";
import LeanTaaSSection from "./components/LeanTaaSSection/LeanTaaSSection";


function App() {
  useLayoutEffect(() => {
    // On a Vite SPA's first load, native fragment navigation can precede React.
    // Resolve it once after the chapter nodes mount; later anchors stay native.
    let id: string;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    if (!["hero", "technical", "people", "henhacks", "leantaas", "process"].includes(id)) return;
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "instant", block: "start" });
    target?.focus({ preventScroll: true });
  }, []);

  return (
    <main>
      <KineticHero />
      <TechnicalSection />
      <PeopleSection />
      <HenHacksSection />
      <LeanTaaSSection />
    </main>
  );
}

export default App;