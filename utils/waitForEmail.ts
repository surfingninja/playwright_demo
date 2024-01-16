import { readMail } from "./readEmail";

export async function waitForEmail(timeout: number): Promise<{ emailContents: string[]; sequenceNumbers: number[] }> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const { emailContents, sequenceNumbers } = await readMail();
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