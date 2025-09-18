'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';
import BlogFloatingButtons from './BlogFloatingButtons';
import { provenCardPadding, provenTouchFeedback } from '@/lib/utils/responsive-utilities';

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

interface BlogClientProps {
  posts: BlogPost[];
  categories: string[];
  externalSearchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const BlogClient = ({ posts, categories, externalSearchQuery = '', onSearchChange }: BlogClientProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Show 6 posts per page

  // Use external search query if provided, otherwise use internal
  const activeSearchQuery = externalSearchQuery || searchQuery;

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(activeSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      setSearchQuery(query);
    }
    setCurrentPage(1);
  };

  return (
    <>
      {/* Floating Buttons */}
      <BlogFloatingButtons showBackButton={false} />



      {/* Categories */}
      <section className="py-6 sm:py-8 md:py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600">Find articles that match your interests</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "secondary"}
                onClick={() => handleCategoryChange(category)}
                className={`rounded-full px-4 sm:px-6 py-2 ${provenTouchFeedback()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 sm:py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className={`bg-white rounded-2xl ${provenCardPadding()} shadow-lg border border-gray-100 h-full transition-all duration-300 hover:shadow-2xl hover:border-gray-200 hover:scale-105 ${provenTouchFeedback()} flex flex-col`}>
                  <div className="relative h-32 sm:h-40 md:h-48 mb-4 sm:mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3} // Prioritize loading for first 3 images
                    />
                    {/* Image overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                    </div>
                    
                    <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <Link href={`/blog/${post.slug}`}>
                        <Button 
                          variant="primary" 
                          className={`w-full rounded-xl group-hover:shadow-lg transition-all duration-300 ${provenTouchFeedback()}`}
                        >
                          Read Article
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show message if no posts found */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Articles Found</h3>
                <p className="text-gray-600 mb-6">No articles found matching your criteria. Try adjusting your search or category filters.</p>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    handleCategoryChange('All');
                    handleSearchChange('');
                  }}
                  className="rounded-xl px-8"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 space-x-2">
              {/* Previous Button */}
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 sm:px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${provenTouchFeedback()}`}
              >
                Previous
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current
                const showPage = 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  Math.abs(pageNum - currentPage) <= 1;

                if (!showPage && pageNum === 2 && currentPage > 4) {
                  return <span key="dots1" className="px-2 text-gray-400">...</span>;
                }
                if (!showPage && pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                  return <span key="dots2" className="px-2 text-gray-400">...</span>;
                }
                if (!showPage) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "primary" : "ghost"}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-xl font-semibold ${
                      currentPage === pageNum 
                        ? "shadow-lg" 
                        : "hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {/* Next Button */}
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 sm:px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${provenTouchFeedback()}`}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogClient;