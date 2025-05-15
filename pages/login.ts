import { type Page } from '@playwright/test';
import { BasePage } from './page';

export class LoginPage extends BasePage {

    private readonly accountButton = this.locator("[data-testid='header-component-item--account'] button");
    private readonly email = this.locator("#loginForm [name='email']");
    private readonly password = this.locator("#loginForm [name='password']");
    private readonly loginButton = this.locator("button[class*='login']");
    private readonly resetPassword = this.locator(".login__link");
    private readonly forgotPassEmail = this.locator("[name=forgotPasswordEmail]");
    private readonly resetPasswordButton = this.locator("button[class*=forgot-password][type*=submit]");

    constructor(page: Page) {
        super(page);
    }

    public async login(email: string, password: string) {
        await this.goToAccount();
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    public async goToAccount() {
        await this.accountButton.nth(0).click();
    }

    public async resetPasswordInit(email: string) {
        await this.resetPassword.click();
        await this.forgotPassEmail.fill(email);
        await this.resetPasswordButton.click();
    }

}
