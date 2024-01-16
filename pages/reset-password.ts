import { type Locator, type Page } from '@playwright/test';
import { LoginPage } from "./login";


export class ResetPassword extends LoginPage {

    private readonly newPassword: Locator;
    private readonly submitNewPassword: Locator;

    constructor(page: Page) {
        super(page)
        this.newPassword = page.locator("[name*=newPass]");
        this.submitNewPassword = page.locator("[class*=new-pass][type=submit]");
    }

    public async setNewPassword(url: string, newPass: string) {
        await this.goTo(url);
        await this.waitForLoaderDisappear();
        await this.newPassword.fill(newPass);
        await this.submitNewPassword.click();
    }

}