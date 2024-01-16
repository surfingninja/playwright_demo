import imaps from 'imap-simple';
import { READ_MAIL_CONFIG } from './config';

const deleteMail = async (sequenceNumber: number[]): Promise<void> => {
  try {
    const connection = await imaps.connect(READ_MAIL_CONFIG);
    console.log('CONNECTION SUCCESSFUL', new Date().toString());
    const box = await connection.openBox('INBOX');
    await connection.deleteMessage(sequenceNumber);

    connection.end();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  deleteMail,
};
