'use client'

import { motion } from 'framer-motion';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineSectionProps {
  events: TimelineEvent[];
}

const TimelineSection = ({ events }: TimelineSectionProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Journey
        </motion.h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-primary/20" />
          
          {/* Timeline Events */}
          {events.map((event, index) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center mb-12 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'} px-4`}>
                <div className="text-2xl font-bold text-primary mb-2">{event.year}</div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-text/80">{event.description}</p>
              </div>

              <div className="w-2/12 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-4 h-4 rounded-full bg-primary relative z-10"
                />
              </div>

              <div className="w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;