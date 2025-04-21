// PageFooter.spec.ts

import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import PageFooter from '../../../components/layout/partials/PageFooter.vue';

// ----- Fake global store -----
const fakeStore = {
    language: 'ita',
    config: {
        titles: {
            footerTitle: {
                ita: 'Footer Title in Italian',
                eng: 'Footer Title in English',
            },
        },
        text: {
            footerText: {
                ita: 'Footer Text in Italian',
                eng: 'Footer Text in English',
            },
        },
    },
};

// Mocking the global_store module
vi.mock('@/stores/global_store', () => ({
    global_store: () => fakeStore,
}));

// ----- Stub for SocialLink component -----
// This stub allows us to verify that the prop "type" is passed correctly.
const SocialLinkStub = {
    name: 'SocialLink',
    props: ['type'],
    template: '<div class="social-link">{{ type }}</div>',
};

describe('PageFooter Component', () => {
    it('renders footer with correct quick contacts title', async () => {
        const wrapper = mount(PageFooter, {
            global: {
                stubs: {
                    SocialLink: SocialLinkStub,
                },
            },
        });

        await flushPromises();

        const footerEl = wrapper.find('footer');
        expect(footerEl.exists()).toBe(true);

        const quickContactsTitle = wrapper.find('.quick_contacts p em');
        expect(quickContactsTitle.exists()).toBe(true);
        expect(quickContactsTitle.text()).toBe(fakeStore.config.titles.footerTitle.ita);
    });

    it('renders SocialLink component with prop type "f"', async () => {
        const wrapper = mount(PageFooter, {
            global: {
                stubs: {
                    SocialLink: SocialLinkStub,
                },
            },
        });

        await flushPromises();

        const socialLink = wrapper.findComponent(SocialLinkStub);
        expect(socialLink.exists()).toBe(true);
        expect(socialLink.text()).toBe('f');
    });

    it('renders sub footer with correct signature text and title attribute', async () => {
        const currentYear = new Date().getFullYear().toString();

        const wrapper = mount(PageFooter, {
            global: {
                stubs: {
                    SocialLink: SocialLinkStub,
                },
            },
        });

        await flushPromises();

        const signatureEl = wrapper.find('.sub_footer .signature');
        expect(signatureEl.exists()).toBe(true);

        const expectedTitle =
            'Tutte le immagini, i loghi e i marchi registrati appartengono ai legittimi proprietari. È vietato riprodurre il contenuto di questo sito senza autorizzazione.';
        expect(signatureEl.attributes('title')).toBe(expectedTitle);

        expect(signatureEl.text()).toContain(currentYear);
        expect(signatureEl.text()).toContain(fakeStore.config.text.footerText.ita);
    });
});
