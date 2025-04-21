// types/entity/Show.ts

export interface Show {
    id: number;
    label_ita: string;
    label_eng: string;
    description_ita: string;
    description_eng: string;
    start_date: string;
    link: string;
    location: string;
    end_date?: string;
    image_url?: string;
    images_url?: string[];
}
