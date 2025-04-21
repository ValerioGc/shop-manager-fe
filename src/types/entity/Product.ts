// types/entity/Product.ts

import type { Category } from './Category';
import type { Condition } from './Condition';

export interface Product {
    id: number;
    label_ita: string;
    label_eng: string;
    price: number;
    image_url?: string;
    draft: boolean;
    deleting: boolean;
    code?: string;
    condition?: Condition;
    description_eng?: string;
    description_ita?: string;
    images_url?: string[];
    quantity: number;
    year?: string;
    category?: Category[];
    manufacturer?: string;
}
