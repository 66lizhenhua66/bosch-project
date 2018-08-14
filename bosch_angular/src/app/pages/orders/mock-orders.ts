import { Order } from './order';

export const ORDERS: Order[] = [
    {program_number: 'R111111111', order_number: '1234567', sn_number: '12345678', is_publish: true},
    {program_number: 'R111111111', order_number: '1234567', sn_number: '12345679', is_publish: true},
    {program_number: 'R222222222', order_number: '1234567', sn_number: '12345681', is_publish: true},
    {program_number: 'R222222222', order_number: '1234567', sn_number: '12345682', is_publish: true},
];

export const PROGRAM_NUMBERS: string[] = [
    'R111111111',
    'R222222222',
    'R333333333',
]