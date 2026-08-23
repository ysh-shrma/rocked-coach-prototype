"use client";

import { useState } from "react";
import { ManagerShell, RepDetail, TeamList } from "@/components/Manager";
import { rankedByGap, repById, reps as seedReps, type AssignedTraining } from "@/data/reps";

export default function ManagerPage() {
  const ranked = rankedByGap(seedReps);
  const [selectedId, setSelectedId] = useState(ranked[0].id);
  const [assignedByRep, setAssignedByRep] = useState<Record<string, AssignedTraining[]>>(
    Object.fromEntries(seedReps.map((r) => [r.id, r.assigned])),
  );

  const rep = repById(selectedId)!;

  return (
    <ManagerShell>
      <TeamList reps={ranked} selectedId={selectedId} onSelect={setSelectedId} />
      <RepDetail
        rep={rep}
        assigned={assignedByRep[selectedId] ?? []}
        onAssign={(t) =>
          setAssignedByRep((m) => ({ ...m, [selectedId]: [...(m[selectedId] ?? []), t] }))
        }
      />
    </ManagerShell>
  );
}
