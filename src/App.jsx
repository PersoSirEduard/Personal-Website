// App.jsx
import { Suspense, lazy, useEffect, useState, useSyncExternalStore } from 'react';
import { Mail, Linkedin, Github, ArrowUpRight, Check, ChevronDown } from 'lucide-react';

import McGillCrest from './components/McGillCrest';

const NeuronFigure = lazy(() => import('./components/NeuronFigure'));

const EMAIL = 'eduard.anton@mail.mcgill.ca';

const experience = [
  {
    role: 'Machine Learning Engineer',
    org: 'Buildcheck',
    link: 'https://buildcheck.ai',
    meta: 'Full-time · Montréal',
    dates: 'Sep 2026 – Present',
    current: true,
    description: 'Building agentic AI systems for the construction industry.',
  },
  {
    role: 'Research Assistant',
    org: 'McGill University',
    link: 'https://www.mcgill.ca',
    meta: 'Part-time · Montréal',
    dates: 'Dec 2025 – Present',
    current: true,
    description: 'Built OCR pipelines that turn unstructured data from PDFs and images into clean, structured datasets for government applications.',
  },
  {
    role: 'AI & Data Engineering Intern',
    org: 'Avanade',
    link: 'https://www.avanade.com',
    meta: 'Internship · Montréal',
    dates: 'Apr 2026 – Aug 2026',
    description: 'Built enterprise AI solutions with Azure AI, Databricks, and Microsoft technologies.',
  },
  {
    role: 'Co-Founder & Member of Technical Staff',
    org: 'Streamwise',
    meta: 'Startup · since retired',
    dates: 'Aug 2025 – Apr 2026',
    description: 'Founded and led a real-time AI platform that analyzed and auto-edited live audio and video streams for content moderation before delivery. Worked with Mila, Next AI, and Creative Destruction Lab, and showcased at TwitchCon 2025 in San Diego.',
  },
  {
    role: 'Co-Director',
    org: 'HackMcGill',
    meta: 'Previously Sponsorship Co-Lead and Sponsorship Coordinator',
    dates: 'Oct 2022 – Apr 2025',
    description: "Led the organization of McHacks 12, McGill's largest hackathon: a $100k+ budget, 400+ projects, and more than 3,000 students reached.",
  },
  {
    role: 'Software Developer Intern',
    org: 'CAE',
    meta: 'Internship · Aircraft System Specialist',
    dates: 'May 2024 – Aug 2024',
    description: 'Engineered C++ simulation software for a radio controller in a critical aircraft simulator, designed CI/CD in Azure, and worked with cross-functional teams on a certifiable flight simulator.',
  },
  {
    role: 'Software Developer Intern',
    org: 'Ericsson',
    meta: 'Internship',
    dates: 'Jan 2024 – May 2024',
    description: 'Researched and developed software for 5G data channels through IMS cloud infrastructure on Azure, and designed real-time speech translation over phone calls with LLMs, ASR models, and edge computing.',
  },
  {
    role: 'AUV Software Developer',
    org: 'McGill Robotics',
    meta: 'Part-time',
    dates: 'Oct 2023 – Jan 2024',
    description: 'Developed control software and algorithms for an autonomous underwater vehicle.',
  },
  {
    role: 'Software Engineering Intern',
    org: 'Airbus',
    meta: 'Internship',
    dates: 'May 2023 – Sep 2023',
    description: 'Integrated aircraft simulation models and built interfaces with VAPS XT and OpenGL. Generated simulation streaming data in C++ and Python for integration testing on distributed systems.',
  },
  {
    role: 'Software Developer & Community Manager',
    org: 'Kurius',
    meta: 'Non-profit · later Mentor',
    dates: 'Aug 2021 – Nov 2022',
    description: 'Managed the online community of an NGO for young Canadians passionate about software development and computer science.',
  },
  {
    role: 'Integration Specialist',
    org: 'CAE',
    meta: 'Internship',
    dates: 'May 2022 – Aug 2022',
  },
  {
    role: 'Control Station Manager',
    org: 'McGill Rocket Team',
    meta: 'Student team',
    dates: 'Oct 2021 – May 2022',
  },
  {
    role: 'IT Technician / Software Developer',
    org: 'Gexel Telecom',
    meta: 'Contract',
    dates: 'Jun 2021 – Aug 2022',
  },
];

// Entries past this many are tucked behind the expand toggle.
const VISIBLE_EXPERIENCE = 3;

const education = [
  { degree: 'M.Sc. Computer Science (AI/ML)', school: 'McGill University' },
  { degree: 'B.Eng. Software Engineering', school: 'McGill University' },
];

const interests = ['Agentic AI', 'Reinforcement Learning', 'Robotics', 'Computer Vision'];

