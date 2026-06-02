export interface Part {
  id: string;
  name: string;
  store: string;
  distance: string;
  price: number;
  brand: string;
  compatible: string;
  code: string;
  stock: number;
  emoji: string;
}

export const mockParts: Part[] = [
  {
    id: '1',
    name: 'Filtro de óleo Bosch',
    store: 'AutoCenter SP',
    distance: '2,3 km',
    price: 45.90,
    brand: 'Honda',
    compatible: 'Honda Civic 2018-2023',
    code: 'BOX-3330',
    stock: 12,
    emoji: '⚙️',
  },
  {
    id: '2',
    name: 'Pastilha de freio Fras-le',
    store: 'Peças Rápidas RJ',
    distance: '3,1 km',
    price: 89.00,
    brand: 'Toyota',
    compatible: 'Toyota Corolla 2019-2023',
    code: 'FRS-441',
    stock: 5,
    emoji: '🛞',
  },
  {
    id: '3',
    name: 'Vela de ignição NGK',
    store: 'MotoPartes NIT',
    distance: '1,8 km',
    price: 32.00,
    brand: 'VW',
    compatible: 'VW Gol 2015-2022',
    code: 'NGK-BKR6',
    stock: 20,
    emoji: '🔩',
  },
  {
    id: '4',
    name: 'Correia dentada Gates',
    store: 'AutoCenter SP',
    distance: '2,3 km',
    price: 120.00,
    brand: 'Ford',
    compatible: 'Ford Ka 2018-2021',
    code: 'GAT-5521',
    stock: 8,
    emoji: '🔧',
  },
  {
    id: '5',
    name: 'Amortecedor Monroe',
    store: 'Peças Rápidas RJ',
    distance: '3,1 km',
    price: 210.00,
    brand: 'Chevrolet',
    compatible: 'Chevrolet Onix 2019-2023',
    code: 'MNR-032',
    stock: 4,
    emoji: '🚗',
  },
  {
    id: '6',
    name: 'Filtro de ar Mann',
    store: 'MotoPartes NIT',
    distance: '1,8 km',
    price: 38.50,
    brand: 'Honda',
    compatible: 'Honda HRV 2017-2022',
    code: 'MNN-C2840',
    stock: 15,
    emoji: '💨',
  },
];

export const brands = ['Todas', 'Honda', 'Toyota', 'VW', 'Ford', 'Chevrolet'];
