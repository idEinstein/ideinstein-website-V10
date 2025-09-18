"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface UnifiedHeroProps {
  badge?: {
    icon: LucideIcon;
    text: string;
  };
  title: string;
  highlight?: string;
  subheading?: string;
  subtitle: string;
  description?: string;
  primaryCTA: {
    text: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  secondaryCTA?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  metrics?: Array<{
    icon: LucideIcon;
    text: string;
  }>;
}

export default function UnifiedHero({
  badge,
  title,
  highlight,
  subheading,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  metrics,
}: UnifiedHeroProps) {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-blue-800 to-blue-900 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16">
      {/* Consistent Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-primary/20 to-blue-800/20"
        />
      </div>

      {/* Subtle Floating Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-8 sm:p-12 lg:p-16 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-32 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"
      />

      <div className="container mx-auto px-4 relative z-10 text-center text-white pt-safe-top">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-4 sm:mb-6 lg:mb-8"
            >
              <badge.icon className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">
                {badge.text}
              </span>
            </motion.div>
          )}

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            {title}{" "}
            {highlight && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
                {highlight}
              </span>
            )}
          </motion.h1>

          {/* Subheading */}
          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-yellow-300/90 mb-3 sm:mb-4 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              {subheading}
            </motion.p>
          )}

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-6 max-w-4xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-blue-200 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto"
            >
              {description}
            </motion.p>
          )}

          {/* Metrics */}
          {metrics && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 mb-6 sm:mb-4 sm:mb-6 lg:mb-8 lg:mb-10"
            >
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3"
                >
                  <metric.icon className="w-5 h-5 mr-3 text-yellow-400" />
                  <span className="text-white font-medium">{metric.text}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {primaryCTA.href ? (
              <Link href={primaryCTA.href}>
                <Button
                  variant="accelerator"
                  size="hero"
                  className="rounded-lg"
                >
                  {primaryCTA.text}
                  {primaryCTA.icon ? (
                    <primaryCTA.icon className="ml-3 w-6 h-6" />
                  ) : (
                    <ArrowRight className="ml-3 w-6 h-6" />
                  )}
                </Button>
              </Link>
            ) : (
              <Button
                variant="accelerator"
                size="hero"
                className="rounded-lg"
                onClick={primaryCTA.onClick}
              >
                {primaryCTA.text}
                {primaryCTA.icon ? (
                  <primaryCTA.icon className="ml-3 w-6 h-6" />
                ) : (
                  <ArrowRight className="ml-3 w-6 h-6" />
                )}
              </Button>
            )}

            {secondaryCTA && (
              secondaryCTA.href ? (
                <Link href={secondaryCTA.href}>
                  <Button
                    variant="secondary-light"
                    size="hero"
                    className="rounded-lg"
                  >
                    {secondaryCTA.text}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary-light"
                  size="hero"
                  className="rounded-lg"
                  onClick={secondaryCTA.onClick}
                >
                  {secondaryCTA.text}
                </Button>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