const writings = [
  { title: 'Recursive Language Models for RTL Code Generation', date: 'Mar. 2026', link: '/papers/Recursive_Language_Models_for_RTL_Code_Generation.pdf' },
  { title: 'Constrained Reflective Thinking for Physically Grounded LLM Planning', date: 'Mar. 2026', link: '/papers/Constrained_Reflective_Thinking_Grounded_LLM_Planning.pdf' },
  { title: 'On-policy Distillation for ASR Optimization', date: 'Jan. 2026', link: '/papers/Streamwise_Technical_Summary.pdf' },
  { title: 'Anytime Planning with Continuous Thought Machines', date: 'Dec. 2025', link: '/papers/Anytime_Planning_with_CTMs.pdf' },
  { title: 'Emotion Recognition with BERT and Naive Bayes', date: '2024', link: '/papers/Emotion_Recognition_BERT_and_Naive_Bayes-1.pdf' },
  { title: 'Image Recognition with CNN and MLP', date: '2024', link: '/papers/Image_Recognition_CNN_and_MLP-1.pdf' },
  { title: 'Burst Out of the Behavior', date: '2024', link: '/papers/ecse316-burst-out-of-the-behavior-1.pdf' },
];

const projects = [
  { title: 'RL High Altitude Balloon Flight Computer', tech: 'C · MATLAB · TensorFlow · RTOS' },
  { title: 'MediaFlux Livestream Pipeline', tech: 'Go · FFmpeg · Kubernetes · RTMP' },
  { title: 'Photorealistic Ray Tracer', tech: 'Python · Taichi · CUDA' },
  { title: 'ScamBack AI Agent', tech: 'Python · LLM · Twilio · STT/TTS' },
];

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const pad = (n) => String(n).padStart(2, '0');

// False while prerendering and hydrating, true once running in the browser.
const noopSubscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

// Fades sections in and draws their header rule as they enter the viewport.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function SectionHeader({ index, title, note }) {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs text-sanguine">[{pad(index)}]</span>
        <h2 className="font-serif text-3xl sm:text-4xl">{title}</h2>
        {note && <span className="ml-auto hidden sm:block font-mono text-[11px] text-ink-faint">{note}</span>}
      </div>
      <div className="draw-rule mt-4" />
    </div>
  );
}

