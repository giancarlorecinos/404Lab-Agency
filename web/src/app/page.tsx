import { Hero } from "@/components/sections/hero";
import { NeuralNet } from "@/components/sections/neural-net";
import { Citadel } from "@/components/sections/citadel";
import { Simulation } from "@/components/sections/simulation";
import { Terminal } from "@/components/sections/terminal";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <Hero />
      <NeuralNet />
      <Citadel />
      <Simulation />
      <Terminal />
    </main>
  );
}
