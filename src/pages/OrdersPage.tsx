import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders, OrderStatus } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, CheckCircle, XCircle, CreditCard, Loader2 } from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ComponentType<{ className?: string }> }> = {
  EN_COURS: { label: 'En cours', variant: 'secondary', icon: Clock },
  SERVIE: { label: 'Servie', variant: 'outline', icon: CheckCircle },
  ANNULEE: { label: 'Annulée', variant: 'destructive', icon: XCircle },
  PAYEE: { label: 'Payée', variant: 'default', icon: CreditCard },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, loading, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Commandes</h1>
          <p className="text-muted-foreground mt-1">Gérez toutes les commandes</p>
        </div>
        <Button variant="accent" onClick={() => navigate('/commandes/nouvelle?table=1')}>
          <Plus className="w-4 h-4" />
          Nouvelle commande
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'ALL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('ALL')}
        >
          Toutes
        </Button>
        {(Object.keys(statusConfig) as OrderStatus[]).map(status => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {statusConfig[status].label}
          </Button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucune commande trouvée
          </div>
        ) : (
          filteredOrders.map(order => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            
            return (
              <div 
                key={order.id} 
                className="bg-card rounded-xl border border-border p-5 shadow-soft hover:shadow-elevated transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Order info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-display text-xl font-bold text-foreground">
                        Table {order.table_number}
                      </span>
                      <Badge variant={config.variant} className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Serveur: {order.serveur_name || 'N/A'}</p>
                      <p>
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Articles:</p>
                    <div className="flex flex-wrap gap-1">
                      {order.items_json.map((item, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-muted px-2 py-1 rounded-md"
                        >
                          {item.nom} ×{item.qte}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Total and actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-display text-xl font-bold text-foreground">
                        {order.total.toFixed(3)} DT
                      </p>
                    </div>

                    {order.status === 'EN_COURS' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'SERVIE')}
                        >
                          Servie
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'ANNULEE')}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}

                    {order.status === 'SERVIE' && (
                      <Button 
                        variant="accent" 
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, 'PAYEE')}
                      >
                        <CreditCard className="w-4 h-4" />
                        Encaisser
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
