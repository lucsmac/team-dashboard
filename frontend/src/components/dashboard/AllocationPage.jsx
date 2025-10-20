import { DevAllocationManager } from '../allocation/DevAllocationManager';

/**
 * Página de Alocação Semanal
 */
export function AllocationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alocação Semanal</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie onde cada membro do time está alocado durante as semanas
        </p>
      </div>

      <DevAllocationManager />
    </div>
  );
}
