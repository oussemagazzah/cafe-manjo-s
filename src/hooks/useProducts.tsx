import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
  id: string;
  nom: string;
  prix: number;
  actif: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .order('nom');

      if (error) throw error;

      setProducts(data.map(p => ({
        id: p.id,
        nom: p.nom,
        prix: Number(p.prix),
        actif: p.actif,
        createdAt: new Date(p.created_at),
        updatedAt: p.updated_at ? new Date(p.updated_at) : undefined,
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: { nom: string; prix: number; actif: boolean }) => {
    try {
      const { error } = await supabase
        .from('produits')
        .insert([data]);

      if (error) throw error;

      toast.success('Produit ajouté');
      fetchProducts();
      return { error: null };
    } catch (error: any) {
      toast.error('Erreur lors de la création du produit');
      return { error };
    }
  };

  const updateProduct = async (id: string, data: { nom?: string; prix?: number; actif?: boolean }) => {
    try {
      const { error } = await supabase
        .from('produits')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast.success('Produit modifié');
      fetchProducts();
      return { error: null };
    } catch (error: any) {
      toast.error('Erreur lors de la modification du produit');
      return { error };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Produit supprimé');
      fetchProducts();
      return { error: null };
    } catch (error: any) {
      toast.error('Erreur lors de la suppression du produit');
      return { error };
    }
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}
