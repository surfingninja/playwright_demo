import { EmailContent, readMail, ReadMailOptions } from "./readEmail";

export async function waitForEmail(options: ReadMailOptions, timeout: number)
    : Promise<{ emailContents: EmailContent[]; sequenceNumbers: number[] }> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const { emailContents, sequenceNumbers } = await readMail(options);
        if (emailContents.length > 0) {
            return { emailContents, sequenceNumbers };
        }
        await wait(1000);
    }
    throw new Error('Timeout: Email not received within the specified time.');
}

async function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}