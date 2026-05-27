const LEARNING_MODULES = [
{
  title: "The Complete Picture: What AI Engineering Actually Is",
  description: "Start here. Understand the landscape, the layers, and where you fit in — before touching any technical detail.",
  level: "beginner",
  readTime: "8 min",
  linkedTopics: ["AI Engineering Architecture", "LLM Fundamentals"],
  content: `
<h2>You're Not Training Models. You're Building Products.</h2>

<p>Here's the most important thing to understand about AI engineering: <strong>you are not a machine learning researcher</strong>. You are not pre-training foundation models on thousands of GPUs. You are not publishing papers about novel attention mechanisms. Those people exist, but that's not the job you're interviewing for.</p>

<p>AI engineering is the discipline of taking powerful pre-trained models — GPT-4, Claude, Llama, Mistral — and building products with them. Think of it like the difference between someone who designs car engines at Toyota and someone who designs a ride-sharing platform. Both involve cars. But the skills, decisions, and challenges are completely different.</p>

<h2>The Four Layers</h2>

<p>Everything in AI engineering maps to one of four layers. Understanding these layers — and which one you operate in — is the skeleton key to the entire field.</p>

<h3>Layer 1: Foundation Models (You don't build this)</h3>

<p>A small number of companies (OpenAI, Anthropic, Google, Meta, Mistral) spend $10-100 million training massive neural networks on trillions of tokens of text. The result is a "base model" — a system that has learned the statistical patterns of human language so well that it can predict what comes next in any text sequence.</p>

<p>You need to understand this layer — how transformers work, what attention does, why scaling laws matter — because these fundamentals inform every decision you make at higher layers. But you won't be doing this work yourself.</p>

<div class="analogy"><strong>Medical analogy:</strong> You didn't design the MRI machine. But you need to understand how MRI physics works (T1/T2 weighting, contrast enhancement, artifact types) to interpret the images and make clinical decisions. Same relationship here.</div>

<h3>Layer 2: Alignment & Fine-tuning (Sometimes you do this)</h3>

<p>The base model can predict text, but it's not an assistant. It doesn't follow instructions — it just continues text patterns. Alignment (RLHF, DPO) transforms this text predictor into something that tries to be helpful, honest, and harmless. Fine-tuning further specializes it for your domain.</p>

<p>Most AI engineers don't do full RLHF (that's the model provider's job). But you might fine-tune with LoRA for a specific use case — training a model to match your company's tone, follow a specific output format, or develop domain expertise that prompting can't achieve.</p>

<h3>Layer 3: Application Architecture (This is your core work)</h3>

<p>This is where 90% of AI engineering happens. You're making architectural decisions about how to build a system around the model:</p>

<ul>
<li><strong>How does the model get knowledge?</strong> → RAG (Retrieval-Augmented Generation)</li>
<li><strong>How does the model take actions?</strong> → Agents, function calling, tool use</li>
<li><strong>How do you structure the conversation?</strong> → Prompt engineering, system prompts, context management</li>
<li><strong>How do you know if it's working?</strong> → Evaluation, benchmarks, user feedback</li>
<li><strong>How do you connect to external systems?</strong> → MCP, A2A, API integrations</li>
</ul>

<p>Every AI engineering interview will test your ability to reason about these decisions. "How would you build X?" is the canonical question, and the answer always involves choosing the right combination of these components.</p>

<h3>Layer 4: Production & Operations (The last mile)</h3>

<p>Getting a demo working in a Jupyter notebook is easy. Getting it to work reliably for 100,000 users is hard. This layer covers serving (vLLM, TGI), monitoring (Langfuse), cost optimization (caching, model routing), security (prompt injection defense), and compliance (HIPAA, EU AI Act).</p>

<p>This is what separates a prototype from a product. Interviewers love asking about this because it reveals whether you've actually shipped anything.</p>

<h2>The Decision Framework You'll Use Every Day</h2>

<p>When someone says "build me an AI feature that does X," your brain should immediately run through this decision tree:</p>

<ol>
<li><strong>Can prompting alone solve this?</strong> If yes, start there. It's the cheapest, fastest, most flexible approach. Try zero-shot → few-shot → chain-of-thought.</li>
<li><strong>Does the model need knowledge it doesn't have?</strong> If yes, add RAG. Index your documents, retrieve relevant chunks, include them in the prompt.</li>
<li><strong>Does the model need to take actions or make decisions based on intermediate results?</strong> If yes, build an agent with tool access.</li>
<li><strong>Does the model need consistent behavior that prompting can't achieve?</strong> Only then consider fine-tuning. It's the most expensive, least flexible option and should always be the last resort.</li>
</ol>

<div class="analogy"><strong>Medical analogy:</strong> This is like the diagnostic pathway. You start with the least invasive investigation (history and examination = prompting), escalate to blood tests and imaging (RAG = giving the model data), then procedures (agents = letting it take actions), and only go to surgery (fine-tuning) when nothing else works. Same principle: start simple, escalate with justification.</div>

<h2>What Makes This Field Move So Fast</h2>

<p>AI engineering changes faster than almost any other software discipline. Models that were state-of-the-art six months ago are now outdated. New techniques (MCP, A2A, structured output, agentic workflows) emerge and become standard within weeks. This is both the challenge and the opportunity.</p>

<p>The good news: the fundamentals are stable. Transformers, attention, tokenization, embeddings, retrieval — these concepts haven't changed since 2017. What changes is the ecosystem built on top of them. If you understand the foundations deeply, you can absorb new developments quickly because they're variations on themes you already know.</p>

<blockquote>The modules that follow will build your understanding progressively: transformers → LLMs → prompt engineering → RAG → agents → production. Each module assumes you've read the previous ones. Take them in order.</blockquote>
`
},
{
  title: "Transformers: The Architecture Behind Everything",
  description: "How transformers work from first principles — attention, feed-forward networks, and why this architecture conquered AI.",
  level: "beginner",
  readTime: "12 min",
  linkedTopics: ["LLM Fundamentals"],
  content: `
<h2>One Architecture to Rule Them All</h2>

<p>Every major AI model you've heard of — GPT-4, Claude, Llama, Gemini, Mistral, Stable Diffusion, Whisper, DALL-E — is built on the <strong>transformer architecture</strong>. Published in 2017 in a paper titled "Attention Is All You Need," the transformer replaced all previous sequence processing architectures (RNNs, LSTMs) and became the universal foundation of modern AI.</p>

<p>Understanding transformers isn't just academic — it directly informs practical decisions you'll make as an AI engineer. Why does context length matter? Why are long prompts expensive? Why do models hallucinate? Why does quantization work? The answers all trace back to how transformers process information.</p>

<h2>The Key Innovation: Self-Attention</h2>

<p>Before transformers, language models used recurrent neural networks (RNNs) that processed tokens one at a time, left to right, like reading a book one word at a time while trying to remember everything you've read. The problem: by the time you reach word 500, you've mostly forgotten word 10. Information degrades over distance.</p>

<p>Self-attention solved this. Instead of processing tokens sequentially, attention lets <strong>every token look at every other token simultaneously</strong>. When the model processes the word "it" in "The cat sat on the mat because it was tired," attention lets "it" directly check its relationship with "cat," "mat," "sat," and every other word — in a single step, regardless of distance.</p>

<div class="analogy"><strong>Medical analogy:</strong> Think of an RNN as a registrar doing a ward round, seeing patients one by one and trying to remember each case for the handover. By patient 30, patient 1 is hazy. Self-attention is like having every patient visible on a dashboard simultaneously — you can see connections between patient 5's drug allergy and patient 22's similar presentation instantly.</div>

<h3>How Attention Actually Works: Q, K, V</h3>

<p>Each token gets transformed into three vectors:</p>

<ul>
<li><strong>Query (Q):</strong> "What am I looking for?" — what information does this token need?</li>
<li><strong>Key (K):</strong> "What do I contain?" — what information does this token advertise?</li>
<li><strong>Value (V):</strong> "What information do I give back?" — the actual content passed when attended to.</li>
</ul>

<p>The attention score between two tokens is the dot product of one token's Query with another token's Key. High dot product = these tokens are relevant to each other. This score determines how much of the Value vector gets passed forward.</p>

<p>The formula: <strong>Attention(Q,K,V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>) × V</strong></p>

<p>The division by √d<sub>k</sub> (square root of the key dimension) prevents the dot products from getting too large. Without this scaling, the softmax would produce near-one-hot distributions — putting all attention on one token and ignoring everything else. The scaling keeps the distribution soft and distributed.</p>

<h3>Multi-Head Attention: Multiple Perspectives</h3>

<p>A single attention operation captures one type of relationship. But language has multiple simultaneous relationship types: syntactic (subject-verb agreement), semantic (topical similarity), positional (nearby words), and referential (pronouns to their antecedents).</p>

<p>Multi-head attention runs several attention operations in parallel — each with its own learned Q, K, V projections. With 12 heads, you get 12 different "perspectives" on the same input. Research has shown that different heads actually specialize: some track syntax, others semantics, others learn to copy patterns (called "induction heads" — believed to be a core mechanism of in-context learning).</p>

<p>The total computation cost is roughly the same as single-head attention — you split the model dimension across heads rather than multiplying it. 12 heads × 64 dimensions = 768 total, same as 1 head × 768 dimensions.</p>

<h2>Beyond Attention: The Full Transformer Layer</h2>

<p>Attention is what transformers are famous for, but each transformer layer actually does three things:</p>

<ol>
<li><strong>Multi-head self-attention:</strong> Tokens communicate with each other. This is the "routing" step — deciding which tokens should inform which other tokens.</li>
<li><strong>Feed-forward network (FFN):</strong> Two large linear transformations with a nonlinearity (GeLU or SiLU) between them. This is where the model's "knowledge" lives — the FFN stores learned facts, patterns, and transformations. FFN parameters actually outnumber attention parameters (~2:1). Think of attention as routing information and FFN as processing it.</li>
<li><strong>Residual connections + normalization:</strong> A skip connection adds the input directly to the output (so information can bypass the layer if needed), and layer normalization stabilizes the values between layers.</li>
</ol>

<p>A large model stacks 80+ of these layers. Each layer refines the representation further — early layers capture low-level patterns (syntax, common phrases), later layers capture high-level concepts (reasoning, world knowledge, task understanding).</p>

<h2>The O(n²) Problem: Why Context Length Matters</h2>

<p>Self-attention computes a score between every pair of tokens. With n tokens, that's n² scores. Double the context length and you quadruple the compute and memory. This is why:</p>

<ul>
<li>Early GPT models were limited to 2048 tokens</li>
<li>Long-context models (128k, 1M tokens) require architectural innovations (Flash Attention, sliding window attention)</li>
<li>You pay more for longer prompts (more computation needed)</li>
<li>The "lost in the middle" phenomenon exists — attention patterns degrade in the middle of very long contexts</li>
</ul>

<p>Every practical decision about prompt length, context management, and chunking strategy traces back to this quadratic relationship.</p>

<h2>Decoder-Only: Why Modern LLMs Look the Way They Do</h2>

<p>The original transformer had both an encoder and a decoder. But modern LLMs (GPT, Llama, Claude, Mistral) are <strong>decoder-only</strong> — they process tokens left-to-right with a causal mask (each token can only attend to previous tokens, never future ones).</p>

<p>Why did decoder-only win? Three reasons:</p>
<ol>
<li><strong>Simplicity:</strong> One architecture, one training objective. Easier to scale.</li>
<li><strong>Unified capability:</strong> The same architecture handles both understanding AND generation. Encoder-only (BERT) can understand but can't generate. Decoder-only does both.</li>
<li><strong>Scaling predictability:</strong> Next-token prediction loss decreases predictably with more compute (scaling laws). This makes it possible to forecast capability gains before spending hundreds of millions on training.</li>
</ol>

<blockquote>Next module: "From Text Predictor to Assistant" — how RLHF and alignment turn a raw transformer into something that follows instructions and tries to be helpful.</blockquote>
`
},
{
  title: "From Text Predictor to Assistant: Alignment & Fine-tuning",
  description: "How raw language models become helpful assistants through RLHF, DPO, and fine-tuning — and when you'd do it yourself.",
  level: "intermediate",
  readTime: "10 min",
  linkedTopics: ["Fine-tuning & Alignment"],
  content: `
<h2>The Raw Model Doesn't Want to Help You</h2>

<p>A freshly pre-trained language model is a remarkable machine — it has absorbed the statistical patterns of trillions of tokens of human text. It knows grammar, facts, reasoning patterns, code syntax, and much more. But it has one critical limitation: <strong>it doesn't follow instructions</strong>.</p>

<p>Ask a base model "What is the capital of France?" and it might respond with "What is the capital of Germany? What is the capital of Italy?" — because it learned from quiz-format text and sees your question as the start of a quiz, not a request for an answer. It's a text PREDICTOR, not a text HELPER.</p>

<p>The transformation from predictor to assistant happens in three stages, each building on the last. Understanding these stages is essential because they explain both the model's strengths and its failure modes.</p>

<h2>Stage 1: Supervised Fine-Tuning (SFT)</h2>

<p>The first step is conceptually simple: show the model examples of "good assistant behavior." Thousands of (instruction, helpful response) pairs like:</p>

<blockquote>User: "Explain photosynthesis in simple terms."<br>
Assistant: "Photosynthesis is how plants make food using sunlight. They take in carbon dioxide from the air and water from the soil, and using sunlight as energy, convert these into glucose (sugar) and oxygen..."</blockquote>

<p>The model is fine-tuned on these examples, learning the FORMAT and STYLE of being an assistant — that questions expect answers, that instructions expect execution, that it should be polite and comprehensive.</p>

<p>A critical insight from research: <strong>quality matters far more than quantity</strong>. One thousand carefully curated, high-quality examples can outperform one hundred thousand mediocre ones. The model already has the knowledge from pre-training — SFT just teaches it how to express that knowledge helpfully.</p>

<h2>Stage 2: Reward Modeling & RLHF</h2>

<p>SFT teaches format but not preference. The model can now answer questions, but it doesn't know WHICH answer is BETTER. Two technically correct responses to "Should I take aspirin?" might differ enormously in helpfulness — one might mention important contraindications, the other might not.</p>

<p>This is where <strong>RLHF (Reinforcement Learning from Human Feedback)</strong> comes in. It's a three-step process:</p>

<ol>
<li><strong>Collect comparisons:</strong> Show human raters two model outputs for the same prompt. They pick which is better. Thousands of these comparisons create a preference dataset.</li>
<li><strong>Train a reward model:</strong> A separate neural network learns to predict which output humans would prefer. It assigns a scalar score to any output — essentially learning "what does good look like?"</li>
<li><strong>Optimize with PPO:</strong> The language model generates outputs, the reward model scores them, and the model is updated to produce higher-scoring outputs. A KL divergence penalty prevents it from straying too far from the SFT model (to avoid "reward hacking" — finding degenerate outputs that score highly but aren't actually good).</li>
</ol>

<div class="analogy"><strong>Medical analogy:</strong> SFT is like teaching a medical student the format of a consultation (history, examination, investigation, management plan). RLHF is like the consultant's feedback: "Yes, you covered the right points, but you should have asked about drug allergies before recommending treatment, and your explanation to the patient was too technical." The reward model captures the consultant's judgment about what makes a GOOD consultation.</div>

<h2>DPO: The Simpler Alternative</h2>

<p><strong>Direct Preference Optimization (DPO)</strong> achieves the same goal as RLHF but skips the reward model entirely. It's a mathematical trick: the RLHF objective (maximize reward while staying close to the reference model) turns out to have a closed-form solution. DPO exploits this to turn the whole thing into a supervised learning problem.</p>

<p>Given a preferred output (y+) and a dispreferred output (y-), DPO directly increases the probability of y+ and decreases y- — relative to a frozen reference model. No reward model, no RL loop, no PPO instability. Just standard training on preference pairs.</p>

<p><strong>DPO vs RLHF tradeoffs:</strong> DPO is simpler, more stable, cheaper, and easier to implement. RLHF can potentially discover better outputs through online exploration (generating new responses and scoring them) — DPO only learns from existing preference data. For most practical purposes, DPO is sufficient and preferred.</p>

<h2>When Should YOU Fine-tune?</h2>

<p>This is the question that separates junior from senior AI engineers. The answer is: <strong>almost never, and only after exhausting simpler alternatives.</strong></p>

<p>The progression should always be:</p>
<ol>
<li><strong>Prompting</strong> (zero-shot → few-shot → chain-of-thought) — free, instant, infinitely flexible</li>
<li><strong>RAG</strong> — if the model needs external knowledge</li>
<li><strong>Fine-tuning with LoRA</strong> — if prompting can't achieve the consistency or domain behavior you need, and you have 1000+ quality examples</li>
</ol>

<p>Fine-tuning is expensive, reduces flexibility (you're locked into the fine-tuned behavior), and risks <strong>catastrophic forgetting</strong> — where improving one capability degrades others. LoRA mitigates this by freezing the base model and training only tiny adapter matrices, but it's still a significant engineering commitment.</p>

<p>The one clear win for fine-tuning: <strong>cost reduction at scale</strong>. If you have a working GPT-4 prompt, you can distill that behavior into a smaller model (Llama-8B, Mistral-7B) by fine-tuning it on GPT-4's outputs. The small fine-tuned model runs 10-20× cheaper per query. At 100k requests/day, this saves serious money.</p>

<blockquote>Next module: "RAG — Giving Models Knowledge They Don't Have" — the most important architectural pattern in AI engineering.</blockquote>
`
},
{
  title: "RAG: Giving Models Knowledge They Don't Have",
  description: "The most important pattern in AI engineering. How to build systems that answer questions from your documents — reliably.",
  level: "intermediate",
  readTime: "12 min",
  linkedTopics: ["RAG Systems", "Embeddings & Vector Search"],
  content: `
<h2>The Fundamental Problem</h2>

<p>LLMs know a lot — but they don't know YOUR stuff. Ask GPT-4 about your company's internal policies, last quarter's financial results, or a patient's medical history, and it will either hallucinate confidently or admit ignorance. Its knowledge is frozen at training time and doesn't include private or recent information.</p>

<p><strong>Retrieval-Augmented Generation (RAG)</strong> solves this by retrieving relevant documents at query time and including them in the prompt. Instead of relying on the model's memory, you give it the specific information it needs to answer each question. The model becomes a reasoning engine over YOUR data.</p>

<div class="analogy"><strong>Medical analogy:</strong> A consultant doesn't memorize every patient's history. They pull the notes before the ward round. RAG is the equivalent: the model "pulls the notes" (retrieves relevant documents) before answering. The intelligence is in reasoning over the notes, not in memorizing them.</div>

<h2>The Three Phases</h2>

<h3>Phase 1: Indexing (done once, updated periodically)</h3>

<p>Take your documents and prepare them for fast retrieval:</p>

<ol>
<li><strong>Load:</strong> Ingest documents from their sources — PDFs, web pages, databases, wikis, Confluence, etc.</li>
<li><strong>Chunk:</strong> Split documents into smaller pieces (typically 256-512 tokens). Why? Because embedding models produce one vector per input — and a single vector for a 50-page document would be too diffuse to match specific queries. Each chunk should cover one coherent concept.</li>
<li><strong>Embed:</strong> Run each chunk through an embedding model (like text-embedding-3 or a sentence-transformer) to produce a dense vector that captures its semantic meaning.</li>
<li><strong>Store:</strong> Save the vectors in a vector database (FAISS, Pinecone, pgvector, Chroma) along with the original text and metadata (source, date, section).</li>
</ol>

<h3>Phase 2: Retrieval (at query time)</h3>

<p>When a user asks a question:</p>

<ol>
<li><strong>Embed the query:</strong> Run the user's question through the same embedding model → query vector.</li>
<li><strong>Search:</strong> Find the top-k most similar chunk vectors in the database (typically cosine similarity or dot product).</li>
<li><strong>Return:</strong> Pull back the original text chunks corresponding to those vectors.</li>
</ol>

<h3>Phase 3: Generation (the answer)</h3>

<p>Pack the retrieved chunks into the LLM's prompt alongside the question:</p>

<blockquote>"Based on the following context, answer the user's question.<br><br>
Context: [chunk 1] [chunk 2] [chunk 3]...<br><br>
Question: [user's question]<br><br>
Answer:"</blockquote>

<p>The model generates an answer grounded in the retrieved documents rather than its own memory.</p>

<h2>Why Chunking is the Most Important Decision</h2>

<p>Chunking strategy has more impact on RAG quality than almost any other design choice. Get it wrong and no amount of model capability compensates — garbage retrieval in, garbage answers out.</p>

<p><strong>Too small (< 128 tokens):</strong> Precise retrieval but missing context. "The dosage is 500mg" without knowing "for adults with normal renal function, contraindicated with warfarin."</p>

<p><strong>Too large (> 1000 tokens):</strong> Full context but diluted embeddings. A chunk covering 5 topics matches none of them well. The embedding becomes an average that's close to nothing specific.</p>

<p><strong>Sweet spot (256-512 tokens):</strong> Each chunk covers one coherent concept with enough surrounding context. Add 10-20% overlap between adjacent chunks so information at boundaries isn't lost.</p>

<p><strong>Advanced strategies:</strong> Semantic chunking (split where topics change, detected by embedding similarity drops), recursive character splitting (try paragraph breaks first, then sentences, then words), or parent-child (index small chunks but retrieve the larger parent document for context).</p>

<h2>When Basic RAG Fails — And What to Do About It</h2>

<p>Basic RAG works well for straightforward factual questions over clean documents. It starts failing in predictable ways:</p>

<p><strong>Problem: Query-document mismatch.</strong> The user asks "How do I handle timeouts?" but the documentation says "Configure the request deadline parameter." Different words, same concept. The embeddings might not be close enough.</p>
<p><em>Solution: HyDE (Hypothetical Document Embedding) — have the LLM generate a hypothetical answer, embed THAT (which is document-like in style), and use it for retrieval. Or query rewriting — expand one query into multiple search queries.</em></p>

<p><strong>Problem: Relevant results buried in noise.</strong> You retrieve 10 chunks but only 3 are actually relevant. The LLM gets confused by the 7 irrelevant ones.</p>
<p><em>Solution: Re-ranking with a cross-encoder. Retrieve 50 candidates with fast vector search (high recall), then use a more expensive cross-encoder model to precisely score and re-rank them (high precision). Send only the top 5-10 to the LLM.</em></p>

<p><strong>Problem: Answer spans multiple documents.</strong> "How does company A's product relate to company B's supply chain?" requires connecting facts from different documents.</p>
<p><em>Solution: Graph RAG — build a knowledge graph of entities and relationships, traverse it at query time to find connections that flat retrieval would miss.</em></p>

<p><strong>Problem: Keywords matter but semantic search misses them.</strong> Searching for error code "ERR_HTTP2_PROTOCOL_ERROR" — this is an exact match problem that semantic embeddings aren't designed for.</p>
<p><em>Solution: Hybrid search — combine semantic (vector) search with keyword (BM25) search, merge results with Reciprocal Rank Fusion (RRF).</em></p>

<blockquote>Next module: "Agents — When the Model Needs to Act, Not Just Answer" — building systems that take actions in the world.</blockquote>
`
},
{
  title: "Agents: When the Model Needs to Act, Not Just Answer",
  description: "Building autonomous LLM systems with tools, memory, and decision-making loops. The frontier of AI engineering.",
  level: "intermediate",
  readTime: "10 min",
  linkedTopics: ["AI Agents & Tool Use"],
  content: `
<h2>From Question-Answering to Doing Things</h2>

<p>Up to this point, every pattern we've discussed is essentially: user asks, model answers. Even RAG is fundamentally a question-answering system with extra context. But many real-world tasks aren't questions — they're <strong>jobs</strong>.</p>

<p>"Research competitor pricing and update the spreadsheet." "Debug why the deployment failed." "Schedule a meeting with everyone who was in last week's standup." These require the model to take actions, observe results, make decisions, and iterate. This is what agents do.</p>

<h2>The Agent Loop</h2>

<p>Every agent — from simple ReAct chatbots to complex systems like Claude Code or Devin — runs the same fundamental loop:</p>

<ol>
<li><strong>Observe:</strong> Look at the current state (user message, tool results, conversation history)</li>
<li><strong>Think:</strong> Reason about what to do next ("I need to search the database for this customer")</li>
<li><strong>Act:</strong> Call a tool (search, API, code execution, file system)</li>
<li><strong>Observe result:</strong> See what the tool returned</li>
<li><strong>Repeat</strong> until the task is done (or you've hit a limit)</li>
</ol>

<p>This is the <strong>ReAct pattern</strong> (Reasoning + Acting), and every major agent framework is a variation on it. The model alternates between thinking (generating reasoning text) and acting (generating structured tool calls). The thinking guides the acting; the acting results inform the thinking.</p>

<div class="analogy"><strong>Medical analogy:</strong> A clinician seeing a patient follows the same loop. Observe (history, vitals). Think (differential diagnosis). Act (order a blood test). Observe result (abnormal potassium). Think (consider causes). Act (order an ECG). Repeat until diagnosis and management plan are reached. An agent is an AI doing this loop over digital tools instead of clinical ones.</div>

<h2>Function Calling: How Agents Interact with the World</h2>

<p>The mechanism by which agents "do things" is <strong>function calling</strong> (also called tool use). Here's how it works:</p>

<p>You define available tools as structured descriptions:</p>
<blockquote>{"name": "search_database", "description": "Search the product database by name or category", "parameters": {"query": "string", "category": "optional string"}}</blockquote>

<p>The model, instead of generating text, outputs a structured function call:</p>
<blockquote>{"function": "search_database", "arguments": {"query": "wireless headphones", "category": "electronics"}}</blockquote>

<p>Your application executes the actual function, gets the result, and feeds it back to the model as an "observation." The model then decides what to do next — maybe it has enough info to answer, maybe it needs another tool call.</p>

<p><strong>Critical design principle:</strong> The tool DESCRIPTIONS are how the model decides which tool to use. Vague descriptions → wrong tool selection. "Search" tells the model nothing. "Search the product catalog by name, brand, or category to find product details including price and availability" tells it exactly when this tool is useful.</p>

<h2>MCP and A2A: Universal Standards for Tools and Agents</h2>

<p>Before MCP, every tool integration was custom. LangChain had its tool format, OpenAI had function calling, each framework had its own way. Building a tool for one system meant rebuilding it for another.</p>

<p><strong>MCP (Model Context Protocol)</strong> from Anthropic standardizes this. Build a tool as an MCP server once, and it works with any MCP-compatible host — Claude Desktop, VS Code, custom applications. Like USB standardized peripheral connections: one interface, universal compatibility.</p>

<p><strong>A2A (Agent2Agent)</strong> from Google does the same for agent-to-agent communication. While MCP connects agents to tools, A2A connects agents to each other. Your scheduling agent can delegate to a vendor's calendar agent through a standard protocol, without custom integration.</p>

<h2>When to Use Agents vs Simpler Approaches</h2>

<p>Agents are powerful but add complexity, cost, latency, and unpredictability. Use them only when simpler approaches can't work:</p>

<p><strong>Use agents when:</strong></p>
<ul>
<li>The number of steps isn't known in advance</li>
<li>The path depends on intermediate results</li>
<li>Error recovery and adaptation are needed</li>
<li>Multiple tools may be needed in variable combinations</li>
</ul>

<p><strong>Use chains (fixed pipelines) when:</strong></p>
<ul>
<li>The workflow is always A → B → C</li>
<li>Each step is predictable</li>
<li>Reliability matters more than flexibility</li>
</ul>

<p>Most real applications are chains, not agents. Don't build an agent when a three-step pipeline would do — agents are harder to debug, more expensive, and less predictable. But when you truly need adaptive, autonomous behavior, agents are the only answer.</p>

<blockquote>Next module: "Production AI: Shipping, Monitoring, and Not Going Broke" — the engineering that turns a demo into a product.</blockquote>
`
},
{
  title: "Production AI: Shipping, Monitoring, and Not Going Broke",
  description: "The last mile: serving at scale, cost optimization, observability, guardrails, and the harness that holds it all together.",
  level: "advanced",
  readTime: "10 min",
  linkedTopics: ["Deployment & MLOps", "Inference & Quantization", "Security & Safety"],
  content: `
<h2>The Demo-to-Production Gap</h2>

<p>Getting an LLM to produce impressive output in a notebook takes an afternoon. Getting it to work reliably for 100,000 users, at acceptable cost, without embarrassing failures, while complying with regulations — that takes months of engineering. This is where most AI projects fail.</p>

<p>The gap has three dimensions: <strong>reliability</strong> (it must work every time, not just usually), <strong>cost</strong> (impressive output at $0.50/query doesn't scale), and <strong>safety</strong> (one harmful output can end careers and companies).</p>

<h2>The Harness: Everything Around the Model</h2>

<p>The "harness" is all the orchestration code between the user's request and the model's response. The LLM call itself is often one line of code — the harness is the other 95%. It handles:</p>

<ul>
<li><strong>Prompt management:</strong> Version-controlled templates, dynamic variable injection, context assembly for RAG</li>
<li><strong>Output parsing:</strong> Extracting structured data from model output, validating against schemas, handling malformed output</li>
<li><strong>Error handling:</strong> Retry logic, timeout management, rate limit handling, fallback models</li>
<li><strong>Caching:</strong> Exact-match caching, semantic caching, prompt prefix caching</li>
<li><strong>Routing:</strong> Directing queries to different models based on complexity</li>
<li><strong>Guardrails:</strong> Input validation, output filtering, PII detection, safety classification</li>
</ul>

<p><strong>The anti-pattern:</strong> Building a complex harness before validating basic model behavior. Start with the simplest possible pipeline. Get the LLM to produce good output with a basic prompt. THEN add caching, routing, guardrails — each layer justified by a specific problem you've observed.</p>

<h2>Cost Engineering: The Three Big Levers</h2>

<p>At scale, LLM costs dominate. Three strategies together can cut costs 60-80%:</p>

<p><strong>1. Model routing (biggest impact):</strong> Most queries (60-80%) are simple — greetings, FAQs, straightforward questions. Route these to cheap/fast models (GPT-4o-mini, Claude Haiku). Reserve expensive models (GPT-4, Claude Opus) for complex reasoning. A simple classifier at the entry point decides. This alone can cut costs 50-70%.</p>

<p><strong>2. Prompt caching (easy win):</strong> If your system prompt is 3000 tokens and the user query is 200 tokens, prompt caching lets you pay full price for the 3000-token prefix once, then ~10% for it on subsequent calls. Structure prompts with static content first (system prompt, examples) and dynamic content last (user query). Anthropic and OpenAI both offer this.</p>

<p><strong>3. Response caching (for repeated queries):</strong> If 20% of queries are repeated or near-identical, cache the responses. Semantic caching goes further — embed queries and return cached responses for semantically similar questions. Zero LLM cost for cache hits.</p>

<h2>Observability: You Can't Fix What You Can't See</h2>

<p>Traditional software monitoring checks: did the request return 200? Was latency under 500ms? LLM monitoring must go further because <strong>LLM failures are silent</strong>. The API returns 200 with a fluent, confident response that's completely wrong. No error code tells you the answer was hallucinated.</p>

<p>What to monitor:</p>

<ul>
<li><strong>Traces:</strong> Full pipeline visibility — what was the input, what was retrieved (for RAG), what was the final prompt, what did the model output, how was it parsed. When something goes wrong, the trace shows WHERE.</li>
<li><strong>Quality signals:</strong> User feedback (thumbs up/down), regeneration rate, conversation abandonment, task completion rate.</li>
<li><strong>Cost tracking:</strong> Token usage per request, cost per user, cost trends. Catch runaway costs early.</li>
<li><strong>Latency breakdown:</strong> Time to first token (TTFT), tokens per second (TPS), retrieval time for RAG.</li>
</ul>

<p>Tools: Langfuse (open-source, self-hostable), LangSmith (LangChain's platform), Helicone (proxy-based). At minimum, log every prompt and response with timestamps and user IDs.</p>

<h2>Security: Assume the Model Will Be Compromised</h2>

<p>Prompt injection is the SQL injection of the AI era — and it's currently unsolvable in a fundamental sense. LLMs can't architecturally distinguish instructions from data. Every defense is heuristic.</p>

<p>The approach: <strong>defense in depth + least privilege</strong>. Layer multiple defenses knowing each can be bypassed individually. And limit what the model can DO even if it's compromised:</p>

<ul>
<li>Read-only database access (not write)</li>
<li>Parameterized queries only (not raw SQL)</li>
<li>Allowlisted tool operations (not arbitrary code execution)</li>
<li>Human approval for destructive actions</li>
<li>Output scanning for PII, malicious content, credential-request patterns</li>
</ul>

<p>The goal isn't to prevent all attacks — it's to ensure that a successful attack causes minimal damage.</p>

<blockquote>You now have the conceptual foundation. The knowledge cards and MCQs will drill the details. Start with Quick Mix to test what you've absorbed, then dig into specific topics.</blockquote>
`
}
];
