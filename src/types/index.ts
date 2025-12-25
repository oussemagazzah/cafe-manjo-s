export type UserRole = 'ADMIN' | 'SERVEUR';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  nom: string;
  prix: number;
  actif: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

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

export interface Table {
  number: number;
  status: 'libre' | 'occupee' | 'reservee';
  currentOrder?: Order;
  reservation?: Reservation;
}
