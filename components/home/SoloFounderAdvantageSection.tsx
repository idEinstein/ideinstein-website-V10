"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SoloFounderAdvantageSection() {
  return (
    <section className="pt-12 pb-8 md:pt-16 md:pb-12 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose a Single Engineering Expert?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlike large consultancies with team-based approaches, you get direct access to experienced mechanical engineering 
            enhanced by a curated network of specialists. Personal attention, streamlined communication, and dedicated focus on your project success.
          </p>
        </motion.div>

        {/* Main Benefits Grid - Using Product Development Accelerator Pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {[
            {
              icon: "🔧",
              title: "Mechanical Engineering Focus",
              description: "Unlike software-heavy competitors, I specialize in physical product development and manufacturing",
              highlight: "Physical products expertise",
            },
            {
              icon: "👤",
              title: "Single Expert Model", 
              description: "Direct access to experienced engineer vs team-based approaches of large consultancies",
              highlight: "No account manager layers",
            },
            {
              icon: "🌍",
              title: "Cross-Cultural Manufacturing",
              description: "India → Singapore → Germany journey provides unique global manufacturing perspective",
              highlight: "Global efficiency expertise",
            },
            {
              icon: "⚖️",
              title: "Flexible Engagement Scale",
              description: "Can serve both startup MVPs and enterprise complex projects with appropriate approach",
              highlight: "Startup to enterprise scale",
            },
            {
              icon: "🎯",
              title: "Personal Accountability",
              description: "I take personal responsibility for your project success from start to finish",
              highlight: "Your success is my reputation",
            },
            {
              icon: "⚡",
              title: "German Quality Standards",
              description: "13+ years of engineering experience with quality processes and efficiency",
              highlight: "German quality + global efficiency",
            },
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col p-3 sm:p-4">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-center flex-grow">
                  {benefit.description}
                </p>
                <div className="mt-auto text-center">
                  <div className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {benefit.highlight}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hub & Spoke Model Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 md:p-8 border border-blue-100"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Powered by Hub & Spoke Model
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              My single expert approach is enhanced by a carefully curated network of specialists. 
              You get personal attention from me (the hub) plus access to specialized expertise when needed (the spokes).
            </p>
          </div>

          {/* Simplified Hub & Spoke Animation */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid md:grid-cols-3 gap-8 items-center relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 transform -translate-y-1/2 z-0"></div>
              
              {/* Hub (You) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mb-4"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">You</span>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-blue-300/50 rounded-full"
                  />
                </motion.div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Direct Access</h4>
                <p className="text-sm text-gray-600">Personal communication with experienced engineer</p>
              </motion.div>

              {/* Central Hub (Me) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mb-4"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-xl">
                    <span className="text-white text-lg font-bold">Hub<br/>(Me)</span>
                  </div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-purple-400/50 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
                  />
                </motion.div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Central Coordination</h4>
                <p className="text-sm text-gray-600">I manage everything while coordinating specialists</p>
              </motion.div>

              {/* Spokes (Network) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mb-4"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">Network</span>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-green-300/50 rounded-full"
                  />
                </motion.div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Specialist Access</h4>
                <p className="text-sm text-gray-600">Vetted partners when specialized expertise is needed</p>
              </motion.div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-2xl mb-3">🎯</div>
              <h5 className="font-bold text-gray-900 mb-2">Personal Accountability</h5>
              <p className="text-sm text-gray-600">I'm personally responsible for your project success</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-2xl mb-3">🔗</div>
              <h5 className="font-bold text-gray-900 mb-2">Network Access</h5>
              <p className="text-sm text-gray-600">Specialized expertise available when needed</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-2xl mb-3">⚡</div>
              <h5 className="font-bold text-gray-900 mb-2">Best of Both Worlds</h5>
              <p className="text-sm text-gray-600">Boutique attention + enterprise capabilities</p>
            </div>
          </div>

          {/* Learn More Link */}
          <div className="text-center mt-8">
            <Link href="/about/hub-spoke-model">
              <Button variant="link" className="text-base">
                Learn more about the Hub & Spoke Model
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Strong CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 text-center bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 md:p-8 text-white"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Work with a Single Engineering Expert?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Get direct access to experienced mechanical engineering, personal accountability, 
            and the Hub & Spoke network when you need specialized support.
          </p>
          
          {/* Personal Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-yellow-300 mb-1">24h</div>
              <div className="text-blue-100 text-sm">Personal Response</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-yellow-300 mb-1">1-on-1</div>
              <div className="text-blue-100 text-sm">Direct Access</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-yellow-300 mb-1">100%</div>
              <div className="text-blue-100 text-sm">Personal Focus</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/product-development-accelerator">
              <Button
                variant="accelerator"
                size="hero"
                className="w-full sm:w-auto hover:shadow-xl transition-all duration-300"
              >
                Start Your Project Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/about/hub-spoke-model">
              <Button
                variant="secondary-light"
                size="hero"
                className="w-full sm:w-auto hover:shadow-xl transition-all duration-300"
              >
                Learn About My Approach
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}