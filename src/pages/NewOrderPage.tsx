import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProductGrid } from '@/components/orders/ProductGrid';
import { OrderSummary } from '@/components/orders/OrderSummary';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { OrderItem } from '@/types';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewOrderPage() {
  const [searchParams] = useSearchParams();
  const tableNumber = parseInt(searchParams.get('table') || '1', 10);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { products, loading: productsLoading } = useProducts();
  const { createOrder } = useOrders();
  
  const [items, setItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeProducts = products.filter(p => p.actif);
  const filteredProducts = activeProducts.filter(p => 
    p.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = useCallback((product: { id: string; nom: string; prix: number }) => {
    setItems(prev => {
      const existing = prev.find(item => item.produit_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.produit_id === product.id 
            ? { ...item, qte: item.qte + 1 }
            : item
        );
      }
      return [...prev, {
        produit_id: product.id,
        nom: product.nom,
        prix: product.prix,
        qte: 1
      }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((produit_id: string, delta: number) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.produit_id === produit_id) {
          const newQte = item.qte + delta;
          return newQte > 0 ? { ...item, qte: newQte } : null;
        }
        return item;
      }).filter(Boolean) as OrderItem[];
      return updated;
    });
  }, []);

  const handleRemoveItem = useCallback((produit_id: string) => {
    setItems(prev => prev.filter(item => item.produit_id !== produit_id));
  }, []);

  const handleConfirm = async () => {
    if (items.length === 0 || !user) return;
    
    setIsSubmitting(true);
    const total = items.reduce((sum, item) => sum + item.prix * item.qte, 0);
    
    const { error } = await createOrder({
      table_number: tableNumber,
      serveur_id: user.id,
      items_json: items,
      total,
    });

    setIsSubmitting(false);
    
    if (!error) {
      navigate('/dashboard');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Nouvelle commande
          </h1>
          <p className="text-muted-foreground">Table {tableNumber}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Products section */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ProductGrid products={filteredProducts} onAddProduct={handleAddProduct} />
          </div>
        </div>

        {/* Order summary */}
        <div className="min-h-0">
          <OrderSummary
            items={items}
            tableNumber={tableNumber}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
