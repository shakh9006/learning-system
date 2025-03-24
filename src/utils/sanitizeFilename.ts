const sanitizeFilename = (phrase: string): string => {
  phrase = phrase.replace(/[^\w\s]/gi, '').toLowerCase();
  phrase = phrase.split(' ').join('-');

  if (phrase.startsWith('-')) {
    phrase = phrase.slice(1);
  }

  return phrase;
};

export default sanitizeFilename;
