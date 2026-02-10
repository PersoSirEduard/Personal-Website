// App.jsx
import React, { useState } from 'react';
import { Briefcase, GraduationCap, Mail, Linkedin, Github, ExternalLink, FileText, Sparkles, Code, Rocket, Brain, Coffee } from 'lucide-react';

function App() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('eduard.anton@mail.mcgill.ca');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const projects = [
    {
      title: 'RL High Altitude Balloon Flight Computer',
      tech: 'C · MATLAB · TensorFlow · RTOS',
      icon: Rocket,
      color: 'from-blue-500/20 to-cyan-500/20',
      link: '#'
    },
    {
      title: 'MediaFlux Livestream Pipeline',
      tech: 'Go · FFmpeg · Kubernetes · RTMP',
      icon: Sparkles,
      color: 'from-purple-500/20 to-pink-500/20',
      link: '#'
    },
    {
      title: 'Photorealistic Ray Tracer',
      tech: 'Python · Taichi · CUDA',
      icon: Brain,
      color: 'from-green-500/20 to-emerald-500/20',
      link: '#'
    },
    {
      title: 'ScamBack AI Agent',
      tech: 'Python · LLM · Twilio · STT/TTS',
      icon: Code,
      color: 'from-orange-500/20 to-red-500/20',
      link: '#'
    }
  ];

  const writings = [
    { title: 'Anytime Planning with Continuous Thought Machines', date: 'Dec. 2025', link: '/papers/Anytime_Planning_with_CTMs.pdf' },
    { title: 'Emotion Recognition with BERT and Naive Bayes', date: '2024', link: '/papers/Emotion_Recognition_BERT_and_Naive_Bayes-1.pdf' },
    { title: 'Image Recognition with CNN and MLP', date: '2024', link: '/papers/Image_Recognition_CNN_and_MLP-1.pdf' },
    { title: 'Burst Out of the Behavior', date: '2024', link: '/papers/ecse316-burst-out-of-the-behavior-1.pdf' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-7xl">
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-auto">
          
          {/* HERO BENTO - Large Central Card */}
          <div className="md:col-span-6 lg:col-span-7 lg:row-span-2 bento-card group">
            <div className="h-full flex flex-col justify-between p-8 sm:p-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-mono text-white/60">Available for opportunities</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                  Eduard<br />Anton
                </h1>
                
                <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
                  M.Sc. Computer Science student at <span className="text-white font-semibold">McGill University</span>, focused on <span className="text-white font-semibold">reinforcement learning</span>, LLMs, robotics, and low-level systems. Co-founder of <span className="text-white font-semibold">Streamwise</span>, an AI startup backed by Next AI and Mila. Motivated by building real products from research ideas.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-sm font-mono text-white/60">Reinforcement Learning</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-sm font-mono text-white/60">LLMs</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-sm font-mono text-white/60">Distributed Systems</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-sm font-mono text-white/60">Entrepreneurship</span>
                </div>
              </div>
            </div>
          </div>

          {/* STREAMWISE CARD */}
          <div className="md:col-span-3 lg:col-span-5 bento-card group hover:border-blue-500/30 cursor-pointer"
               onClick={() => window.open('https://streamwise.gg', '_blank')}>
            <div className="h-full p-6 sm:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-blue-400 transition-colors" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Streamwise</h2>
              <p className="text-sm font-mono text-blue-400 mb-4">Lead Software Engineer / CTO</p>

              <p className="text-white/70 leading-relaxed flex-grow">
                Architecting a production-grade, low-latency ASR + LLM system for real-time speech moderation in live streaming. Scaling ML inference pipelines to 100+ concurrent users on AWS.
              </p>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Real-time ML</span>
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Go Backend</span>
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">AWS / K8s</span>
                </div>
              </div>
            </div>
          </div>

          {/* MCGILL CARD */}
          <div className="md:col-span-3 lg:col-span-5 bento-card group hover:border-purple-500/30 cursor-pointer"
               onClick={() => window.open('https://www.mcgill.ca', '_blank')}>
            <div className="h-full p-6 sm:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                  <GraduationCap className="w-6 h-6 text-purple-400" />
                </div>
                <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-purple-400 transition-colors" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">McGill University</h2>
              <p className="text-sm font-mono text-purple-400 mb-4">M.Sc. CS (AI/ML) · B.Eng. Software (3.75 GPA)</p>

              <p className="text-white/70 leading-relaxed flex-grow">
                Researching advanced ML and reinforcement learning. Published work on Continuous Thought Machines for decision-making in partially observable environments.
              </p>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Reinforcement Learning</span>
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Deep Learning</span>
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Research</span>
                </div>
              </div>
            </div>
          </div>

          {/* PROJECTS GRID */}
          <div className="md:col-span-6 lg:col-span-7 bento-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-white/80" />
              <h3 className="text-2xl font-bold">Selected Projects</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((project, idx) => (
                <a 
                  key={idx}
                  href={project.link}
                  className="group/project p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 cursor-pointer block"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${project.color} w-fit mb-3`}>
                    <project.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold mb-2 group-hover/project:text-white transition-colors">{project.title}</h4>
                  <p className="text-sm font-mono text-white/50">{project.tech}</p>
                </a>
              ))}
            </div>
          </div>

          {/* COFFEE/STATUS CARD */}
          <div className="md:col-span-3 lg:col-span-5 bento-card group hover:border-amber-500/30">
            <div className="h-full p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 w-fit mb-4">
                  <Coffee className="w-6 h-6 text-amber-400" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Currently</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">→</span>
                    <span>Scaling Streamwise's real-time ASR + LLM pipeline on AWS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">→</span>
                    <span>Pursuing M.Sc. in AI/ML at McGill University</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">→</span>
                    <span>Drinking way too much espresso</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs font-mono text-white/40">Last updated: Feb 2026</p>
              </div>
            </div>
          </div>

          {/* WRITING DRAWER */}
          <div className="md:col-span-6 lg:col-span-12 bento-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-white/80" />
              <h3 className="text-2xl font-bold">Research & Papers</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {writings.map((article, idx) => (
                <a
                  key={idx}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/article p-5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 cursor-pointer block"
                >
                  <p className="text-xs font-mono text-white/40 mb-2">{article.date}</p>
                  <h4 className="font-semibold text-lg leading-snug group-hover/article:text-white transition-colors">
                    {article.title}
                  </h4>
                  <div className="mt-3 flex items-center gap-2 text-white/40 group-hover/article:text-white/60 transition-colors">
                    <span className="text-sm">View PDF</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CONTACT FOOTER */}
          <div className="md:col-span-6 lg:col-span-12 bento-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Let's Connect</h3>
                <p className="text-white/60">Open to collaborations, opportunities, and interesting conversations.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={copyEmail}
                  className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Mail className="w-5 h-5" />
                  {copiedEmail ? 'Copied!' : 'Copy Email'}
                </button>
                
                <a 
                  href="https://www.linkedin.com/in/eduard-anton" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                
                <a 
                  href="https://github.com/PersoSirEduard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm font-mono text-white/30">
            © 2026 Eduard Anton — Designed with precision & built with React
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
