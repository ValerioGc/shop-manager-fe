import { defineStore } from 'pinia';

interface Breadcrumb {
  lvl: number;
  label_ita: string;
  label_eng: string;
  expandedIndex: number | null;
  parent_index: number | null;
}

const standard_breadcrumb: Breadcrumb[] = [
  { lvl: 0, label_ita: 'Ultimi Arrivi', label_eng: 'Latest Arrivals', expandedIndex: null, parent_index: null },
  { lvl: 1, label_ita: '', label_eng: '', expandedIndex: null, parent_index: null },
  { lvl: 2, label_ita: '', label_eng: '', expandedIndex: null, parent_index: null }
];

/**
 * This store is used to manage the breadcrumbs in the product page
 * The breadcrumbs are used to navigate the categories and subcategories of the products
 * The breadcrumbs are stored in the session storage so they are not lost
 * when the page is refreshed and they are shared between the product page
 */
export const product_settings_store = defineStore('product_settings_store', {
  state: (): { breadcrumbs: Breadcrumb[] } => ({
    breadcrumbs: sessionStorage.getItem('breadcrumbs')
      ? JSON.parse(sessionStorage.getItem('breadcrumbs')!) as Breadcrumb[]
      : [...standard_breadcrumb],
  }),
  getters: {
    getBreadcrumbs(state): Breadcrumb[] {
      return state.breadcrumbs;
    },
    getExpandedCategoryIndex(state): number | null {
      return state.breadcrumbs[0].expandedIndex;
    },
    getExpandedInnerCategoryIndex(state): number | null {
      return state.breadcrumbs[1].expandedIndex;
    },
    getSubCategoryIndex(state): number | null {
      return state.breadcrumbs[2].expandedIndex;
    }
  },
  actions: {
    saveSessionData(): void {
      sessionStorage.setItem('breadcrumbs', JSON.stringify(this.breadcrumbs));
    },
    loadSessionData(): void {
      this.breadcrumbs = sessionStorage.getItem('breadcrumbs')
        ? JSON.parse(sessionStorage.getItem('breadcrumbs')!) as Breadcrumb[]
        : [...standard_breadcrumb];
    },
    setBreadcrumb(
      level: number,
      labelIta: string,
      labelEng: string,
      id: number | null,
      macroIndex: number | null
    ): void {
      const item: Breadcrumb = { lvl: level, label_ita: labelIta, label_eng: labelEng, expandedIndex: id, parent_index: macroIndex };
      if (item.lvl === 0) {
        this.breadcrumbs[0] = item;
        this.breadcrumbs[1] = { lvl: 1, label_ita: '', label_eng: '', expandedIndex: null, parent_index: null };
        this.breadcrumbs[2] = { lvl: 2, label_ita: '', label_eng: '', expandedIndex: null, parent_index: null };
      } else if (item.lvl === 1) {
        this.breadcrumbs[1] = item;
        this.breadcrumbs[2] = { lvl: 2, label_ita: '', label_eng: '', expandedIndex: null, parent_index: null };
      } else {
        this.breadcrumbs[2] = item;
      }
      this.saveSessionData();
    },
    resetBreadcrumbs(): void {
      this.breadcrumbs = [...standard_breadcrumb];
      this.saveSessionData();
    }
  }
});
