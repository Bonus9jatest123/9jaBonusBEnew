'use client';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { BlogPost } from '../page';

export default function Page({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
   
 let blogs = [];
    try {
      const blogsRaw = localStorage.getItem('blogs');
      blogs = blogsRaw ? JSON.parse(blogsRaw) : [];
    } catch (err) {
      // console.error('Failed to parse blogs:', err);
      blogs = [];
    }
    
    setBlog(blogs?.[params.id]);
  }, []);

  return (
    <div className="single_container wrapper">
      <div className="single_container_author">{blog?.author}</div>
      {blog?.['content:encoded'] && (
        <div className="single_container_content">
          <h3>{blog?.title}</h3> {parse(blog?.['content:encoded']!)}
        </div>
      )}
    </div>
  );
}
