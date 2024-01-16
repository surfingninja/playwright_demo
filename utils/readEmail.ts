import imaps from 'imap-simple';
import { READ_MAIL_CONFIG } from './config';

interface ReadMailResult {
  emailContents: string[]; // or whatever type we want to use for email contents
  sequenceNumbers: number[];
}

const readMail = async (): Promise<ReadMailResult> => {
  try {
    const connection = await imaps.connect(READ_MAIL_CONFIG);
    console.log('CONNECTION SUCCESSFUL', new Date().toString());
    const box = await connection.openBox('INBOX');
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false,
    };
    const results = await connection.search(searchCriteria, fetchOptions);

    const sequenceNumbers = results.map((res) => res.attributes.uid);

    const emailContents = results.map((res) => {
      const text = res.parts.filter((part) => part.which === 'TEXT');
      return text[0]?.body || '';
    });

    connection.end();

    return {
      emailContents,
      sequenceNumbers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  readMail,
};
