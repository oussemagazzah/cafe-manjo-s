import { OrderItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (produit_id: string, delta: number) => void;
  onRemoveItem: (produit_id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  tableNumber: number;
  isSubmitting?: boolean;
}

export function OrderSummary({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onConfirm, 
  onCancel,
  tableNumber,
  isSubmitting = false
}: OrderSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.prix * item.qte, 0);

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Commande - Table {tableNumber}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            Aucun article ajouté
          </p>
        ) : (
          items.map(item => (
            <div key={item.produit_id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{item.nom}</p>
                <p className="text-xs text-muted-foreground">{item.prix.toFixed(3)} DT × {item.qte}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateQuantity(item.produit_id, -1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center font-medium text-sm">{item.qte}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateQuantity(item.produit_id, 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => onRemoveItem(item.produit_id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-display text-2xl font-bold text-foreground">{total.toFixed(3)} DT</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="accent" className="flex-1" onClick={onConfirm} disabled={items.length === 0 || isSubmitting}>
            {isSubmitting ? 'Envoi...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
