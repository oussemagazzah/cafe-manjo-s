import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OrderItem {
  produit_id: string;
  nom: string;
  prix: number;
  qte: number;
}

export type OrderStatus = 'EN_COURS' | 'SERVIE' | 'ANNULEE' | 'PAYEE';

export interface Order {
  id: string;
  table_number: number;
  serveur_id: string;
  serveur_name?: string;
  items_json: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('commandes')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Get unique serveur IDs
      const serveurIds = [...new Set(ordersData.map(o => o.serveur_id))];

      // Fetch profiles for all serveurs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', serveurIds);

      if (profilesError) throw profilesError;

      // Create a map of serveur_id to username
      const serveurMap = new Map(
        (profilesData || []).map(p => [p.id, p.username])
      );

      // Map orders with serveur names
      setOrders(ordersData.map(o => ({
        id: o.id,
        table_number: o.table_number,
        serveur_id: o.serveur_id,
        serveur_name: serveurMap.get(o.serveur_id),
        items_json: o.items_json as unknown as OrderItem[],
        total: Number(o.total),
        status: o.status as OrderStatus,
        createdAt: new Date(o.created_at),
        updatedAt: o.updated_at ? new Date(o.updated_at) : undefined,
      })));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (data: { 
    table_number: number; 
    serveur_id: string;
    items_json: OrderItem[];
    total: number;
  }) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .insert([{
          table_number: data.table_number,
          serveur_id: data.serveur_id,
          items_json: data.items_json as unknown as any,
          total: data.total,
          status: 'EN_COURS',
        }]);

      if (error) throw error;

      toast.success(`Commande créée pour la table ${data.table_number}`);
      fetchOrders();
      return { error: null };
    } catch (error: any) {
      toast.error('Erreur lors de la création de la commande');
      return { error };
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Commande mise à jour');
      fetchOrders();
      return { error: null };
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
      return { error };
    }
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders,
  };
}
