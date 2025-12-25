import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ReservationStatus = 'ACTIVE' | 'ANNULEE' | 'HONOREE';

export interface Reservation {
  id: string;
  table_number: number;
  reserved_at: Date;
  nom_client?: string;
  nb_personnes?: number;
  note?: string;
  status: ReservationStatus;
  created_by: string;
  createdAt: Date;
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('reserved_at', { ascending: true });

      if (error) throw error;

      setReservations(data.map(r => ({
        id: r.id,
        table_number: r.table_number,
        reserved_at: new Date(r.reserved_at),
        nom_client: r.nom_client ?? undefined,
        nb_personnes: r.nb_personnes ?? undefined,
        note: r.note ?? undefined,
        status: r.status as ReservationStatus,
        created_by: r.created_by,
        createdAt: new Date(r.created_at),
      })));
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const createReservation = async (data: {
    table_number: number;
    reserved_at: Date;
    nom_client?: string;
    nb_personnes?: number;
    note?: string;
    created_by: string;
  }) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .insert([{
          table_number: data.table_number,
          reserved_at: data.reserved_at.toISOString(),
          nom_client: data.nom_client,
          nb_personnes: data.nb_personnes,
          note: data.note,
          created_by: data.created_by,
          status: 'ACTIVE',
        }]);

      if (error) throw error;

      toast.success('Réservation créée avec succès');
      fetchReservations();
      return { error: null };
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Une réservation existe déjà pour cette table à cette heure');
      } else {
        toast.error('Erreur lors de la création de la réservation');
      }
      return { error };
    }
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Réservation mise à jour');
      fetchReservations();
      return { error: null };
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
      return { error };
    }
  };

  return {
    reservations,
    loading,
    createReservation,
    updateReservationStatus,
    refetch: fetchReservations,
  };
}
