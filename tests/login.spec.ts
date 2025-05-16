import { test, expect } from '@playwright/test'
import { parse } from 'csv-parse/sync';
import * as fs from "fs";
import * as path from "path";
import { JSDOM } from "jsdom"
import { deleteMail } from '../utils/deleteEmail.ts';
import { waitForEmail } from '../utils/waitForEmail.ts';

import { BasePage } from '../pages/page';
import { LoginPage } from '../pages/login';
import { ResetPassword } from '../pages/reset-password';

const creds = parse(fs.readFileSync(path.join(__dirname, '../creds.csv')), {
    columns: true,
    skipRecordsWithEmptyValues: true,
    skip_empty_lines: true
})

const invCreds = parse(fs.readFileSync(path.join(__dirname, '../invalid_creds.csv')), {
    columns: true,
    skipRecordsWithEmptyValues: true,
    skip_empty_lines: true
});

test.describe("Log in functionality feature", () => {

    test.beforeEach("Starting up a browser...", async ({ page }) => {
        const basePage = new BasePage(page);
        await basePage.goTo("https://www.douglas.de/de");
        await basePage.denyAllCookies();
        await basePage.openPage("/login");
    });

    test("As a user with correct credentials I would like to login to the webshop", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(creds[0].email, creds[0].password);
        await loginPage.waitForLoaderDisappear();
        await loginPage.goToAccount();
        await expect(page.locator("[data-testid*='logged-in']")).toBeVisible({ timeout: 5000 });
    });

    for (const data of invCreds) {
        test(`As a user ${data.email} I would like to receive an error message if I enter wrong credentials`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.login(data.email, data.password);
            await loginPage.waitForLoaderDisappear();
            await expect(page.getByTestId("alert-message")).toContainText(data.error, {timeout: 10000});
        });
    }

    test("As a user I would like to reset my password if I forget my credentials", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const resetPasswordPage = new ResetPassword(page);
        const email = process.env.EMAIL ? process.env.EMAIL : "undefined";
        const newPassword: string = loginPage.generateRandomString();

        await loginPage.goToAccount();
        await loginPage.resetPasswordInit(email);

        const { emailContents, sequenceNumbers } = await waitForEmail(30000);
        let resetPasswordLink!: string;
        for (const html of emailContents) {
            const domparser = new JSDOM(html);
            resetPasswordLink = domparser.window.document
                .querySelector('a[href*="resetPassword"]')?.getAttribute('href') as string;
            await deleteMail(sequenceNumbers);
        }

        await resetPasswordPage.setNewPassword(resetPasswordLink, newPassword);
        await expect(page.locator("[data-testid*='logged-in']")).toBeVisible({ timeout: 5000 });
    });

})

