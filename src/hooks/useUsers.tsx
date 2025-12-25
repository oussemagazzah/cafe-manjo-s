import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AppRole = 'ADMIN' | 'SERVEUR';

export interface UserWithRole {
  id: string;
  username: string;
  role: AppRole | null;
  createdAt: Date;
}

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const rolesMap = new Map(roles.map(r => [r.user_id, r.role as AppRole]));

      setUsers(profiles.map(p => ({
        id: p.id,
        username: p.username,
        role: rolesMap.get(p.id) ?? null,
        createdAt: new Date(p.created_at),
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setUserRole = async (userId: string, role: AppRole) => {
    try {
      // First check if role exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role }]);

        if (error) throw error;
      }

      toast.success('Rôle mis à jour');
      fetchUsers();
      return { error: null };
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du rôle');
      return { error };
    }
  };

  const removeUserRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Rôle supprimé');
      fetchUsers();
      return { error: null };
    } catch (error: any) {
      toast.error('Erreur lors de la suppression du rôle');
      return { error };
    }
  };

  return {
    users,
    loading,
    setUserRole,
    removeUserRole,
    refetch: fetchUsers,
  };
}
