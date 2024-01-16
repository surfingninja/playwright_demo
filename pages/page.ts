import { type Locator, type Page } from '@playwright/test';

export class BasePage {

    private readonly page: Page
    private readonly acceptCookies: Locator
    private readonly loader: Locator

    constructor(page: Page) {
        this.page = page
        this.acceptCookies = page.locator("button[class*=accept-all]");
        this.loader = page.locator("[class*=spinner] circle");
    }

    public async goTo(url: string) {
        await this.page.goto(url);
    }

    public async openPage(chunk: string) {
        await this.page.goto(this.page.url() + chunk)
    }

    public async acceptAllCookies() {
        await this.acceptCookies.click();
    }

    public async reload() {
        await this.page.reload();
    }

    public async waitForLoaderDisappear() {
        await this.loader.waitFor({ state: 'hidden', timeout: 10000 })
    }

    public async generateRandomString(): Promise<string> {
        const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
        let randomString = '';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            randomString += symbols.charAt(randomIndex);
        }
        return randomString;
    }

}

