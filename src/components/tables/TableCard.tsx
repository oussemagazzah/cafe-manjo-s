import { Table } from '@/types';
import { cn } from '@/lib/utils';
import { Users, Clock, Calendar } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
}

export function TableCard({ table, onClick }: TableCardProps) {
  const statusConfig = {
    libre: {
      bg: 'bg-success/10 hover:bg-success/20 border-success/30',
      text: 'text-success',
      label: 'Libre',
    },
    occupee: {
      bg: 'bg-warning/10 hover:bg-warning/20 border-warning/30',
      text: 'text-warning',
      label: 'Occupée',
    },
    reservee: {
      bg: 'bg-primary/10 hover:bg-primary/20 border-primary/30',
      text: 'text-primary',
      label: 'Réservée',
    },
  };

  const config = statusConfig[table.status];

  return (
    <button
      onClick={() => onClick(table)}
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-200 text-left w-full",
        "shadow-soft hover:shadow-elevated active:scale-[0.98]",
        config.bg
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center shadow-soft">
          <span className="font-display text-xl font-bold text-foreground">{table.number}</span>
        </div>
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", config.bg, config.text)}>
          {config.label}
        </span>
      </div>

      {table.status === 'occupee' && table.currentOrder && (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{table.currentOrder.items_json.length} articles</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(table.currentOrder.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className="font-semibold text-foreground mt-2">
            {table.currentOrder.total.toFixed(3)} DT
          </p>
        </div>
      )}

      {table.status === 'reservee' && table.reservation && (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(table.reservation.reserved_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {table.reservation.nom_client && (
            <p className="font-medium text-foreground">{table.reservation.nom_client}</p>
          )}
          {table.reservation.nb_personnes && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{table.reservation.nb_personnes} personnes</span>
            </div>
          )}
        </div>
      )}

      {table.status === 'libre' && (
        <p className="text-sm text-muted-foreground">Cliquez pour créer une commande</p>
      )}
    </button>
  );
}
