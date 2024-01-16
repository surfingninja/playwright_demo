import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class LoginPage extends BasePage {

    private readonly accountButton: Locator;
    private readonly email: Locator;
    private readonly password: Locator;
    private readonly loginButton: Locator;
    private readonly resetPassword: Locator;
    private readonly forgotPassEmail: Locator;
    private readonly resetPasswordButton: Locator;
    

    constructor(page: Page) {
        super(page);
        this.accountButton = page.locator("[data-testid='header-component-item'] button");
        this.email = page.locator("#loginForm [name='email']");
        this.password = page.locator("#loginForm [name='password']");
        this.loginButton = page.locator("button[class*='login']");
        this.resetPassword = page.locator(".login__link");
        this.forgotPassEmail = page.locator("[name=forgotPasswordEmail]");
        this.resetPasswordButton = page.locator("button[class*=forgot-password][type*=submit]");
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
