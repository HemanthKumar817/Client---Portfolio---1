
import React, { useState, useEffect, useRef } from 'react';
import DarkVeil from './components/DarkVeil';
import { BrandProfile } from './types';
import { generateProfessionalProfile } from './services/geminiService';

// Custom Hook for Scroll Reveal with Threshold support
const useScrollReveal = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

const INITIAL_PROFILE: BrandProfile = {
  name: "Alex Dev",
  role: "Fullstack Engineer",
  tagline: "Architecting Scalable Digital Experiences",
  summary: "Focused on bridging the gap between elegant design and high-performance backend systems. Passionate about building impactful software that solves real-world problems.",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "AWS"],
  projects: [
    {
      title: "Nebula Dashboard",
      description: "A real-time analytics platform for distributed cloud infrastructure with 99.9% uptime visualization.",
      tags: ["React", "D3.js", "WebSockets"]
    },
    {
      title: "Prism Ledger",
      description: "Secure, performant blockchain explorer featuring deep-linked transaction tracing and visual node mapping.",
      tags: ["Next.js", "Solidity", "GraphQL"]
    },
    {
      title: "Aura Sync",
      description: "Identity management system utilizing biometric hashing for decentralized authentication across web apps.",
      tags: ["Go", "Redis", "Docker"]
    }
  ],
  hueShift: 240
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<BrandProfile>(INITIAL_PROFILE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const aboutSection = useScrollReveal(0.15);
  const projectsSection = useScrollReveal(0.1);
  const contactSection = useScrollReveal(0.2);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const newProfile = await generateProfessionalProfile(profile.role, prompt);
      setProfile(newProfile);
      setShowGenerator(false);
    } catch (err) {
      alert("Failed to refine profile. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const interactionProps = {
    onMouseEnter: () => setIsInteracting(true),
    onMouseLeave: () => setIsInteracting(false)
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden relative font-sans selection:bg-indigo-500/30">
      {/* Background Layer */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${scrolled ? 'opacity-30' : 'opacity-40'}`}>
        <DarkVeil 
          hueShift={profile.hueShift} 
          speed={0.1} 
          warpAmount={0.2} 
          scanlineIntensity={0.1}
          noiseIntensity={0.03}
          scanlineFrequency={700}
          isInteracting={isInteracting}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl py-3 border-white/10 shadow-lg' : 'bg-transparent py-6 border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div 
            className="font-display font-bold text-xl tracking-tighter flex items-center gap-2 group cursor-pointer active:scale-95 transition-transform duration-300"
            {...interactionProps}
          >
            <div className="w-8 h-8 bg-indigo-500 rounded-md rotate-45 flex items-center justify-center group-hover:rotate-[225deg] transition-transform duration-700 shadow-lg shadow-indigo-500/20">
              <span className="text-white -rotate-45 text-xs group-hover:rotate-45 transition-transform">P</span>
            </div>
            <span className="group-hover:text-indigo-400 transition-colors">{profile.name}</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400 items-center">
            {['About', 'Projects'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="hover:text-white transition-standard relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-indigo-500 after:transition-all hover:after:w-full"
                {...interactionProps}
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => setShowGenerator(true)}
              className="px-5 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-full hover:bg-indigo-600 text-white hover:border-transparent transition-standard text-xs font-semibold active:scale-90"
              {...interactionProps}
            >
              AI Brand Studio
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-56 pb-40 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-reveal shadow-inner shadow-indigo-500/10" style={{ animationDelay: '100ms' }}>
          Portfolio v.2.5 Active
        </div>
        <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-tight animate-reveal" style={{ animationDelay: '300ms' }}>
          {profile.role.split(' ').map((word, i) => (
            <span key={i} className={i === 0 ? "block" : "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"}>
              {word}{" "}
            </span>
          ))}
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-14 font-light animate-float animate-reveal" style={{ animationDelay: '500ms' }}>
          {profile.tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 animate-reveal" style={{ animationDelay: '700ms' }}>
          <a 
            href="#projects" 
            className="px-10 py-5 bg-white text-slate-950 font-bold rounded-2xl hover:scale-[1.03] active:scale-95 transition-standard shadow-2xl shadow-white/10 group animate-glow"
            {...interactionProps}
          >
            Explore Projects
          </a>
          <button 
             onClick={() => setShowGenerator(true)}
             className="px-10 py-5 bg-slate-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-slate-800 active:scale-95 transition-standard group"
             {...interactionProps}
          >
            Refine with AI
          </button>
        </div>

        {/* Scroll Hint */}
        <div className={`mt-32 transition-opacity duration-1000 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-5 h-8 border-2 border-slate-700 rounded-full flex justify-center p-1">
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-scroll-hint" />
          </div>
        </div>
      </header>

      {/* About Section */}
      <section 
        id="about" 
        ref={aboutSection.ref}
        className={`relative z-10 py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center border-t border-white/5 reveal-hidden ${aboutSection.isVisible ? 'reveal-visible' : ''}`}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4">The Foundation</h2>
            <p className="text-4xl font-display font-light text-white leading-snug">
              {profile.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill, i) => (
              <span 
                key={skill} 
                className={`px-5 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-sm text-slate-300 font-medium hover:border-indigo-500/40 hover:text-white transition-standard transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 cursor-default ${aboutSection.isVisible ? 'animate-reveal' : 'opacity-0'}`}
                style={{ animationDelay: `${800 + (i * 100)}ms` }}
                {...interactionProps}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex gap-2 mb-10">
            <div className="w-3 h-3 rounded-full bg-red-500/30" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
            <div className="w-3 h-3 rounded-full bg-green-500/30" />
          </div>
          <div className="space-y-8 relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                <span>Conceptual Design</span>
                <span>95%</span>
              </div>
              <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-[2s] cubic-bezier(0.19, 1, 0.22, 1)" 
                  style={{ width: aboutSection.isVisible ? '95%' : '0%', boxShadow: '0 0 15px rgba(99,102,241,0.6)' }} 
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                <span>Systems Architecture</span>
                <span>90%</span>
              </div>
              <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-[2s] delay-200 cubic-bezier(0.19, 1, 0.22, 1)" 
                  style={{ width: aboutSection.isVisible ? '90%' : '0%', boxShadow: '0 0 15px rgba(168,85,247,0.6)' }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section 
        id="projects" 
        ref={projectsSection.ref}
        className={`relative z-10 py-40 px-6 max-w-7xl mx-auto border-t border-white/5 reveal-hidden ${projectsSection.isVisible ? 'reveal-visible' : ''}`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-xl">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4">Gallery of Work</h2>
            <h3 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">Featured <br/><span className="text-slate-500">Systems</span></h3>
          </div>
          <p className="text-slate-500 max-w-xs text-xs font-mono uppercase tracking-widest leading-loose">
            High performance architecture meets expressive interaction design.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {profile.projects.map((project, i) => (
            <div 
              key={i} 
              className={`group bg-slate-900/20 backdrop-blur-lg border border-white/10 p-10 rounded-[2.5rem] transition-standard transform hover:-translate-y-4 hover:border-indigo-500/30 reveal-hidden ${projectsSection.isVisible ? 'reveal-visible' : ''}`}
              style={{ transitionDelay: `${i * 150}ms` }}
              {...interactionProps}
            >
              <div className="w-14 h-14 mb-8 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                {['✨', '💠', '⚡'][i % 3]}
              </div>
              <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors tracking-tight">{project.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 group-hover:text-slate-300 transition-colors">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-wider text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg group-hover:bg-indigo-500/10 group-hover:text-indigo-300 transition-standard">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl transition-all duration-500"
            onClick={() => !isGenerating && setShowGenerator(false)}
          />
          <div className="relative z-10 w-full max-w-xl bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-reveal">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-3xl font-display font-bold text-white">Brand Studio</h3>
              <button 
                onClick={() => setShowGenerator(false)}
                className="text-slate-600 hover:text-white transition-standard text-2xl"
              >
                &times;
              </button>
            </div>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-light">
              Our neural engine will re-map your portfolio aesthetic and content based on your professional vision.
            </p>
            <form onSubmit={handleGenerate} className="space-y-6">
              <textarea
                autoFocus
                disabled={isGenerating}
                placeholder="Ex: Refocus my profile for a specialized AI Infrastructure role with an emphasis on sustainable computing..."
                className="w-full h-40 bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-standard disabled:opacity-50 text-white placeholder:text-slate-700 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-standard disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.97] shadow-xl shadow-indigo-600/20"
                {...interactionProps}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Synchronizing Aura...
                  </>
                ) : (
                  "Update Identity"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer 
        id="contact" 
        ref={contactSection.ref}
        className={`relative z-10 py-40 px-6 max-w-7xl mx-auto border-t border-white/5 text-center reveal-hidden ${contactSection.isVisible ? 'reveal-visible' : ''}`}
      >
        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.3em] mb-8">Initiate Contact</h2>
        <a 
          href={`mailto:${profile.name.toLowerCase().replace(' ', '')}@dev.engine`} 
          className="text-3xl md:text-6xl font-light text-slate-400 hover:text-white transition-all inline-block border-b border-transparent hover:border-indigo-500 pb-2 active:scale-95"
          {...interactionProps}
        >
          {profile.name.toLowerCase().replace(' ', '')}@dev.engine
        </a>
        <div className="mt-32 flex flex-col items-center gap-8">
            <div className="flex gap-10 text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
                <span className="cursor-pointer hover:text-indigo-400 transition-standard" {...interactionProps}>LinkedIn</span>
                <span className="cursor-pointer hover:text-indigo-400 transition-standard" {...interactionProps}>GitHub</span>
                <span className="cursor-pointer hover:text-indigo-400 transition-standard" {...interactionProps}>Layers</span>
            </div>
            <div className="text-slate-800 text-[9px] font-mono uppercase tracking-[0.5em]">
              &copy; {new Date().getFullYear()} {profile.name} // Neural Brand System // [41.8781° N, 87.6298° W]
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
