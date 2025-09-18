'use client'

import { useState } from 'react';
import { Search, BookOpen, Clock, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UnifiedHero from '@/components/shared/UnifiedHero';
import BlogClient from './BlogClient';
import { provenTouchFeedback } from '@/lib/utils/responsive-utilities';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
  author: string;
}

interface BlogPageClientProps {
  posts: BlogPost[];
  categories: string[];
}

const BlogPageClient = ({ posts, categories }: BlogPageClientProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <UnifiedHero
        badge={{
          icon: BookOpen,
          text: "Knowledge Hub"
        }}
        title="Engineering"
        highlight="Insights"
        subtitle="Stay updated with the latest in engineering, design, and manufacturing"
        description="Expert insights, technical guides, and industry trends from 26+ years of global engineering experience."
        primaryCTA={{
          text: "Explore Articles",
          onClick: () => {
            const articlesSection = document.querySelector('#articles-section');
            articlesSection?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        secondaryCTA={{
          text: "Book Free Consultation",
          onClick: () => {
            // Trigger consultation modal from parent
            const event = new CustomEvent('openBlogConsultation');
            window.dispatchEvent(event);
          }
        }}
        metrics={[
          { icon: BookOpen, text: `${posts.length} Articles` },
          { icon: Clock, text: "Weekly Updates" },
          { icon: Users, text: "Expert Insights" }
        ]}
      />

      {/* Search Section */}
      <section className="py-6 sm:py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles, topics, insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 sm:h-12 text-base sm:text-lg border-2 border-gray-200 focus:border-primary rounded-xl"
                />
              </div>
              <Button variant="primary" className={`h-10 sm:h-12 px-4 sm:px-8 rounded-xl ${provenTouchFeedback()}`}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div id="articles-section">
        <BlogClient 
          posts={posts} 
          categories={categories}
          externalSearchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </>
  );
};

export default BlogPageClient;