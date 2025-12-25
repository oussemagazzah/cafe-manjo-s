import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TableCard } from '@/components/tables/TableCard';
import { getTablesWithStatus, TABLES_COUNT } from '@/data/mockData';
import { useOrders } from '@/hooks/useOrders';
import { useReservations } from '@/hooks/useReservations';
import { Table } from '@/types';
import { ClipboardList, Calendar, TrendingUp, DollarSign, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, loading: ordersLoading } = useOrders();
  const { reservations, loading: reservationsLoading } = useReservations();

  const tables = useMemo(() => getTablesWithStatus(orders, reservations), [orders, reservations]);

  const stats = useMemo(() => {
    const todayOrders = orders.filter(o => 
      new Date(o.createdAt).toDateString() === new Date().toDateString()
    );
    const todayRevenue = todayOrders
      .filter(o => o.status === 'PAYEE')
      .reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter(o => o.status === 'EN_COURS').length;
    const todayReservations = reservations.filter(r => 
      new Date(r.reserved_at).toDateString() === new Date().toDateString() && r.status === 'ACTIVE'
    ).length;

    return { todayOrders: todayOrders.length, todayRevenue, activeOrders, todayReservations };
  }, [orders, reservations]);

  const handleTableClick = (table: Table) => {
    if (table.status === 'libre' || table.status === 'occupee') {
      navigate(`/commandes/nouvelle?table=${table.number}`);
    } else if (table.status === 'reservee') {
      navigate('/reservations');
    }
  };

  const loading = ordersLoading || reservationsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Bonjour, {user?.username}
        </h1>
        <p className="text-muted-foreground mt-1">
          Voici l'aperçu de votre café aujourd'hui
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.activeOrders}</p>
              <p className="text-sm text-muted-foreground">En cours</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.todayOrders}</p>
              <p className="text-sm text-muted-foreground">Commandes</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.todayRevenue.toFixed(3)}</p>
              <p className="text-sm text-muted-foreground">DT Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stats.todayReservations}</p>
              <p className="text-sm text-muted-foreground">Réservations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables grid */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Vue des tables</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {tables.map(table => (
            <TableCard key={table.number} table={table} onClick={handleTableClick} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Libre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Occupée</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Réservée</span>
        </div>
      </div>
    </div>
  );
}
