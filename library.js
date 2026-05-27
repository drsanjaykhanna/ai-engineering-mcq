const READING_LIST = [
{
  title: "AI Engineering (O'Reilly)",
  author: "Chip Huyen, 2025",
  type: "book",
  description: "The definitive book on building applications with foundation models. Production-focused, from the author of Designing Machine Learning Systems.",
  content: `
<h2>Why This Book</h2>
<p>This is the closest thing to a textbook for AI engineering. Chip Huyen wrote the most-used ML systems book (Designing Machine Learning Systems) and this is its sequel for the LLM era. It's practical, opinionated, and covers the full stack from prompting to production. If you read one book, read this one.</p>

<h2>Chapter Guide</h2>

<h3>Chapter 1: Introduction to Building AI Applications</h3>
<p>Frames what AI engineering is and isn't. Distinguishes from ML engineering and ML research. The planning phase — understanding user needs, defining success metrics, choosing the right level of AI (does this even need an LLM?). Start reading here for the big picture.</p>

<h3>Chapter 2: Understanding Foundation Models</h3>
<p>How models are built (pre-training, RLHF), what they can and can't do, model selection criteria. The section on model evaluation is particularly good — how to benchmark and compare models for YOUR use case rather than relying on leaderboard scores.</p>

<h3>Chapter 3: Prompt Engineering</h3>
<p>Goes deeper than most treatments. Covers prompt structure, few-shot learning, chain-of-thought, output formatting, and defensive prompting. The section on systematic prompt testing (not just vibes-based tweaking) is unique and valuable.</p>

<h3>Chapter 4: RAG and Knowledge Management</h3>
<p>Full RAG pipeline from document ingestion to generation. Covers chunking strategies, embedding model selection, retrieval techniques (dense, sparse, hybrid), re-ranking, and evaluation. The discussion of RAG failure modes is especially practical.</p>

<h3>Chapter 5: Agents</h3>
<p>Agent architectures, tool use, planning, memory. Covers both simple (ReAct) and complex (multi-agent) patterns. Good treatment of when agents are appropriate vs overkill.</p>

<h3>Chapter 6: Evaluation and Monitoring</h3>
<p>How to build eval pipelines, choose metrics, do A/B testing, and monitor in production. The discussion of LLM-as-judge with its biases and mitigations is excellent.</p>

<h3>Chapter 7: Fine-tuning</h3>
<p>When to fine-tune (and when not to), LoRA/QLoRA, data preparation, training configuration, and evaluation. The decision framework for prompting vs RAG vs fine-tuning is something you'll reference repeatedly.</p>

<h3>Chapter 8: Dataset Engineering</h3>
<p>How to create high-quality training data. Synthetic data generation, data cleaning, annotation guidelines. Often the bottleneck in real projects.</p>

<h3>Chapter 9: Inference Optimization</h3>
<p>Quantization, serving (vLLM, TGI), caching, batching. The section on cost estimation is practical — how to calculate your infrastructure costs before committing.</p>

<h3>Chapter 10: AI Engineering Architecture</h3>
<p>Putting it all together. System design patterns, the orchestration layer, production architecture. Good capstone that integrates all previous chapters.</p>

<h2>How to Read It</h2>
<p>Chapters 1-5 give you the core knowledge. Read these first, in order. Chapters 6-10 go deeper on specific areas — read based on what's most relevant to your work or interview prep. The book assumes some technical background but doesn't require coding ability to understand the concepts.</p>

<p><strong>Where to get it:</strong> O'Reilly (subscription or purchase). The author's GitHub repo (<code>chiphuyen/aie-book</code>, 15.8k stars) has supplementary materials.</p>
`
},
{
  title: "AI Engineering from Scratch",
  author: "Rohit Ghumare, 2025 (GitHub)",
  type: "repo",
  description: "473 lessons across 20 phases. The most comprehensive free AI engineering curriculum — from math foundations to autonomous agents.",
  content: `
<h2>Why This Repo</h2>
<p>22k+ stars on GitHub. 473 lessons. Every lesson produces a reusable artifact. It's the most complete "learn by building" curriculum for AI engineering available for free. MIT licensed.</p>

<h2>Structure</h2>
<p>20 phases, each building on the previous. Every lesson follows the same 6-step pattern: Motto (core idea) → Problem (why this matters) → Concept (intuition + diagrams) → Build It (implement from scratch) → Use It (implement with production libraries) → Ship It (produce an artifact).</p>

<h2>Phase Guide (What to Prioritise)</h2>

<h3>Phases 0-6: Foundations (Skip or Skim)</h3>
<p>Setup, math, ML fundamentals, deep learning, computer vision, NLP foundations, speech/audio. If you're not coding, skim the concept sections for background understanding. Don't spend time on the code implementations.</p>

<h3>Phase 7: Transformers Deep Dive (14 lessons) — READ</h3>
<p>Self-attention from scratch, multi-head attention, positional encoding, layer normalization, the full transformer stack. This is the architectural foundation everything else builds on. Read the concept sections carefully.</p>

<h3>Phase 8: Generative AI (14 lessons) — READ</h3>
<p>VAEs, GANs, diffusion models, autoregressive generation. Gives you the conceptual grounding for how generation works across modalities.</p>

<h3>Phase 10: LLMs from Scratch (22 lessons) — ESSENTIAL</h3>
<p>Tokenizers (BPE, SentencePiece), pre-training objectives, scaling laws, the training pipeline, decoding strategies, the model zoo. This is where you understand what LLMs actually ARE at a deep level.</p>

<h3>Phase 11: LLM Engineering (17 lessons) — ESSENTIAL</h3>
<p>Prompt engineering, few-shot/CoT, structured outputs, embeddings, context engineering, RAG, advanced RAG, fine-tuning with LoRA, function calling, evaluation, caching/cost, guardrails, MCP, production apps. This maps directly to what you'll do as an AI engineer.</p>

<h3>Phase 13: Tools and Protocols (23 lessons) — HIGH VALUE</h3>
<p>MCP servers, tool registries, A2A protocol, SDK patterns. The emerging infrastructure layer that connects models to the real world.</p>

<h3>Phase 14: Agent Engineering (42 lessons) — ESSENTIAL</h3>
<p>The agent loop, ReAct, plan-and-execute, reflexion, tree of thoughts, tool use, memory systems (MemGPT, Mem0), planning, every major agent framework (LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Claude Agent SDK), agent evaluation, failure modes, orchestration patterns. This is the most comprehensive agent engineering resource available anywhere.</p>

<h3>Phases 15-16: Autonomous Systems & Multi-Agent (47 lessons) — READ</h3>
<p>Computer use agents, voice agents, multi-agent debate, swarm intelligence. The frontier of agent engineering.</p>

<h3>Phase 17: Infrastructure & Production (28 lessons) — READ</h3>
<p>Deployment, monitoring, scaling, cost optimization. Production engineering for AI systems.</p>

<h3>Phase 18: Ethics, Safety & Alignment (30 lessons) — READ</h3>
<p>Safety evaluation, red teaming, constitutional AI, regulatory compliance, responsible deployment.</p>

<h2>How to Use It (Non-Coder Path)</h2>
<p>For each recommended phase: read the <code>docs/en.md</code> file in each lesson (that's the narrative explanation). Skip the code files unless you want to understand implementation details. Read the <code>outputs/</code> directory — these contain the artifacts (prompts, skills) that distill the lesson into practical takeaways.</p>

<p><strong>Where to find it:</strong> <code>github.com/rohitg00/ai-engineering-from-scratch</code></p>
`
},
{
  title: "Mastering LLM Engineering",
  author: "Ed Donner, 2025 (GitHub + Video Course)",
  type: "course",
  description: "8-week hands-on course with Jupyter notebooks. Project-based learning from local models to autonomous agents.",
  content: `
<h2>Why This Course</h2>
<p>6.2k stars on GitHub. 8 weeks of progressive, project-based learning. Each week has 5 daily notebooks that build on each other. Refreshed December 2025 with latest models and techniques. Budget-friendly (a few dollars total in API costs).</p>

<h2>Week-by-Week Guide</h2>

<h3>Week 1: Getting Started</h3>
<p>Setting up the environment. First API calls. Running local models with Ollama. Understanding the difference between API-based and self-hosted models. Good foundational week even for non-coders — the notebooks are well-commented and self-explanatory.</p>

<h3>Week 2: Prompt Engineering in Practice</h3>
<p>System prompts, few-shot learning, output structuring, handling edge cases. Practical prompt engineering with real examples, not just theory.</p>

<h3>Week 3: RAG from Scratch</h3>
<p>Building a complete RAG pipeline: document loading, chunking, embedding, vector storage, retrieval, generation. Google Colab notebooks (free GPU access). See RAG go from concept to working system.</p>

<h3>Week 4: Advanced RAG</h3>
<p>Re-ranking, hybrid search, evaluation metrics, optimizing retrieval quality. The practical side of making RAG actually work well.</p>

<h3>Week 5: Fine-tuning</h3>
<p>LoRA fine-tuning on real tasks. Data preparation, training, evaluation. Understanding when fine-tuning improves things and when it doesn't.</p>

<h3>Week 6: Agents</h3>
<p>Building agents with tool use, multi-step reasoning, and error handling. From simple ReAct to more complex agent patterns.</p>

<h3>Week 7: Multi-Agent Systems</h3>
<p>Teams of agents collaborating. Role-based workflows, orchestration, evaluation of multi-agent output quality.</p>

<h3>Week 8: Autonomous AI</h3>
<p>Capstone project: building an autonomous agent system that handles complex, multi-step tasks end-to-end. Integration of everything from the previous 7 weeks.</p>

<h2>How to Use It</h2>
<p>Even if you're not coding along, the notebooks are extremely readable — they explain every concept before implementing it. Read through them like annotated tutorials. The progression from week 1 (first API call) to week 8 (autonomous agents) gives you a clear picture of how complexity builds.</p>

<p><strong>Where to find it:</strong> <code>github.com/ed-donner/llm_engineering</code></p>
`
},
{
  title: "Prompt Engineering Guide",
  author: "DAIR.AI, 2023-ongoing",
  type: "repo",
  description: "75k stars. The definitive open reference for prompt engineering techniques — from basics to cutting-edge research.",
  content: `
<h2>Why This Resource</h2>
<p>The most comprehensive prompt engineering reference available. 75k GitHub stars. Continuously updated with new techniques. Covers everything from zero-shot basics to the latest reasoning frameworks. Translated into 13+ languages.</p>

<h2>Key Sections</h2>

<h3>Introduction to Prompting</h3>
<p>Elements of a prompt, general tips, prompt design principles. Good starting point if prompt engineering is new to you.</p>

<h3>Prompting Techniques</h3>
<p>The core reference section. Covers every major technique with examples:</p>
<ul>
<li>Zero-shot, few-shot prompting</li>
<li>Chain-of-Thought (CoT) and its variants</li>
<li>Self-consistency</li>
<li>Tree of Thoughts</li>
<li>ReAct (Reasoning + Acting)</li>
<li>Retrieval-Augmented Generation</li>
<li>Directional Stimulus Prompting</li>
<li>Active Prompt, Multimodal CoT</li>
</ul>

<h3>Applications</h3>
<p>Prompt engineering for specific use cases: code generation, data analysis, classification, creative writing, mathematical reasoning. Practical examples you can adapt.</p>

<h3>Risks and Misuses</h3>
<p>Prompt injection, jailbreaking, adversarial prompting. Understanding the attack surface of prompt-based systems.</p>

<h3>Research Papers</h3>
<p>Curated list of key papers behind each technique. Good for deepening understanding of WHY techniques work, not just HOW.</p>

<h2>How to Use It</h2>
<p>Use it as a reference, not a book to read cover-to-cover. When you need a specific technique (e.g., "how does self-consistency work?"), look it up here. The examples are directly usable in your own prompts.</p>

<p><strong>Where to find it:</strong> <code>github.com/dair-ai/Prompt-Engineering-Guide</code> or <code>promptingguide.ai</code></p>
`
},
{
  title: "LLM Course",
  author: "Maxime Labonne, 2024-ongoing",
  type: "repo",
  description: "79.7k stars. Complete LLM curriculum covering the Scientist track (building models) and the Engineer track (building applications).",
  content: `
<h2>Why This Resource</h2>
<p>The most popular LLM learning resource on GitHub. Well-organised into two tracks: the LLM Scientist (understanding and building models) and the LLM Engineer (building applications with models). Extensive curated links to the best resources for each topic.</p>

<h2>The Two Tracks</h2>

<h3>LLM Scientist Track (Understanding Models)</h3>
<p>For your purposes, skim this track for conceptual understanding:</p>
<ul>
<li><strong>Mathematics for ML:</strong> Linear algebra, calculus, probability — skim unless you want depth</li>
<li><strong>Neural Networks:</strong> Fundamentals, backpropagation — good for intuition</li>
<li><strong>NLP Fundamentals:</strong> Tokenization, embeddings, attention — READ these sections</li>
<li><strong>Transformer Architecture:</strong> The full architecture explained — READ carefully</li>
<li><strong>Pre-training:</strong> How models are trained, data pipelines — worth understanding</li>
<li><strong>Post-training (SFT, RLHF, DPO):</strong> How base models become assistants — READ</li>
</ul>

<h3>LLM Engineer Track (Building Applications) — YOUR TRACK</h3>
<p>Read this entire track:</p>
<ul>
<li><strong>Running LLMs:</strong> APIs, local deployment, serving frameworks</li>
<li><strong>Building a Vector Store:</strong> Embeddings, chunking, vector databases</li>
<li><strong>RAG Pipeline:</strong> End-to-end retrieval-augmented generation</li>
<li><strong>Advanced RAG:</strong> Query rewriting, re-ranking, evaluation</li>
<li><strong>Inference Optimization:</strong> Quantization, Flash Attention, vLLM</li>
<li><strong>Deploying LLMs:</strong> Production serving, monitoring, cost</li>
<li><strong>Securing LLMs:</strong> Prompt injection, guardrails, safety</li>
</ul>

<h2>How to Use It</h2>
<p>This is a curated roadmap with links to the best explanations of each topic. Use it as a study guide: work through the Engineer track topic by topic, following the linked resources. Each section has articles, notebooks, and videos selected for quality.</p>

<p><strong>Where to find it:</strong> <code>github.com/mlabonne/llm-course</code></p>
`
},
{
  title: "RAG Techniques",
  author: "Nir Diamant, 2024-ongoing",
  type: "repo",
  description: "27.6k stars. 42+ RAG techniques explained and implemented — from basic to cutting-edge.",
  content: `
<h2>Why This Resource</h2>
<p>If RAG is the most important pattern in AI engineering, this is the most comprehensive guide to doing it well. 42+ techniques, each with explanation, implementation, and when to use it. Goes far beyond basic RAG into techniques most engineers don't know exist.</p>

<h2>Key Technique Categories</h2>

<h3>Foundational</h3>
<p>Simple RAG, semantic chunking, context enrichment, document augmentation. Start here to understand the baseline before optimising.</p>

<h3>Query Enhancement</h3>
<p>Query rewriting, expansion, decomposition, HyDE (hypothetical document embedding). Techniques for when the user's query doesn't match document language.</p>

<h3>Advanced Retrieval</h3>
<p>Fusion retrieval (combining multiple retrieval methods), intelligent reranking, multi-modal retrieval, hierarchical indexing. The techniques that push retrieval quality from "good" to "great."</p>

<h3>Context and Memory</h3>
<p>Contextual compression, memory-augmented RAG, temporal awareness. How to handle conversation context and evolving knowledge.</p>

<h3>Self-Correcting</h3>
<p>Self-RAG, Corrective RAG (CRAG), Adaptive RAG. Systems that evaluate their own retrieval quality and self-correct when results are poor.</p>

<h3>Graph-Based</h3>
<p>Graph RAG, knowledge graph integration, entity-relationship retrieval. When flat vector search can't capture the relationships between concepts.</p>

<h2>How to Use It</h2>
<p>Start with the foundational techniques (understand basic RAG thoroughly). Then study query enhancement and reranking (the highest-impact improvements). Move to self-correcting and graph-based for advanced scenarios. Each technique page explains the problem it solves, when to use it, and when it's overkill.</p>

<p><strong>Where to find it:</strong> <code>github.com/NirDiamant/RAG_Techniques</code></p>
`
},
{
  title: "GenAI Agents",
  author: "Nir Diamant, 2024-ongoing",
  type: "repo",
  description: "22.2k stars. 50+ agent architecture patterns explained and implemented — the comprehensive agent engineering reference.",
  content: `
<h2>Why This Resource</h2>
<p>The companion to RAG Techniques but for agents. 50+ agent patterns, from simple ReAct to complex multi-agent systems. Each pattern is explained with the problem it solves, architecture diagram, and implementation.</p>

<h2>Key Pattern Categories</h2>

<h3>Core Patterns</h3>
<p>ReAct, plan-and-execute, self-refine, reflection. The foundational agent architectures everything else builds on.</p>

<h3>Memory & Context</h3>
<p>Short-term memory, long-term memory (vector store), episodic memory, memory management strategies. How agents maintain context across interactions.</p>

<h3>Planning</h3>
<p>Hierarchical planning, dynamic re-planning, task decomposition. How agents break complex tasks into manageable steps.</p>

<h3>Multi-Agent</h3>
<p>Debate, collaboration, delegation, role-based teams, swarm patterns. When and how to use multiple agents together.</p>

<h3>Tool Use</h3>
<p>Function calling patterns, tool selection, tool chaining, error recovery. The practical mechanics of agents interacting with external systems.</p>

<h2>How to Use It</h2>
<p>Read the core patterns first to build your mental model of how agents work. Then explore specific categories based on what you're building or studying. The explanations are clear enough to understand without running the code.</p>

<p><strong>Where to find it:</strong> <code>github.com/NirDiamant/GenAI_Agents</code></p>
`
},
{
  title: "Anthropic Courses",
  author: "Anthropic, 2024-ongoing",
  type: "course",
  description: "21.6k stars. Official courses on Claude API, prompt engineering, tool use, and agent development — from the makers of Claude.",
  content: `
<h2>Why This Resource</h2>
<p>Official courses from Anthropic — the company that builds Claude. These are authoritative, well-structured, and directly applicable if you're using Claude (or understanding how one of the leading AI providers thinks about their technology).</p>

<h2>Available Courses</h2>

<h3>Anthropic API Fundamentals</h3>
<p>Getting started with the Claude API. Messages, system prompts, model parameters, streaming. The basics for anyone using Claude in applications.</p>

<h3>Prompt Engineering Interactive Tutorial</h3>
<p>9 lessons covering: basic prompting, clarity and specificity, role prompting, output formatting, thinking step-by-step, examples (few-shot), precognition, chaining prompts, and advanced techniques. Interactive — try techniques in real-time.</p>

<h3>Real-World Prompting</h3>
<p>Moving beyond tutorial examples to production prompt engineering. Handling edge cases, building robust prompts, testing systematically.</p>

<h3>Tool Use</h3>
<p>Function calling with Claude. Defining tools, handling tool calls, multi-tool interactions. The practical mechanics of giving Claude access to external systems.</p>

<h3>Building with the Agent SDK</h3>
<p>Anthropic's approach to building agents. The Claude Agent SDK, agent loop patterns, tool orchestration, evaluation.</p>

<h2>How to Use It</h2>
<p>Start with Prompt Engineering Interactive Tutorial — it's the most universally useful. Then Tool Use if you're building applications. The Agent SDK course is relevant if you're specifically building with Claude's agent framework.</p>

<p><strong>Where to find it:</strong> <code>github.com/anthropics/courses</code></p>
`
},
{
  title: "Designing Machine Learning Systems",
  author: "Chip Huyen, O'Reilly 2022",
  type: "book",
  description: "The predecessor to AI Engineering — covers the MLOps, data engineering, and systems thinking that underlies production AI. Essential background reading.",
  content: `
<h2>Why This Book</h2>
<p>While AI Engineering (2025) covers the LLM-specific application layer, this book covers the SYSTEMS layer that everything runs on: data pipelines, feature engineering, model deployment, monitoring, continual learning. Understanding this layer gives you depth that pure LLM-focused learning misses.</p>

<h2>What's Most Relevant for AI Engineers</h2>

<h3>Chapter 2: Introduction to ML Systems Design</h3>
<p>Framing ML as a systems problem, not just a model problem. Business requirements, failure modes, iterative development. This mindset applies directly to LLM applications.</p>

<h3>Chapter 4: Training Data</h3>
<p>Data collection, labeling, class imbalance, data augmentation. Directly relevant when creating fine-tuning datasets or evaluation test sets for LLM applications.</p>

<h3>Chapter 6: Model Development & Offline Evaluation</h3>
<p>Model selection, evaluation methodology, experiment tracking. The disciplined approach to evaluation that most LLM teams lack.</p>

<h3>Chapter 7: Model Deployment and Prediction Service</h3>
<p>Deploying models to production, batch vs real-time, edge deployment. The serving patterns directly apply to LLM deployment.</p>

<h3>Chapter 8: Data Distribution Shifts and Monitoring</h3>
<p>What happens when production data differs from training data. Monitoring strategies. Critical for understanding LLM performance degradation over time.</p>

<h3>Chapter 9: Continual Learning and Test in Production</h3>
<p>A/B testing, bandit algorithms, continual learning. The production experimentation framework that applies to prompt/model testing.</p>

<h2>How to Read It</h2>
<p>Read chapters 2, 6, 7, 8, and 9 for the systems thinking that applies to LLM applications. The other chapters cover traditional ML specifics (feature engineering, classical models) that are less directly relevant but provide useful background.</p>

<p><strong>Where to get it:</strong> O'Reilly (subscription or purchase).</p>
`
},
{
  title: "Your Notes & Custom Sources",
  author: "You",
  type: "book",
  description: "Add your own book summaries, chapter notes, and resources here. Edit library.js to grow your personal reading list over time.",
  content: `
<h2>How to Add Your Own Sources</h2>

<p>This reading list lives in <code>library.js</code> in your GitHub repo. To add a new source:</p>

<ol>
<li>Open <code>library.js</code> in the repo</li>
<li>Add a new entry to the <code>READING_LIST</code> array following the existing format</li>
<li>Commit and push — the app updates automatically</li>
</ol>

<p>Each entry has:</p>
<ul>
<li><strong>title:</strong> Name of the book/resource</li>
<li><strong>author:</strong> Author and year</li>
<li><strong>type:</strong> "book", "repo", or "course"</li>
<li><strong>description:</strong> One-line summary shown in the list</li>
<li><strong>content:</strong> HTML content — your chapter summaries, key takeaways, notes</li>
</ul>

<h2>Suggested Additions</h2>

<p>Books and resources worth adding as you encounter them:</p>

<ul>
<li><strong>Natural Language Processing with Transformers</strong> (O'Reilly, Lewis Tunstall et al.) — HuggingFace team's practical NLP guide</li>
<li><strong>Build a Large Language Model (From Scratch)</strong> (Sebastian Raschka) — understanding LLMs by building one</li>
<li><strong>Generative AI on AWS</strong> (O'Reilly) — if you're deploying on AWS</li>
<li><strong>Clinical Natural Language Processing</strong> (Springer) — for health AI depth</li>
<li><strong>The Alignment Problem</strong> (Brian Christian) — the philosophy and science of AI alignment</li>
<li><strong>AI Snake Oil</strong> (Arvind Narayanan & Sayash Kapoor) — critical thinking about AI claims</li>
</ul>

<p>Add chapter notes as you read. Over time, this becomes your personal knowledge base — searchable, offline, always in your pocket.</p>
`
}
];
