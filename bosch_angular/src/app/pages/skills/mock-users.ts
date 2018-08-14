import { StationUser } from '../station_user';

export const STATION_USERS: Array<StationUser> = [
    {
        card_id: '1234567890',
        user_number: '12345678',
        name: 'mabo',
        img_path: 'mabo.jpg',
        authority: [
            {"station": "ST10", "value": false},
            {"station": "ST20", "value": false},
            {"station": "ST30", "value": false},
            {"station": "ST40", "value": false},
            {"station": "ST50", "value": false},
            {"station": "ST60", "value": false},
            {"station": "ST70", "value": false},
        ]
    },
    {
        card_id: '1234567890',
        user_number: '87654321',
        name: 'mabo',
        img_path: 'mabo.jpg',
        authority: [
            {"station": "ST10", "value": true},
            {"station": "ST20", "value": false},
            {"station": "ST30", "value": false},
            {"station": "ST40", "value": true},
            {"station": "ST50", "value": true},
            {"station": "ST60", "value": true},
            {"station": "ST70", "value": true},
        ]
    },
];