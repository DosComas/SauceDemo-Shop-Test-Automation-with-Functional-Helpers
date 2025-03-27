import * as fs from 'fs';
import * as path from 'path';

const langCode = process.env.LANGUAGE || 'en';

export async function getTranslation(
  key: string,
  langCodeOverride: string = langCode
): Promise<string> {
  const langCodeToUse = langCodeOverride || langCode;
  const langFilePath = path.resolve(__dirname, `../translations/${langCodeToUse}.json`);

  try {
    const data = await fs.promises.readFile(langFilePath, 'utf-8');
    const translations = JSON.parse(data);
    return translations[key] || `Missing translation for '${key}'`;
  } catch (error) {
    return `Error loading language file: ${error.message}`;
  }
}
