// types/entity/Category.ts

export interface Category {
    id: number;
    label_ita: string;
    label_eng: string;
    description_ita?: string;
    description_eng?: string;
    sub_categories: Category[];
    categories: Category[];
}
