import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useInView, AnimatePresence } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Code2, Cpu, Globe, Palette, X, ArrowRight, Terminal, Database, Cloud, Layout } from 'lucide-react';

// --- HELPER COMPONENTS ---

// 1. Scroll Progress Bar
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-[100]"
      style={{ scaleX }}
    />
  );
};

// 2. Modern Background (Animated Gradient Mesh & Grid)
const ModernBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      {/* Animated Color Blobs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/30 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[60vw] bg-cyan-900/20 rounded-full blur-[120px]" 
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07]" 
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.3) 60%, rgba(5,5,5,1) 100%)' }} />
    </div>
  );
};

// 3. Shiny Text
const ShinyText = ({ text, disabled = false, speed = 3, className = '' }) => {
  const animationDuration = `${speed}s`;
  return (
    <div
      className={`relative inline-block overflow-hidden bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 via-white to-neutral-200 dark:from-neutral-200 dark:via-white dark:to-neutral-200 ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration,
      }}
    >
      {text}
      <style>{`
        @keyframes shine {
          to { background-position: 200% center; }
        }
        .animate-shine { animation: shine linear infinite; }
      `}</style>
    </div>
  );
};

// 4. Gradient Text
const GradientText = ({ children, className = "" }) => {
  return (
    <span className={`bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient ${className}`}>
      {children}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient { animation: gradient 3s linear infinite; }
      `}</style>
    </span>
  );
};

// 5. Magnet
const Magnet = ({ children, padding = 20, disabled = false, magnetStrength = 20 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x / (50 / magnetStrength), y: y / (50 / magnetStrength) });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ padding }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

// 6. Spotlight Card
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl bg-neutral-900/50 border border-neutral-800 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168,85,247,0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

// 7. Tilted Card
const TiltedCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rX = (mouseY / height - 0.5) * 20 * -1;
    const rY = (mouseX / width - 0.5) * 20;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", transform }}
      className={`relative transition-all duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  );
};

// 8. Star Border
const StarBorder = ({ children, color = "cyan" }) => {
  return (
    <div className="relative p-[1px] rounded-xl overflow-hidden group h-full">
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-500" 
        style={{ 
          background: `linear-gradient(to right, transparent, ${color === 'cyan' ? '#06b6d4' : color === 'purple' ? '#a855f7' : '#eab308'}, transparent)`,
          backgroundSize: '200% 200%' 
        }} 
      />
      <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,#3b82f6_100%)] animate-[spin_4s_linear_infinite] opacity-40" />
      <div className="relative bg-neutral-900 rounded-xl h-full w-full">
        {children}
      </div>
    </div>
  );
};

// 9. Scroll Reveal
const ScrollReveal = ({ text, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  const words = text.split(" ");

  return (
    <p ref={ref} className={`flex flex-wrap leading-relaxed ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="mr-2"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

// 10. Pill Nav (Bottom)
const PillNav = ({ items, activeId, onSelect }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-full shadow-2xl shadow-purple-500/20">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${activeId === item.id ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            {activeId === item.id && (
              <motion.div
                layoutId="pill-nav-bg"
                className="absolute inset-0 bg-neutral-700 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// 11. Tech Marquee
const TechMarquee = () => {
  const techs = [
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "Framer Motion", "GraphQL", "Python", "Docker", "AWS", "Firebase", "Figma", "Solidity"
  ];

  return (
    <div className="relative flex overflow-hidden py-10 bg-neutral-900/50 backdrop-blur-sm border-y border-neutral-800/50">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {[...techs, ...techs].map((tech, index) => (
          <div key={index} className="flex items-center gap-2 text-neutral-400 font-mono text-lg hover:text-purple-400 transition-colors cursor-default">
            <span className="text-purple-500">•</span>
            {tech}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// 12. Experience Item
const ExperienceItem = ({ date, title, company, desc, isLast }) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-purple-500 border-4 border-black z-10 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        {!isLast && <div className="w-0.5 h-full bg-neutral-800 -mt-2 mb-2" />}
      </div>
      <div className="pb-12">
        <span className="text-sm font-mono text-purple-400 mb-1 block">{date}</span>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="text-neutral-400 text-sm mb-3 block">{company}</span>
        <p className="text-neutral-500 leading-relaxed max-w-lg">
          {desc}
        </p>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        setActiveSection('contact');
        return;
      }
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
            break; 
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skills = [
    { Icon: Code2, title: "Frontend", desc: "React, Next.js, Tailwind" },
    { Icon: Palette, title: "Design", desc: "Figma, UI Systems" },
    { Icon: Database, title: "Backend", desc: "Node.js, PostgreSQL" },
    { Icon: Cloud, title: "DevOps", desc: "AWS, Docker, CI/CD" }
  ];

  const socialLinks = [
    { Icon: Github, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Linkedin, href: "#" }
  ];

  // Data in English
  const experiences = [
    {
      date: "2023 - Present",
      title: "Senior Frontend Developer",
      company: "TechNova Solutions",
      desc: "Managing the architecture of large-scale React applications. Working on performance optimization and developing internal UI libraries."
    },
    {
      date: "2021 - 2023",
      title: "Full Stack Developer",
      company: "Creative Agency",
      desc: "Developed custom web solutions based on Next.js and Node.js for clients. Successfully delivered 15+ projects."
    },
    {
      date: "2019 - 2021",
      title: "Freelance Developer",
      company: "Self-employed",
      desc: "Provided UI/UX design and frontend development services to global clients via Upwork."
    }
  ];

  const projectData = [
    {
      id: 1,
      title: "Nova E-Commerce System",
      shortDesc: "High-performance, scalable headless e-commerce infrastructure.",
      fullDesc: "Nova was developed as a solution to the clumsiness of traditional e-commerce systems. Built using Next.js and GraphQL, this infrastructure offers page loads in milliseconds. It aims to increase sales by 40% with Stripe integration, real-time inventory management, and an AI-powered product recommendation engine.",
      tags: ["React", "Node.js", "GraphQL"],
      color: "cyan"
    },
    {
      id: 2,
      title: "Pulse Social AI",
      shortDesc: "Real-time sentiment analysis and trend tracking for brands.",
      fullDesc: "Pulse measures the perception of your brand by processing social media data in seconds. The backend, developed using Python and NLP models, analyzes millions of tweets and comments. You can detect crises in advance via the React-based dashboard and receive automatic reports.",
      tags: ["Python", "TensorFlow", "Next.js"],
      color: "purple"
    },
    {
      id: 3,
      title: "Aether DeFi Wallet",
      shortDesc: "Secure and user-friendly gateway to the Web3 world.",
      fullDesc: "Aether is a non-custodial wallet application that simplifies complex crypto transactions. With multi-chain support, it offers the ability to transact on Ethereum, Solana, and Polygon networks. It offers security and usability together with biometric security layers and an integrated DApp browser.",
      tags: ["Web3.js", "Solidity", "Rust"],
      color: "yellow"
    }
  ];

  return (
    <div className="min-h-screen text-neutral-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Modern Background */}
      <ModernBackground />

      {/* --- MODAL (POPUP) --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl relative overflow-hidden shadow-2xl shadow-purple-500/10"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-${selectedProject.color === 'purple' ? 'purple-500' : selectedProject.color === 'yellow' ? 'yellow-500' : 'cyan-500'}`} />
              
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-neutral-800/50 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <div className="w-full h-48 bg-neutral-800 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                   <div className={`absolute inset-0 bg-gradient-to-t from-${selectedProject.color === 'purple' ? 'purple-900' : selectedProject.color === 'yellow' ? 'yellow-900' : 'cyan-900'} to-transparent opacity-40`} />
                   <span className="text-white/80 font-mono text-lg z-10">{selectedProject.title} Interface</span>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h3>
                
                <div className="flex gap-2 mb-6">
                  {selectedProject.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-xs text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-neutral-300 leading-relaxed mb-8">
                  {selectedProject.fullDesc}
                </p>

                <div className="flex justify-end gap-4">
                    <button onClick={() => setSelectedProject(null)} className="px-4 py-2 text-neutral-400 hover:text-white transition-colors">
                        Close
                    </button>
                    <button className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2">
                        View Project <ExternalLink size={16}/>
                    </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center items-center px-6 z-10">
        <div className="text-center space-y-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4 flex items-center justify-center gap-2 text-sm font-mono text-purple-400 border border-purple-500/30 rounded-full px-3 py-1 w-fit mx-auto bg-purple-500/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Portfolio v2.0
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">
              Hello, I'm <br />
              <GradientText className="font-extrabold">Cankat</GradientText>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Boxed Text Area (Requested Tweak) */}
            <div className="inline-block px-6 py-2 mt-6 rounded-full bg-neutral-900/60 border border-white/10 backdrop-blur-md shadow-2xl shadow-purple-500/10">
              <ShinyText 
                text="Full Stack Developer & UI Designer" 
                className="text-xl md:text-2xl font-light" 
                speed={4}
              />
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Magnet>
              <button onClick={() => scrollToSection('projects')} className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                View My Projects
              </button>
            </Magnet>
            <Magnet>
              <button onClick={() => scrollToSection('contact')} className="px-6 py-3 border border-neutral-700 bg-black/50 backdrop-blur-sm rounded-full hover:bg-neutral-900 transition-colors">
                Get in Touch
              </button>
            </Magnet>
          </motion.div>
        </div>
      </section>

      {/* --- TECH MARQUEE --- */}
      <TechMarquee />

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="relative py-32 px-6 z-10 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-purple-500 pl-4">About Me</h2>
            <ScrollReveal 
              text="Hello! I'm Cankat. I am a developer who loves combining aesthetics and functionality in the digital world. I specialize in the React ecosystem and modern web technologies. Transforming complex problems into simple, user-friendly, and fluid interfaces is my greatest passion." 
              className="text-lg md:text-xl text-neutral-300"
            />
            <ScrollReveal 
              text="I can take your projects to the next level with my design-oriented thinking structure and clean code principles. I am continuously learning, trying, and developing." 
              className="text-lg md:text-xl text-neutral-300 mt-4"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <TiltedCard key={index} className="h-full">
                <SpotlightCard className="h-full flex flex-col items-center text-center gap-4 p-6 hover:bg-neutral-800/50 transition-colors backdrop-blur-sm">
                  <div className="text-purple-400 relative z-10">
                    <skill.Icon size={32} />
                  </div>
                  <h3 className="font-bold text-white relative z-10">{skill.title}</h3>
                  <p className="text-sm text-neutral-400 relative z-10">{skill.desc}</p>
                </SpotlightCard>
              </TiltedCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section id="experience" className="relative py-20 px-6 z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Experience</h2>
          <p className="text-neutral-400">My professional career journey.</p>
        </div>
        
        <div className="pl-4 md:pl-0">
          {experiences.map((exp, index) => (
            <ExperienceItem 
              key={index}
              {...exp}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="relative py-32 px-6 z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Selected <span className="text-purple-500">Projects</span></h2>
          <p className="text-neutral-400">Some work I've been working on lately.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectData.map((project) => (
            <StarBorder key={project.id} color={project.color}>
              <div className="h-full p-6 flex flex-col gap-4 bg-neutral-900/80 backdrop-blur-sm group">
                <div className="w-full h-48 bg-neutral-800 rounded-lg overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 relative">
                  <div className={`absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80`} />
                  <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-${project.color === 'purple' ? 'purple-900' : project.color === 'yellow' ? 'yellow-900' : 'cyan-900'}/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    <Code2 className="text-neutral-700 group-hover:text-white transition-colors duration-500" size={48} />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mt-2">{project.title}</h3>
                
                <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                  {project.shortDesc}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800/50">
                   <div className="flex gap-2">
                      {project.tags.slice(0, 2).map((tag, i) => (
                         <span key={i} className="text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300">
                            {tag}
                         </span>
                      ))}
                   </div>
                   
                   <button 
                      onClick={() => setSelectedProject(project)}
                      className="text-sm font-medium text-purple-400 hover:text-white flex items-center gap-1 transition-colors group/btn"
                   >
                      Read More 
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </StarBorder>
          ))}
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="relative py-32 px-6 z-10 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl w-full bg-neutral-900/30 backdrop-blur-xl border border-neutral-800 p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-shine" />
          
          <h2 className="text-4xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-neutral-400 mb-10">
            Do you have a new project idea? Or just want to say hello? 
            My inbox is always open.
          </p>

          <Magnet magnetStrength={40}>
            <a 
              href="mailto:contact@cankat.com" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              <Mail size={20} />
              Contact Me
            </a>
          </Magnet>

          <div className="flex justify-center gap-8 mt-12">
            {socialLinks.map(({ Icon, href }, i) => (
              <Magnet key={i} padding={10}>
                <a href={href} className="text-neutral-400 hover:text-white transition-colors block p-2">
                  <Icon />
                </a>
              </Magnet>
            ))}
          </div>
        </div>
        
        <footer className="mt-20 text-neutral-600 text-sm">
          © 2024 Cankat. Designed with ReactBits components.
        </footer>
      </section>

      {/* --- NAVIGATION --- */}
      <PillNav items={navItems} activeId={activeSection} onSelect={scrollToSection} />

    </div>
  );
}

// ExternalLink
function ExternalLink({size, className}) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
    )
}