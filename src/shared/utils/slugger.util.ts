import slugify from 'slugify';

const slugger = (text: string, separator = '-'): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    replacement: separator,
    trim: true,
  });
};

export { slugger };
