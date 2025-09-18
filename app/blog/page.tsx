import { getBlogPosts, getBlogCategories } from '@/lib/blog-data';
import BlogPageClient from '@/components/blog/BlogPageClient';
import SimpleBlogCTA from '@/components/blog/SimpleBlogCTA';
import BlogPageWrapper from '@/components/blog/BlogPageWrapper';

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  const categories = await getBlogCategories();

  return (
    <BlogPageWrapper>
      <div className="min-h-screen">
        <BlogPageClient posts={blogPosts} categories={categories} />
        <SimpleBlogCTA />
      </div>
    </BlogPageWrapper>
  );
}