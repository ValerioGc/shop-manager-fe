// MainLayout.spec.ts

import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import MainLayout from '../../components/layout/MainLayout.vue';

// ----- Custom stubs for child components -----
const PageHeaderStub = {
    name: 'PageHeader',
    props: ['clMod'],
    template: '<div class="page-header">{{ clMod }}</div>',
};

const PageFooterStub = {
    name: 'PageFooter',
    template: '<div class="page-footer"></div>',
};

describe('MainLayout Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders header, footer and slot content', async () => {
        const wrapper = mount(MainLayout, {
            global: {
                stubs: {
                    PageHeader: PageHeaderStub,
                    PageFooter: PageFooterStub,
                },
            },
            slots: {
                default: '<div class="slot-content">Test Slot Content</div>',
            },
        });

        await flushPromises();

        expect(wrapper.find('.page-header').exists()).toBe(true);
        expect(wrapper.find('.page-footer').exists()).toBe(true);
        expect(wrapper.find('.slot-content').text()).toBe('Test Slot Content');
    });

    it('triggers closeModal when overlay is clicked', async () => {
        const wrapper = mount(MainLayout, {
            global: {
                stubs: {
                    PageHeader: PageHeaderStub,
                    PageFooter: PageFooterStub,
                },
            },
        });

        await flushPromises();

        const pageHeader = wrapper.findComponent(PageHeaderStub);

        // Initially, clMod should be false (rendered as "false")
        expect(pageHeader.text()).toBe('false');

        // Trigger click on the overlay element
        await wrapper.find('#overlay').trigger('click');

        // After click, clMod should be true immediately
        expect(pageHeader.text()).toBe('true');

        // Advance timers by 150ms to simulate the timeout in closeModal
        vi.advanceTimersByTime(150);
        await flushPromises();

        // After timeout, clMod should be reset to false
        expect(pageHeader.text()).toBe('false');
    });

    it('updates navbar height on window resize for mobile view', async () => {
        // Set window.innerWidth to mobile value (< 992)
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 800,
        });

        // Create a fake mobile navbar element with a given offsetHeight
        const mobileNav = document.createElement('div');
        mobileNav.className = 'navbar_mobile';
        Object.defineProperty(mobileNav, 'offsetHeight', { configurable: true, value: 50 });
        document.body.appendChild(mobileNav);

        const wrapper = mount(MainLayout, {
            global: {
                stubs: {
                    PageHeader: PageHeaderStub,
                    PageFooter: PageFooterStub,
                },
            },
        });

        await flushPromises();
        // Simulate a window resize event
        window.dispatchEvent(new Event('resize'));
        await flushPromises();

        // Check that main_container has margin-top style equal to mobile_navbar_Height (50px)
        const mainContainer = wrapper.find('.main_container');
        expect(mainContainer.attributes('style')).toContain('margin-top: 50px');

        document.body.removeChild(mobileNav);
    });

    it('updates navbar height on window resize for desktop view', async () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1200,
        });

        const desktopNav = document.createElement('div');
        desktopNav.className = 'header_navbar';
        Object.defineProperty(desktopNav, 'offsetHeight', { configurable: true, value: 80 });
        document.body.appendChild(desktopNav);

        const wrapper = mount(MainLayout, {
            global: {
                stubs: {
                    PageHeader: PageHeaderStub,
                    PageFooter: PageFooterStub,
                },
            },
        });

        await flushPromises();
        // Simulate a window resize event
        window.dispatchEvent(new Event('resize'));
        await flushPromises();

        // Check that main_container has margin-top style equal to navbarHeight (80px)
        const mainContainer = wrapper.find('.main_container');
        expect(mainContainer.attributes('style')).toContain('margin-top: 80px');

        document.body.removeChild(desktopNav);
    });
});
