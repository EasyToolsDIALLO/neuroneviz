"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { BookOpen, Play, Code2, FlaskConical } from "lucide-react";
import { ConceptTab }    from "./ConceptTab";
import { SimulationTab } from "./SimulationTab";
import { CodeTab }       from "./CodeTab";
import { FromScratchTab } from "./FromScratchTab";

interface ArchitectureTabsProps {
  slug:        string;
  color:       string;
  concept:     any;
  simulation:  any;
  codeImpl:    any;
  fromScratch: any;
}

const TABS = [
  { id: "concept",     label: "Concept",    icon: BookOpen },
  { id: "simulation",  label: "Simulation", icon: Play },
  { id: "code",        label: "Code",       icon: Code2 },
  { id: "from-scratch",label: "From Scratch", icon: FlaskConical },
] as const;

export function ArchitectureTabs({ slug, color, concept, simulation, codeImpl, fromScratch }: ArchitectureTabsProps) {
  return (
    <Tabs.Root defaultValue="concept">
      {/* Tab list */}
      <Tabs.List className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <Tabs.Trigger
            key={id}
            value={id}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-500
              data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm
              hover:text-slate-700 transition-all"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="concept"      className="animate-fade-in">
        <ConceptTab     concept={concept}         color={color} slug={slug} />
      </Tabs.Content>
      <Tabs.Content value="simulation"   className="animate-fade-in">
        <SimulationTab  simulation={simulation}   color={color} slug={slug} />
      </Tabs.Content>
      <Tabs.Content value="code"         className="animate-fade-in">
        <CodeTab        codeImpl={codeImpl}        color={color} />
      </Tabs.Content>
      <Tabs.Content value="from-scratch" className="animate-fade-in">
        <FromScratchTab fromScratch={fromScratch}  color={color} />
      </Tabs.Content>
    </Tabs.Root>
  );
}