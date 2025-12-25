import { Order, Reservation, Table } from '@/types';

export const TABLES_COUNT = 12;

export function getTablesWithStatus(orders: Order[], reservations: Reservation[]): Table[] {
  const tables: Table[] = [];
  
  for (let i = 1; i <= TABLES_COUNT; i++) {
    const activeOrder = orders.find(o => o.table_number === i && o.status === 'EN_COURS');
    const activeReservation = reservations.find(
      r => r.table_number === i && 
      r.status === 'ACTIVE' && 
      new Date(r.reserved_at).getTime() - Date.now() < 1000 * 60 * 60 // within 1 hour
    );
    
    let status: Table['status'] = 'libre';
    if (activeOrder) status = 'occupee';
    else if (activeReservation) status = 'reservee';
    
    tables.push({
      number: i,
      status,
      currentOrder: activeOrder,
      reservation: activeReservation,
    });
  }
  
  return tables;
}