function App() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const isClient = useIsClient();
  const [showAllExperience, setShowAllExperience] = useState(false);
  const hiddenExperience = experience.length - VISIBLE_EXPERIENCE;
  useReveal();

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen drafting-grid text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-rule/60 bg-parchment/85 backdrop-blur-sm">
        <nav aria-label="Primary" className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between font-mono text-xs">
          <a href="#top" className="tracking-wide">EDUARD ANTON <span className="text-ink-faint">/ v2026.10</span></a>
          <ul className="hidden md:flex gap-6 text-ink-soft">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-sanguine transition-colors">[{pad(i + 1)}] {s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Hero */}
        <section id="about" className="relative grid md:grid-cols-[1.1fr_1fr] items-center gap-6 pt-14 sm:pt-20 pb-16 sm:pb-24 scroll-mt-14">
          <div>
            <p className="font-mono text-[11px] tracking-wider text-ink-faint uppercase mb-6">
              ML Engineer @ Buildcheck — M.Sc. CS @ McGill
            </p>
            <div className="flex items-end gap-5 sm:gap-7 mb-6">
              <figure className="shrink-0">
                <div className="portrait">
                  <picture>
                    <source srcSet="/portrait.webp" type="image/webp" />
                    <img src="/portrait.jpg" alt="Portrait of Eduard Anton" width="640" height="800" fetchPriority="high" decoding="async" />
                  </picture>
                </div>
                <figcaption className="mt-2 text-center font-mono text-[10px] text-ink-faint">fig. 02 · portrait</figcaption>
              </figure>
              <div className="pb-5 sm:pb-6">
                <h1 className="font-serif text-5xl sm:text-7xl lg:text-[5.25rem] leading-[0.95] tracking-tight">
                  Eduard<br />Anton
                </h1>
              </div>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-ink-soft max-w-xl">
              I'm a machine learning engineer at <a href="https://buildcheck.ai" target="_blank" rel="noopener noreferrer" className="ink-link">Buildcheck</a>, a startup based in Palo Alto, CA, building agentic AI for construction. My work spans agentic AI systems, AI alignment, reinforcement learning, robotics, and computer vision, alongside research at <span className="text-ink">McGill University</span>. I'm an engineer and founder at heart: I previously founded Streamwise, and I'm motivated by turning research ideas into real products.
            </p>
            <p className="text-base leading-relaxed text-ink-soft max-w-xl mt-4">
              Outside of work: travelling, bouldering, filmmaking, skiing, cooking, and video games.
            </p>
            <div className="flex flex-wrap gap-2 mt-7">
              {interests.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>

          <figure className="relative h-[300px] sm:h-[420px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <g fill="none" stroke="currentColor" className="text-ink" strokeOpacity="0.14" strokeWidth="0.8">
                <circle cx="200" cy="210" r="175" />
                <circle cx="200" cy="210" r="108" />
                <line x1="0" y1="210" x2="400" y2="210" />
                <line x1="200" y1="20" x2="200" y2="400" />
                <line x1="76" y1="86" x2="324" y2="334" />
                <line x1="324" y1="86" x2="76" y2="334" />
              </g>
            </svg>
            {/* WebGL figure is browser-only; it isn't part of the prerendered HTML */}
            {isClient && (
              <Suspense fallback={null}>
                <NeuronFigure className="absolute inset-0 w-full h-full" />
              </Suspense>
            )}
            <figcaption className="absolute right-0 top-2 font-mono text-[11px] text-sanguine">↙ fig. 01 · neuron, integrate &amp; fire</figcaption>
            <span className="absolute left-0 bottom-2 font-mono text-[11px] text-ink-faint">after Leonardo's anatomical studies</span>
          </figure>
        </section>

        {/* Experience */}
        <section id="experience" className="reveal py-14 sm:py-20 scroll-mt-14">
          <SectionHeader index={2} title="Experience" note="most recent first" />
          <ol id="experience-list" className={`timeline${hiddenExperience > 0 ? ' has-toggle' : ''}`}>
            {experience.map((item, i) => {
              const collapsed = i >= VISIBLE_EXPERIENCE && !showAllExperience;
              return (
                <li key={`${item.org}-${item.dates}`} className={`timeline-item${item.current ? ' is-current' : ''}${collapsed ? ' is-collapsed' : ''}`} inert={collapsed}>
                  <div className="timeline-body">
                    <div className="timeline-content">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-serif text-2xl leading-tight">{item.role}</h3>
                        <span className={`dates${item.current ? ' dates-current' : ''}`}>{item.dates}</span>
                      </div>
                      <p className="mt-1 text-[15px]">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="ink-link font-medium">{item.org}</a>
                        ) : (
                          <span className="font-medium">{item.org}</span>
                        )}
                        <span className="text-ink-faint"> · {item.meta}</span>
                      </p>
                      {item.description && <p className="mt-3 text-ink-soft leading-relaxed max-w-2xl">{item.description}</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {hiddenExperience > 0 && (
            <button
              type="button"
              onClick={() => setShowAllExperience((v) => !v)}
              aria-expanded={showAllExperience}
              aria-controls="experience-list"
              className="timeline-toggle"
            >
              <span className="timeline-toggle-node">
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllExperience ? 'rotate-180' : ''}`} />
              </span>
              {showAllExperience ? 'Show fewer' : `Show ${hiddenExperience} earlier`}
            </button>
          )}

          <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mt-14 mb-4">Education</h3>
          <ul className="grid sm:grid-cols-2 gap-4">
            {education.map((item) => (
              <li key={item.degree} className="plate flex items-center gap-5">
                <McGillCrest className="w-16 h-20 sm:w-20 sm:h-24 shrink-0" />
                <div>
                  <p className="font-serif text-xl leading-snug">{item.degree}</p>
                  <p className="mt-1 text-[15px] text-ink-soft">{item.school}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Research */}
        <section id="research" className="reveal py-14 sm:py-20 scroll-mt-14">
          <SectionHeader index={3} title="Research & Papers" note={`${writings.length} entries · PDF`} />
          <ul>
            {writings.map((paper, i) => (
              <li key={paper.title}>
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_6rem_1fr_auto] items-baseline gap-3 sm:gap-6 py-4 border-b border-rule/50 hover:bg-vellum/70 transition-colors -mx-3 px-3"
                >
                  <span className="font-mono text-[11px] text-sanguine">No.{pad(writings.length - i)}</span>
                  <span className="hidden sm:block font-mono text-xs text-ink-faint">{paper.date}</span>
                  <span className="font-serif text-lg sm:text-xl leading-snug group-hover:text-sanguine transition-colors">
                    {paper.title}
                    <span className="sm:hidden block font-mono text-[11px] text-ink-faint mt-1">{paper.date}</span>
                  </span>
                  <span className="font-mono text-[11px] text-ink-faint group-hover:text-ink inline-flex items-center gap-1">
                    PDF <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Projects */}
        <section id="projects" className="reveal py-14 sm:py-20 scroll-mt-14">
          <SectionHeader index={4} title="Selected Projects" />
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <div key={project.title} className="plate">
                <span className="font-mono text-[11px] text-ink-faint">PL.{pad(i + 1)}</span>
                <h3 className="font-serif text-xl mt-6 leading-snug">{project.title}</h3>
                <p className="font-mono text-xs text-ink-soft mt-2">{project.tech}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="reveal py-14 sm:py-20 scroll-mt-14">
          <SectionHeader index={5} title="Correspondence" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p className="text-ink-soft max-w-md leading-relaxed">
              Open to research collaborations and conversations about agentic AI, reinforcement learning, robotics, and computer vision.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={copyEmail} className="btn-primary">
                {copiedEmail ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {copiedEmail ? 'Copied' : 'Copy email'}
              </button>
              <a href="https://www.linkedin.com/in/eduard-anton" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com/PersoSirEduard" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 sm:px-6 py-10 border-t border-rule/60 flex flex-col sm:flex-row justify-between gap-2 font-mono text-[11px] text-ink-faint">
        <span>© 2026 Eduard Anton</span>
        <span>Last updated: October 2026</span>
      </footer>
    </div>
  );
}

export default App;
