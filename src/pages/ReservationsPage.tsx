import { useState } from 'react';
import { useReservations, ReservationStatus } from '@/hooks/useReservations';
import { TABLES_COUNT } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Calendar, Users, Clock, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const statusConfig: Record<ReservationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  ANNULEE: { label: 'Annulée', variant: 'destructive' },
  HONOREE: { label: 'Honorée', variant: 'secondary' },
};

export default function ReservationsPage() {
  const { user } = useAuth();
  const { reservations, loading, createReservation, updateReservationStatus } = useReservations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<ReservationStatus | 'ALL'>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    table_number: '',
    reserved_at: '',
    nom_client: '',
    nb_personnes: '',
    note: '',
  });

  const filteredReservations = filter === 'ALL'
    ? reservations
    : reservations.filter(r => r.status === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.table_number || !formData.reserved_at || !user) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await createReservation({
      table_number: parseInt(formData.table_number),
      reserved_at: new Date(formData.reserved_at),
      nom_client: formData.nom_client || undefined,
      nb_personnes: formData.nb_personnes ? parseInt(formData.nb_personnes) : undefined,
      note: formData.note || undefined,
      created_by: user.id,
    });

    setIsSubmitting(false);

    if (!error) {
      setFormData({ table_number: '', reserved_at: '', nom_client: '', nb_personnes: '', note: '' });
      setIsDialogOpen(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ReservationStatus) => {
    await updateReservationStatus(id, status);
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
          <h1 className="font-display text-3xl font-bold text-foreground">Réservations</h1>
          <p className="text-muted-foreground mt-1">Gérez les réservations de tables</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="accent">
              <Plus className="w-4 h-4" />
              Nouvelle réservation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Nouvelle réservation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Table *</label>
                  <Select 
                    value={formData.table_number} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, table_number: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: TABLES_COUNT }, (_, i) => i + 1).map(num => (
                        <SelectItem key={num} value={num.toString()}>Table {num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Personnes</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.nb_personnes}
                    onChange={(e) => setFormData(prev => ({ ...prev, nb_personnes: e.target.value }))}
                    placeholder="2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date et heure *</label>
                <Input
                  type="datetime-local"
                  value={formData.reserved_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, reserved_at: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du client</label>
                <Input
                  type="text"
                  value={formData.nom_client}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom_client: e.target.value }))}
                  placeholder="M. Dupont"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Note</label>
                <Input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Anniversaire, allergies..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="accent" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
        {(Object.keys(statusConfig) as ReservationStatus[]).map(status => (
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

      {/* Reservations list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReservations.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Aucune réservation trouvée
          </div>
        ) : (
          filteredReservations.map(reservation => {
            const config = statusConfig[reservation.status];
            
            return (
              <div 
                key={reservation.id} 
                className="bg-card rounded-xl border border-border p-5 shadow-soft hover:shadow-elevated transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-primary">
                        {reservation.table_number}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Table {reservation.table_number}</p>
                      <Badge variant={config.variant} className="mt-1">
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(reservation.reserved_at).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(reservation.reserved_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {reservation.nb_personnes && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{reservation.nb_personnes} personnes</span>
                    </div>
                  )}
                  {reservation.nom_client && (
                    <p className="font-medium text-foreground pt-2">{reservation.nom_client}</p>
                  )}
                  {reservation.note && (
                    <p className="text-muted-foreground italic">"{reservation.note}"</p>
                  )}
                </div>

                {reservation.status === 'ACTIVE' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(reservation.id, 'HONOREE')}
                    >
                      <Check className="w-4 h-4" />
                      Honorée
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(reservation.id, 'ANNULEE')}
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
