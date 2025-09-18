'use client'

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
  centered?: boolean;
  features?: Array<{
    icon: ReactNode;
    text: string;
  }>;
}

const PageHero = ({ 
  title, 
  subtitle, 
  children, 
  centered = true,
  features 
}: PageHeroProps) => {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-primary/5 pt-20 pb-12 md:pt-24 md:pb-16">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={centered ? "text-center" : "max-w-2xl"}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {title}
          </h1>
          <p className={`text-xl text-text/80 mb-8 ${centered ? 'max-w-2xl mx-auto' : ''}`}>
            {subtitle}
          </p>
          
          {features && (
            <div className={`flex flex-wrap gap-4 mb-8 ${centered ? 'justify-center' : ''}`}>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-primary/80">
                  {feature.icon}
                  <span className="ml-2">{feature.text}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={centered ? "max-w-xl mx-auto" : "max-w-2xl"}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;