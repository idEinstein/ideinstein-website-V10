// Blog data utilities for JSON-based blog system

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
  author: string;
  content: string;
}

export interface BlogData {
  posts: BlogPost[];
}

// Get all blog posts from JSON file
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // For server-side rendering, read the file directly
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public/data/blog-posts.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data: BlogData = JSON.parse(fileContents);
      return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      // For client-side, use fetch
      const response = await fetch('/data/blog-posts.json', {
        cache: 'no-store' // Always get fresh data
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data: BlogData = await response.json();
      return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

// Get single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

// Get all unique categories
export async function getBlogCategories(): Promise<string[]> {
  try {
    const posts = await getBlogPosts();
    const categories = new Set(posts.map(post => post.category));
    return ['All', ...Array.from(categories).sort()];
  } catch (error) {
    console.error('Error loading blog categories:', error);
    return ['All'];
  }
}

// Get posts by category
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const posts = await getBlogPosts();
    if (category === 'All') return posts;
    return posts.filter(post => post.category === category);
  } catch (error) {
    console.error(`Error loading posts for category ${category}:`, error);
    return [];
  }
}

// Search posts
export async function searchPosts(query: string): Promise<BlogPost[]> {
  try {
    const posts = await getBlogPosts();
    const lowercaseQuery = query.toLowerCase();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error(`Error searching posts for query ${query}:`, error);
    return [];
  }
}