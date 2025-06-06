import { Locator, type Page } from '@playwright/test';

export class BasePage {

    private readonly page: Page
    private readonly denyCookies = "uc-deny-all-button";
    private readonly loader = "[class*=spinner] circle";

    constructor(page: Page) {
        this.page = page;
    }

    public async goTo(url: string) {
        await this.page.goto(url);
    }

    public async openPage(chunk: string) {
        await this.page.goto(this.page.url() + chunk);
    }

    public async denyAllCookies() {
        await this.locator(this.denyCookies).click();
    }

    public async reload() {
        await this.page.reload();
    }

    public async waitForLoaderDisappear() {
        await this.locator(this.loader).waitFor({ state: 'hidden', timeout: 10000 });
    }

    public generateRandomString(): string {
        const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
        let randomString = '';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            randomString += symbols.charAt(randomIndex);
        }
        return randomString;
    }

    public locator(selector: string | Locator): Locator {
        return typeof selector === 'string' ? this.page.locator(selector) : selector;
    }

}

