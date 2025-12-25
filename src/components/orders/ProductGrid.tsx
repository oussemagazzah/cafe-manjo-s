import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export function ProductGrid({ products, onAddProduct }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.filter(p => p.actif).map(product => (
        <button
          key={product.id}
          onClick={() => onAddProduct(product)}
          className={cn(
            "group relative p-4 rounded-xl bg-card border border-border",
            "transition-all duration-200 text-left",
            "hover:border-accent hover:shadow-elevated active:scale-[0.98]"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-foreground text-sm leading-tight">{product.nom}</h3>
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-4 h-4 text-accent" />
            </div>
          </div>
          <p className="font-display font-semibold text-accent">{product.prix.toFixed(3)} DT</p>
        </button>
      ))}
    </div>
  );
}
