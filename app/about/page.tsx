'use client'

import { motion } from 'framer-motion';
/* Framer Motion animations preserved for desktop experience */
import { Button } from "@/components/ui/button";
import UnifiedSection from '@/components/shared/UnifiedSection';
import UnifiedCard from '@/components/shared/UnifiedCard';
import UnifiedHero from '@/components/shared/UnifiedHero';
import TimelineSection from '@/components/about/TimelineSection';
import { TimelineEvent } from '@/library/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard';

const stats = [
  { label: 'Years of Global Engineering Experience', value: '26+' },
  { label: 'Years in Advanced R&D & Innovation', value: '14+' },
  { label: 'Countries Worked In', value: '3' },
  { label: 'Patents Pending & Innovations', value: '2+' }
];



const timeline: TimelineEvent[] = [
  {
    year: '1998',
    title: 'Engineering Foundation',
    description: 'Diploma in Mechanical Engineering - Coimbatore Institute of Technology'
  },
  {
    year: '2001',
    title: 'Manufacturing Expertise',
    description: 'Service & Design Engineer - 6 years mastering vendor development & manufacturing'
  },
  {
    year: '2007',
    title: 'Global Expansion',
    description: 'Singapore: Bachelor\'s degree + Automation Design - International perspective gained'
  },
  {
    year: '2011',
    title: 'Advanced R&D Focus',
    description: 'Singapore: Specialized in UF module development & advanced filtration technology'
  },
  {
    year: '2016',
    title: 'Innovation Leadership',
    description: 'Germany: Led R&D projects, modular design innovations & cross-cultural teams'
  },
  {
    year: '2025',
    title: 'IdEinstein Founded',
    description: 'Bringing 26+ years of engineering excellence directly to startups and innovators'
  }
];

