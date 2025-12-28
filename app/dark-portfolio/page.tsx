'use client';

import { LinkPreview } from '@/components/ui/link-preview';
import { motion } from 'framer-motion';
import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import BeamsCanvas from '@/components/ui/beams-canvas';
import BentoGrid from '@/components/ui/bento-grid';
import RotatingGradientRight from '@/components/ui/rotating-gradient-right';
import { TextRevealByWord } from '@/components/ui/text-reveal';

export default function DarkPortfolio() {
  const [simplified, setSimplified] = React.useState(false);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              Hamza Ayaz
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex space-x-8"
            >
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <BeamsCanvas beamCount={12} speed={70} tiltDeg={12} opacity={0.14} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-[36px] font-normal leading-tight" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                <span className="text-gray-400">I make</span>{' '}
                <LinkPreview
                  url="https://ui.aceternity.com"
                  className="text-white hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  digital products
                </LinkPreview>
                <span className="text-gray-400">{' '}feel human, beautiful, and unmistakably clear.</span>
                <br />
                <span className="text-gray-400">
                  Product Designer for{' '}
                  <LinkPreview
                    url="https://dubizzle.com"
                    className="text-white hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Dubizzle group
                  </LinkPreview>
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 mb-16"
            >
              <LinkPreview
                url="https://github.com/hamzaayaz"
                imageSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=640&auto=format&fit=crop"
                isStatic
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 border border-gray-600"
              >
                <Github className="w-5 h-5 mr-3" />
                View My Work
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </LinkPreview>
              
              <LinkPreview
                url="mailto:hamza@example.com"
                imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=640&auto=format&fit=crop"
                isStatic
                className="group inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="w-5 h-5 mr-3" />
                Get In Touch
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </LinkPreview>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-gray-700">React</span>
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-gray-700">Next.js</span>
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-gray-700">TypeScript</span>
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-gray-700">Node.js</span>
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-gray-700">Python</span>
              <span className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-gray-700">AWS</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Text Reveal Section */}
      <section className="relative w-full bg-black py-12">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <TextRevealByWord 
            text="Experience across B2C, B2B, and enterprise SaaS — used by millions, trusted by Fortune 500s, and currently integrating AI-driven design systems to create consistent, scalable designs 70% faster"
            className="h-[200vh]"
          />
        </div>
      </section>

      {/* Case studies - Toggle between gradient scroll and simplified bento */}
      <section id="work" className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 mb-1">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-semibold">Case studies</h2>
            {/* Toggle Switch */}
            <div className="flex items-center gap-3">
              <span className={`text-sm transition-colors ${!simplified ? 'text-white' : 'text-gray-500'}`}>
                Detailed
              </span>
              <button
                onClick={() => setSimplified((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black ${
                  simplified ? 'bg-white' : 'bg-gray-700'
                }`}
                role="switch"
                aria-checked={simplified}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                    simplified ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm transition-colors ${simplified ? 'text-white' : 'text-gray-500'}`}>
                Simplified
              </span>
            </div>
          </div>
        </div>

        {simplified ? (
          <div className="w-full">
            <BentoGrid
              fullBleed
              items={[
                {
                  id: 'b1',
                  title: 'Ambient Logo Explorations',
                  description: 'Shapes, colors and depth studies for identities.',
                  videoSrc: '/portfolio-video.mp4',
                },
                {
                  id: 'b2',
                  title: 'Realtime UI Motion',
                  description: 'Micro-interactions for product surfaces.',
                  videoSrc: '/reverse.mp4',
                },
                {
                  id: 'b3',
                  title: '3D Textures',
                  description: 'Procedural patterns and soft materials.',
                },
                {
                  id: 'b4',
                  title: 'Concept Car',
                  description: 'Neon strokes and velocity frames.',
                  videoSrc: '/reverse.mp4',
                },
              ]}
            />
          </div>
        ) : (
          <div className="px-6 py-1">
            <RotatingGradientRight 
              sections={[
                {
                  title: "Ambient Logo Explorations",
                  description: "Shapes, colors and depth studies for identities.",
                  imageSrc: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop",
                  videoSrc: "/portfolio-video.mp4",
                  buttonText: "View Case Study",
                },
                {
                  title: "Realtime UI Motion",
                  description: "Micro-interactions for product surfaces.",
                  imageSrc: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800&auto=format&fit=crop",
                  videoSrc: "/reverse.mp4",
                  buttonText: "View Case Study",
                },
              ]}
              sensitivityMultiplier={1.2} 
              wrapperHeightVh={210} 
            />
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Let&apos;s Work Together
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Ready to bring your ideas to life? I&apos;m always interested in new opportunities 
              and exciting projects. Let&apos;s create something amazing together.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <LinkPreview
                url="mailto:hamza@example.com"
                imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=640&auto=format&fit=crop"
                isStatic
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="w-5 h-5 mr-3" />
                Send Email
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </LinkPreview>
              
              <LinkPreview
                url="https://linkedin.com/in/hamzaayaz"
                imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=640&auto=format&fit=crop"
                isStatic
                className="group inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                <Linkedin className="w-5 h-5 mr-3" />
                Connect on LinkedIn
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </LinkPreview>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>&copy; 2024 Hamza Ayaz. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <LinkPreview
                url="https://github.com/hamzaayaz"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </LinkPreview>
              <LinkPreview
                url="https://linkedin.com/in/hamzaayaz"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </LinkPreview>
              <LinkPreview
                url="mailto:hamza@example.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </LinkPreview>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
