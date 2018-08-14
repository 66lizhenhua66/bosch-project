import { Auto, Hand } from './step';


export class Program {
    station: string;
    program_number: string;
    product_number?: string;
    detail_program: Array<Auto | Hand>;
}