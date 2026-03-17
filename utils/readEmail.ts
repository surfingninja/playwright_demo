import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { READ_MAIL_CONFIG } from './config';

export type EmailContent = {
  subject: string;
  from: string;
  text: string;
  html: string;
}
export type ReadMailResult = {
  emailContents: EmailContent[];
  sequenceNumbers: number[];
}

export type ReadMailOptions = {
  from: string;
  subject: string;
}

export const readMail = async (options: ReadMailOptions): Promise<ReadMailResult> => {
  try {
    const sinceMinutes = 15;
    const nowdate = new Date();
    const sinceDate = new Date(nowdate.getTime() - sinceMinutes * 60 * 1000);

    const dateStr = sinceDate.toUTCString().split(' ').slice(1, 4).join('-');
    const connection = await imaps.connect(READ_MAIL_CONFIG);
    await connection.openBox('INBOX');

    const searchCriteria: string[][] = [
      ['FROM', options.from],
      ['SUBJECT', options.subject],
      ['SINCE', dateStr],
      ['UNSEEN']];
    // ['SINCE', dateStr]];
    const fetchOptions = {
      bodies: [''],
      markSeen: false
    };

    const results = await connection.search(searchCriteria, fetchOptions);
    // const sequenceNumbers = results.map((res) => res.attributes.uid);

    const parsedEmails: { content: EmailContent; uid: number; date: Date }[] = await Promise.all(
      results.map(async res => {
        const raw = await res.parts.find(part => part.which === '')?.body;
        const parsed = await simpleParser(raw);

        return {
          content: {
            subject: parsed.subject ?? '',
            from: parsed.from?.text ?? '',
            text: parsed.text ?? '',
            html: typeof parsed.html === 'string' ? parsed.html : ''
          },
          uid: res.attributes.uid,
          date: parsed.date ?? new Date()
        };
      })
    );

    await connection.end();

    // filter by specific time
    // const filtered = parsedEmails.filter(e => e.date && ((nowdate.getTime() - e.date.getTime()) / 60000) <= sinceMinutes);

    return {
      emailContents: parsedEmails.map(e => e.content),
      sequenceNumbers: parsedEmails.map(e => e.uid)
    };
  } catch (error) {
    console.log(error);
    throw error;
  }

};
