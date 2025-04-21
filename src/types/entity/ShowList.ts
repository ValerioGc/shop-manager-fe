// types/entity/ShowList.ts

export interface ShowList {
    id: number;
    label_ita: string;
    label_eng: string;
    link?: string;
    image_url?: string;
    start_date: string;
    end_date?: string;
    location: string;
}
