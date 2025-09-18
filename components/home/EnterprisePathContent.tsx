"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Shield,
  Globe,
  Users,
  Award,
  CheckCircle,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useContentEngagement } from "./ConditionalContentRenderer";

export default function EnterprisePathContent() {
  const { trackEngagement, trackCTAClick } = useContentEngagement();

  const handleCTAClick = (ctaType: string, destination: string) => {
    trackCTAClick(ctaType, destination);
  };

  const enterpriseChallenges = [
    {
      icon: Shield,
      title: "Regulatory Compliance",
      problem:
        "Complex regulatory requirements across multiple regions and standards",
      solution:
        "Extensive engineering experience with quality processes and compliance expertise",
      color: "from-red-500 to-red-600",
      shadowColor: "shadow-red-500/25",
    },
    {
      icon: Users,
      title: "Multi-Stakeholder Coordination",
      problem:
        "Managing multiple departments, vendors, and decision-makers in complex projects",
      solution:
        "Single point of contact with personal accountability for seamless coordination",
      color: "from-orange-500 to-orange-600",
      shadowColor: "shadow-orange-500/25",
    },
    {
      icon: Globe,
      title: "Global Supply Chain",
      problem:
        "Managing international suppliers, cultural differences, and quality consistency",
      solution:
        "Cross-cultural expertise (India-Singapore-Germany) with global manufacturing network",
      color: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/25",
    },
    {
      icon: Target,
      title: "Cost vs Quality Balance",
      problem:
        "Pressure to reduce costs while maintaining enterprise-grade quality standards",
      solution:
        "Hub & Spoke model combining German quality standards with global efficiency",
      color: "from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/25",
    },
  ];

  const hubSpokeAdvantages = [
    {
      title: "German Quality Hub",
      description:
        "Central quality oversight with German engineering standards and processes",
      icon: "🇩🇪",
      benefits: ["ISO compliance", "Quality assurance", "Technical oversight"],
    },
    {
      title: "Global Manufacturing Spokes",
      description:
        "Efficient production through carefully selected international manufacturing partners",
      icon: "🌍",
      benefits: [
        "Cost optimization",
        "Scalable production",
        "Regional expertise",
      ],
    },
    {
      title: "Integrated Coordination",
      description:
        "Seamless coordination between quality hub and manufacturing spokes",
      icon: "🔗",
      benefits: [
        "Single point of contact",
        "Unified communication",
        "Project accountability",
      ],
    },
  ];

  const enterpriseServices = [
    {
      title: "Enterprise Partnership Program",
      description:
        "Long-term strategic partnerships for complex engineering projects",
      features: [
        "Dedicated project management",
        "Regulatory compliance support",
        "Quality oversight",
        "Global coordination",
      ],
    },
    {
      title: "Regulatory Compliance Engineering",
      description:
        "Navigate complex regulatory requirements across multiple regions",
      features: [
        "Multi-standard compliance",
        "Documentation support",
        "Audit preparation",
        "Risk assessment",
      ],
    },
    {
      title: "Global Manufacturing Coordination",
      description:
        "Manage international suppliers and ensure quality consistency",
      features: [
        "Supplier qualification",
        "Quality audits",
        "Cultural bridge",
        "Cost optimization",
      ],
    },
  ];

  const enterpriseBenefits = [
    "German quality standards with global efficiency",
    "Single expert accountability vs team-based approaches",
    "Cross-cultural manufacturing expertise",
    "Regulatory compliance across multiple standards",
    "Direct communication (no account manager layers)",
    "Flexible engagement models for complex projects",
  ];

  return (
    <div className="space-y-16">
      {/* Enterprise Challenges Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="text-center mb-16"
        onViewportEnter={() => trackEngagement("enterprise_challenges", "view")}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Enterprise Engineering Challenges
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          I understand the complexity of enterprise projects. Here's how I help
          you navigate common engineering challenges at scale.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          {enterpriseChallenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg ${challenge.shadowColor} hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 active:scale-[0.98] active:bg-gray-50 group`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <challenge.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-left">
                  {challenge.title}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">
                    Challenge:
                  </h4>
                  <p className="text-gray-600 text-sm">{challenge.problem}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-600 mb-2">
                    My Solution:
                  </h4>
                  <p className="text-gray-700 text-sm font-medium">
                    {challenge.solution}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Hub & Spoke Model */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-6 md:p-8"
        onViewportEnter={() => trackEngagement("hub_spoke_model", "view")}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-slate-100 text-slate-800 px-6 py-3 text-sm font-medium mb-6 rounded-lg">
            <Building2 className="w-4 h-4 mr-2" />
            Hub & Spoke Model
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            German Quality + Global Efficiency
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            My unique approach combines engineering standards with global
            manufacturing efficiency for enterprise-scale projects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {hubSpokeAdvantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center active:scale-[0.98] active:bg-gray-50 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{advantage.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {advantage.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {advantage.description}
              </p>

              <div className="space-y-2">
                {advantage.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-slate-500 mr-2" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/solutions/for-enterprises">
            <Button
              variant="primary"
              size="hero"
              onClick={() =>
                handleCTAClick(
                  "enterprise_solutions",
                  "/solutions/for-enterprises"
                )
              }
            >
              Explore Enterprise Solutions
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Enterprise Services */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="text-center"
        onViewportEnter={() => trackEngagement("enterprise_services", "view")}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Enterprise Engineering Services
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Comprehensive engineering solutions designed for complex enterprise
          requirements and scale.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12 px-4 sm:px-6 md:px-8">
          {enterpriseServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 active:scale-[0.98] active:bg-gray-50 group"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="space-y-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enterprise Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="text-center"
        onViewportEnter={() => trackEngagement("enterprise_benefits", "view")}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Why Enterprises Choose Me
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Unlike large consultancies with team-based approaches, you get direct
          access to experienced engineering expertise with personal
          accountability.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 px-4 sm:px-6 md:px-8">
          {enterpriseBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-[0.98] active:bg-gray-50 group"
            >
              <CheckCircle className="w-6 h-6 text-slate-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-gray-700 font-medium text-sm">
                {benefit}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
