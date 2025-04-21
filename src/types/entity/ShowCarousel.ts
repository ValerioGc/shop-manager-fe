// types/entity/ShowCarousel.ts

export interface ShowCarousel {
    id: number;
    label_ita: string;
    label_eng: string;
    image_url?: string;
    start_date: string;
    end_date?: string;
    link?: string;
    location: string;
}
