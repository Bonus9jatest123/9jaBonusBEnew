import parse from 'html-react-parser';

export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const BLOG_ENDPOINT = process.env.NEXT_PUBLIC_BLOG_ENDPOINT;

export const sortingOptions = [
  { label: 'Time', value: 'Time' },
  { label: parse("<div className='option-with-tag'>Popular <span className='tag --hot'> <img src='/images/svg/hotTag.svg' /> HOT</span></div>"), value: 'Popular' },
  { label: 'Odds', value: 'Odds' }
];