const AboutPage = () => {
  const [showConsultation, setShowConsultation] = useState(false)

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern & Impactful */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 mix-blend-multiply filter blur-xl animate-pulse rounded-lg"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 mix-blend-multiply filter blur-xl animate-pulse delay-1000 rounded-lg"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 mix-blend-multiply filter blur-xl animate-pulse delay-2000 rounded-lg"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-yellow-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              26+ Years of Engineering Excellence
              <br />
              <span className="text-yellow-400">Now Focused</span>
              <br />
              on <span className="text-blue-400">Your Success</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Work directly with an experienced engineer who understands growing company challenges.<br />
              Streamlined processes. Senior-level expertise. Direct communication.<br />
              Proven engineering excellence focused on bringing your vision to life.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button 
                variant="accelerator" 
                size="hero" 
                className="rounded-lg w-full sm:w-auto"
                onClick={() => {
                  const timelineSection = document.querySelector('#timeline-section');
                  timelineSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                🚀 Explore My Journey
              </Button>
              <Button 
                variant="secondary-light" 
                size="hero" 
                className="rounded-lg w-full sm:w-auto"
                onClick={() => {
                  const expertiseSection = document.querySelector('#expertise-section');
                  expertiseSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View My Expertise
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/50 flex justify-center rounded-lg"
            >
              <motion.div
                animate={{ height: ["0%", "30%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 bg-white/70 mt-2 rounded-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Metrics - Premium Design */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 text-sm font-medium mb-6 rounded-lg">
              🏆 Professional Credentials
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Experience That Delivers Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real metrics from a proven engineering career spanning three continents and multiple industries
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 active:scale-95 border border-gray-100 h-full flex flex-col">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {stat.value}
                  </div>
                  <div className="text-gray-700 font-semibold text-sm leading-tight flex-grow flex items-center justify-center">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me - Premium Cards */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 text-sm font-medium mb-6 rounded-lg">
              🚀 Startup Advantage
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Why Choose <span className="text-blue-600">Direct Engineering Partnership</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              After 26+ years in engineering, I understand what growing companies really need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              {
                icon: '⚡',
                title: 'Rapid Decision Making',
                description: 'Streamlined processes and direct communication. Engineering decisions made efficiently.',
                benefit: 'Speed Advantage',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: '💰',
                title: 'Efficient Resource Allocation',
                description: 'Direct engineering partnership with transparent, competitive rates.',
                benefit: 'Value Advantage',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: '🎯',
                title: 'Senior-Level Attention',
                description: 'Your project receives direct senior engineering focus and expertise.',
                benefit: 'Quality Advantage',
                color: 'from-blue-500 to-purple-500'
              },
              {
                icon: '🔧',
                title: 'Hands-On Engineering',
                description: 'I personally handle the technical work, bringing 26+ years of experience.',
                benefit: 'Experience Advantage',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: '🌐',
                title: 'Global Network',
                description: 'Access to my proven manufacturing partners across 3 continents.',
                benefit: 'Network Advantage',
                color: 'from-cyan-500 to-blue-500'
              },
              {
                icon: '🤝',
                title: 'Growth-Stage Understanding',
                description: 'I understand the unique challenges of growing companies and resource optimization.',
                benefit: 'Partnership Advantage',
                color: 'from-indigo-500 to-purple-500'
              }
            ].map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 h-full flex flex-col border border-gray-100">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${advantage.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{advantage.icon}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {advantage.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 text-center flex-grow">
                    {advantage.description}
                  </p>

                  <div className="mt-auto text-center">
                    <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium rounded-lg">
                      {advantage.benefit}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Personal Story Card - Enhanced with Better Image Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-12 text-white shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                {/* Enhanced Image Section */}
                <div className="lg:col-span-2 text-center">
                  <div className="relative w-56 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 mx-auto mb-6 group">
                    {/* Image Container - Larger to Balance Content */}
                    <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border-4 border-white/30 group-hover:scale-105 transition-all duration-300">
                      <Image 
                        src="/images/team/saravanakumar.jpg" 
                        alt="Saravanakumar - Founder & Chief Engineer" 
                        fill
                        className="object-cover"
                        style={{ 
                          imageRendering: 'auto',
                          objectPosition: '50% 20%'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-4xl md:text-5xl font-bold hidden">
                        SV
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
                  </div>
                  
                  {/* Name and Title */}
                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-bold">Saravanakumar</h3>
                    <p className="text-blue-200 text-base md:text-lg font-medium">Founder & Chief Engineer</p>
                    <div className="flex justify-center items-center space-x-2 mt-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-blue-200 text-sm">26+ Years Experience</span>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                      The Hardest Decision of My Life
                    </h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="bg-white/10 rounded-lg p-4 border-l-4 border-white/50">
                      <p className="text-blue-100 leading-relaxed text-lg font-medium">
                        "I'm Saravanakumar. After 26 years as an engineer and team leader delivering breakthroughs for global firms, 
                        I left a safe career—so YOU don't have to struggle finding the right bridge."
                      </p>
                    </div>
                    
                    <blockquote className="text-blue-100 leading-relaxed text-lg border-l-4 border-yellow-400 pl-4">
                      "For 14 years, I had everything I thought I wanted. A stable position at the same company, colleagues who became family, 
                      financial security, and a clear path ahead. I'd built my life around this career - from India to Singapore to Germany. 
                      But something was eating at me."
                    </blockquote>
                    
                    <blockquote className="text-blue-100 leading-relaxed text-lg border-l-4 border-red-300 pl-4">
                      "Every day, I watched brilliant innovations get stuck in translation. German companies with game-changing ideas couldn't 
                      connect with India's incredible manufacturing talent. Not because the capability wasn't there, but because the bridge wasn't. 
                      I was that bridge - and I was trapped inside corporate walls."
                    </blockquote>
                    
                    <blockquote className="text-blue-100 leading-relaxed text-lg border-l-4 border-purple-300 pl-4">
                      "The sleepless nights started when I realized I'd become part of the problem I desperately wanted to solve. 
                      At 42, with a family to think about, walking away from 14 years of relationships and security felt terrifying. 
                      But staying felt like betraying everything I believed in."
                    </blockquote>
                    
                    <blockquote className="text-blue-100 leading-relaxed text-lg border-l-4 border-green-300 pl-4">
                      "The breaking point came when I looked in the mirror and asked: 'Will I spend the rest of my life knowing I could have 
                      made a difference but chose comfort instead?' That question haunted me until I couldn't ignore it anymore."
                    </blockquote>
                    
                    <div className="bg-white/5 rounded-lg p-4 border-l-4 border-blue-300">
                      <p className="text-blue-100 leading-relaxed text-lg font-medium">
                        "IdEinstein was born from that moment of truth. Sometimes following your calling means giving up everything you've built 
                        to build something that matters more. I'm not just bridging two countries - I'm bridging the gap between what is 
                        and what could be."
                      </p>
                    </div>
                  </div>

                  {/* Professional Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <div className="text-lg font-bold text-yellow-400">🎯 Direct Partnership</div>
                      <div className="text-xs text-blue-200">No corporate layers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <div className="text-lg font-bold text-yellow-400">🏢 All Company Stages</div>
                      <div className="text-xs text-blue-200">Startups to enterprises</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Timeline */}
      <div id="timeline-section">
        <TimelineSection events={timeline} />
      </div>

      {/* Expertise Showcase */}
      <section id="expertise-section" className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20"
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 blur-xl rounded-lg"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 blur-xl rounded-lg"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Technical Excellence</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Bridging advanced engineering with practical manufacturing solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Automated Machine Design',
                description: 'Scalable automation solutions with proven cost optimization results',
                icon: '🤖',
                skills: ['Assembly Line Automation', 'Equipment Design', 'Process Optimization', 'Cost Reduction']
              },
              {
                title: 'UF & MBR Module Design',
                description: 'Advanced filtration systems and lab testing equipment development',
                icon: '💧',
                skills: ['UF/MBR Technology', 'Membrane Design', 'Lab Testing Equipment', 'Filtration Systems']
              },
              {
                title: 'Project Management',
                description: 'Leading cross-cultural teams to deliver complex R&D projects',
                icon: '📊',
                skills: ['PMP (In Progress)', 'R&D Leadership', 'Cross-Cultural Teams', 'Innovation Management']
              }
            ].map((expertise, index) => (
              <motion.div
                key={expertise.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105 h-full flex flex-col border border-white/20">
                  <div className="text-center mb-4">
                    <div className="text-4xl">{expertise.icon}</div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-center text-white">
                    {expertise.title}
                  </h3>
                  
                  <p className="text-blue-200 mb-4 text-center flex-grow">
                    {expertise.description}
                  </p>
                  
                  <div className="space-y-2 mt-auto">
                    {expertise.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 mr-3 rounded-lg"></div>
                        <span className="text-sm text-blue-200">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Philosophy - Premium Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 text-sm font-medium mb-6 rounded-lg">
              🎯 Core Values
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Engineering Philosophy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The principles that have guided my 26+ year career and now shape every IdEinstein partnership
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '💡',
                title: 'Innovation Through Experience',
                description: 'Combining proven engineering principles with creative problem-solving to deliver breakthrough solutions',
                iconColor: 'from-blue-500 to-blue-600',
                borderColor: 'border-blue-200',
                bgColor: 'bg-blue-50'
              },
              {
                icon: '⭐',
                title: 'German Precision Standards',
                description: 'Uncompromising quality and attention to detail, applied globally with cultural sensitivity',
                iconColor: 'from-yellow-500 to-orange-500',
                borderColor: 'border-yellow-200',
                bgColor: 'bg-yellow-50'
              },
              {
                icon: '🌱',
                title: 'Sustainable Engineering',
                description: 'Environmental responsibility and long-term value creation in every design decision',
                iconColor: 'from-green-500 to-emerald-500',
                borderColor: 'border-green-200',
                bgColor: 'bg-green-50'
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className={`${value.bgColor} rounded-2xl p-3 sm:p-4 md:p-6 border-2 ${value.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 h-full flex flex-col`}>
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${value.iconColor} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <span className="text-4xl">{value.icon}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed text-center flex-grow">
                    {value.description}
                  </p>

                  <div className="mt-6 text-center">
                    <div className={`inline-flex items-center bg-gradient-to-r ${value.iconColor} text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md`}>
                      Core Principle
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Philosophy Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Engineering Excellence with Startup Agility
              </h3>
              <p className="text-blue-100 leading-relaxed">
                These principles aren't just words on a page - they're the foundation of how I approach every project. 
                Whether you're a startup with your first prototype or an established company launching a new product line, 
                you get the same commitment to innovation, precision, and sustainability that has defined my 26+ year career.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Modern & Engaging */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20"
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 blur-xl rounded-lg"
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 blur-xl rounded-lg"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
                Idea
              </span>{' '}
              into Reality?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-8 leading-relaxed">
              Work directly with an experienced engineer who understands your startup challenges. 
              Your next breakthrough is just a conversation away.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Link href="/services/product-development-accelerator">
                <Button variant="accelerator" size="hero" className="rounded-lg w-full sm:w-auto">
                  🚀 Start Your Project
                </Button>
              </Link>
              <Button 
                variant="secondary-light" 
                size="hero" 
                className="rounded-lg w-full sm:w-auto"
                onClick={() => setShowConsultation(true)}
              >
                Book Free Consultation
              </Button>
            </div>
            
            <div className="pt-6 border-t border-white/20">
              <p className="text-blue-300 text-sm">
                🔒 No commitment required • 💯 Personal attention • 🤝 Direct communication
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Modal */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Book a Free Consultation</DialogTitle>
          <UnifiedConsultationCard
            type="consultation"
            onSuccess={handleConsultationSuccess}
            defaultService="about-consultation"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutPage;
