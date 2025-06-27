import { BlogPost } from '@/app/blog/page';
import Link from 'next/link';

import React from 'react';

interface Prop {
  item: BlogPost;
  index: number;
}
const Blogs = (props: Prop) => {
  const { item, index } = props;

  return (
    <Link href={`/blog/${index}`} className="blog_item">
      <img src={item?.thumbnail} alt="" className="blog_item_img" />
      <div className="blog_item_text">{item?.title}</div>
      <div className="blog_item_date">{item?.pubDate}</div>
    </Link>
  );
};

export default Blogs;
