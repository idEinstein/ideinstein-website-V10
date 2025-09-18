'use client'

import { useState, useRef } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';
// import { useTransform } from 'framer-motion'; // Unused
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from './ServiceCard';
import type { Service } from '@/library/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';

interface ServiceGridProps {
  services: Service[];
}

const ServiceGrid = ({ services }: ServiceGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(service => service.category.includes(selectedCategory));

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (offset > 0 && currentIndex > 0) {
        // Swipe right - go to previous
        setCurrentIndex(currentIndex - 1);
      } else if (offset < 0 && currentIndex < filteredServices.length - 1) {
        // Swipe left - go to next
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredServices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Reset current index when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {['All', ...SERVICE_CATEGORIES].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </motion.div>

      {/* Services Grid - Desktop */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service, index) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            index={index} 
          />
        ))}
      </div>

      {/* Services Carousel - Mobile */}
      <div className="md:hidden relative">
        <div className="overflow-hidden" ref={constraintsRef}>
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={{ x: -currentIndex * 100 + '%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ x }}
          >
            {filteredServices.map((service, index) => (
              <div key={service.id} className="w-full flex-shrink-0 px-4">
                <ServiceCard 
                  service={service} 
                  index={index} 
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        {filteredServices.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
              onClick={goToNext}
              disabled={currentIndex === filteredServices.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Dots Indicator */}
        {filteredServices.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {filteredServices.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceGrid;
