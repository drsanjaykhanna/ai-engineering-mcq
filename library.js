const READING_LIST = [
{
  title: "Chapter 1: Prompt Engineering — Precision Over Hope",
  author: "LLM Engineering Course · Phase 11",
  type: "course",
  description: "The discipline of writing instructions that reliably produce the output you want. Patterns, temperature, constraints, and why specificity beats cleverness.",
  content: `
<h2>The Gap Between What You Ask and What You Get</h2>

<p>Most people write prompts like text messages — casual, ambiguous, context-free. Then they blame the model when the output is mediocre. But the model is doing exactly what it was asked. The problem is the instruction, not the intelligence.</p>

<p>Consider two ways to request the same thing:</p>

<p><strong>Vague:</strong> "Write a marketing email for our new product."</p>

<p><strong>Engineered:</strong> "You are a senior copywriter at a B2B SaaS company. Write a product launch email for DevFlow, a CI/CD pipeline debugger. Target audience: engineering managers at Series B startups. Tone: confident, technical, not salesy. Length: 150 words. Include one specific metric (3.2x faster pipeline debugging). End with a single CTA linking to a demo page. Output the email only."</p>

<p>The first prompt activates a generic distribution of marketing emails from the model's training data. The second activates a narrow, high-quality slice. Same model. Same parameters. Wildly different outputs. The gap between these two approaches is the entire discipline of prompt engineering.</p>

<h2>The Anatomy of a Prompt</h2>

<p>Every LLM API call has three components, and understanding them changes how you write prompts:</p>

<p><strong>System message:</strong> The invisible hand. It sets the model's identity, behavioural constraints, and output rules. The model treats this as highest-priority context. Think of it as the consultant's brief — who you are, what you do, what you never do.</p>

<p><strong>User message:</strong> The actual task. This is what most people think of as "the prompt." But without a good system message, the user message is under-constrained — like giving a contractor instructions without blueprints.</p>

<p><strong>Assistant prefill:</strong> You can start the model's response with a partial string. Send the beginning of a JSON object and the model will continue it, producing structured output without preamble. This is a powerful but underused technique.</p>

<h2>Role Prompting: Not Magic, Activation</h2>

<p>"You are a senior Python developer" is not a magic spell. It's an activation function over the model's training distribution.</p>

<p>LLMs are trained on billions of documents — from amateur blog posts to peer-reviewed papers, from Stack Overflow answers with zero upvotes to those with five thousand. When you specify a role, you bias the model's sampling toward the expert end of its training data.</p>

<p>The specificity principle: more specific roles produce higher quality outputs, up to a point. "You are a software engineer" gives generic code. "You are a senior backend engineer at Stripe specialising in payment systems" gives narrow, high-quality, domain-specific output. But "You are the world's foremost expert on quantum gravity string topology" produces confident nonsense because so few training examples exist at that intersection.</p>

<h2>The Six Rules of Instruction Clarity</h2>

<p>Every ambiguity in your prompt is a branch point where the model guesses. Sometimes it guesses right. Your job is to eliminate the guessing.</p>

<ol>
<li><strong>Specify the format:</strong> Bullet points? JSON? Numbered list? Paragraph? If you don't specify, you get whatever the model's default distribution produces.</li>
<li><strong>Specify the length:</strong> "Under 200 words" or "exactly 3 bullet points." Without this, responses vary wildly in length.</li>
<li><strong>Specify the audience:</strong> "For a technical audience" vs "for a 10-year-old" produces completely different register and vocabulary.</li>
<li><strong>Specify inclusions AND exclusions:</strong> "Include quantitative findings. Exclude opinions." Negative constraints ("do NOT...") are surprisingly effective — they eliminate large regions of output space.</li>
<li><strong>Give one example:</strong> A single example of desired output is worth a hundred words of description.</li>
<li><strong>State your goal explicitly:</strong> "I want to decide whether to invest in this company" gives the model purpose. Without it, the model doesn't know what aspects to emphasise.</li>
</ol>

<h2>Temperature: The Most Misunderstood Parameter</h2>

<p>Temperature controls randomness in token selection. It's the single most impactful parameter after the prompt itself.</p>

<p><strong>Temperature = 0:</strong> Deterministic. Always picks the highest probability token. Use for: data extraction, classification, code generation, any task with one right answer. Same input always produces same output.</p>

<p><strong>Temperature = 0.3-0.7:</strong> Balanced. Mostly predictable with some variation. Use for: summarisation, analysis, Q&A, technical writing.</p>

<p><strong>Temperature = 1.0:</strong> Creative. Samples from the full distribution. Use for: brainstorming, creative writing, generating diverse options.</p>

<p><strong>Temperature > 1.0:</strong> Chaotic. Flattens the distribution, making rare tokens more likely. Almost never useful in production — outputs become incoherent.</p>

<p>The key insight: temperature doesn't make the model "more creative" in any deep sense. It just makes it more likely to choose tokens that aren't the most probable. For factual tasks, that means more errors. For creative tasks, that means more novelty. Match temperature to task type.</p>

<h2>Constraint Patterns That Work</h2>

<p>Three constraint types, each eliminating different failure modes:</p>

<p><strong>Negative constraints ("Do NOT..."):</strong> "Do NOT include code examples. Do NOT use jargon. Do NOT exceed 200 words." These are surprisingly effective because they eliminate entire categories of unwanted output. The model doesn't have to guess what you want — it knows what you don't want.</p>

<p><strong>Positive constraints ("Always..."):</strong> "Always cite the source. Always include a confidence score. Always end with a summary." These create structural guarantees in every response.</p>

<p><strong>Conditional constraints ("If X then Y"):</strong> "If the user asks about pricing, respond only with official pricing page information. If you are not confident, say 'I am not sure' rather than guessing." These handle edge cases that would otherwise produce bad outputs.</p>

<h2>Common Failures and Fixes</h2>

<p><strong>Failure: Output too long.</strong> Fix: explicit length constraint plus "be concise" in system prompt.</p>

<p><strong>Failure: Hallucinating facts.</strong> Fix: "Only use information from the provided context. If the answer isn't in the context, say 'I don't have enough information to answer this.'"</p>

<p><strong>Failure: Ignoring format instructions.</strong> Fix: Put format instructions LAST (recency bias) and include a concrete example of the desired format.</p>

<p><strong>Failure: Breaking character.</strong> Fix: Strengthen the system prompt with "Under NO circumstances should you break from this role" and test with adversarial inputs.</p>

<p><strong>Failure: Inconsistent between calls.</strong> Fix: Temperature = 0 for determinism, or use structured output mode for format consistency.</p>
`
},
{
  title: "Chapter 2: Few-Shot, Chain-of-Thought, and Reasoning Strategies",
  author: "LLM Engineering Course · Phase 11",
  type: "course",
  description: "Beyond basic prompting — the techniques that unlock multi-step reasoning. How to make models think before answering, and when each strategy helps.",
  content: `
<h2>The Reasoning Gap</h2>

<p>Telling a model what to do is prompting. Showing it how to think is engineering. The gap between 78% and 91% accuracy on the same model, same task, same data is not a better model — it's a better reasoning strategy.</p>

<p>This chapter covers the three techniques that have had the most impact on LLM reasoning ability: few-shot examples, chain-of-thought prompting, and their advanced variants.</p>

<h2>Few-Shot Prompting: Show, Don't Tell</h2>

<p>Instead of describing the task with instructions, demonstrate it with examples. Include 3-5 input/output pairs in your prompt, and the model pattern-matches against them to handle new inputs.</p>

<p><strong>Why it works:</strong> LLMs are extraordinary pattern matchers. When they see a consistent pattern in the prompt (input → format → output repeated several times), they continue that pattern. This leverages in-context learning — the model adapts its behaviour from the examples without any weight updates.</p>

<p><strong>Example selection matters enormously:</strong></p>
<ul>
<li><strong>Diversity:</strong> Choose examples that cover different cases. If all your examples are positive sentiment, the model will be biased toward positive classifications.</li>
<li><strong>Edge cases:</strong> Include at least one tricky or ambiguous example that shows how to handle uncertainty.</li>
<li><strong>Ordering:</strong> The last example has the most influence (recency bias). Put your most representative, clearest example last.</li>
<li><strong>Format consistency:</strong> All examples must use identical formatting. Inconsistency confuses the model about what pattern to follow.</li>
</ul>

<p><strong>How many examples?</strong> 3-5 is the sweet spot for most tasks. Fewer than 3 may not establish a clear pattern. More than 8 shows diminishing returns and wastes context window space. The exception: very complex or unusual tasks may benefit from more examples.</p>

<h2>Chain-of-Thought: Making Models Show Their Work</h2>

<p>Chain-of-Thought (CoT) prompting asks the model to generate intermediate reasoning steps before producing a final answer. The simplest version: add "Let's think step by step" to your prompt.</p>

<p><strong>Why it works mechanistically:</strong> Without CoT, the model must "jump" from question to answer in the space of a single token — the final answer token. With CoT, each generated reasoning token is a computation step. The model literally uses its own output as working memory, building toward the answer incrementally.</p>

<p>Think of it this way: asking someone to do mental arithmetic silently (likely to make errors) vs asking them to write out their working (self-correcting). CoT is asking the model to write out its working.</p>

<p><strong>Zero-shot CoT:</strong> Just append "Let's think step by step" (or "Think through this carefully" or "Reason about this before answering"). Surprisingly effective for a simple instruction. Works because models have seen step-by-step reasoning in their training data and this phrase activates that pattern.</p>

<p><strong>Few-shot CoT:</strong> Provide examples that include the reasoning chain, not just the input and output. Show the model what good reasoning looks like for your specific task. More reliable than zero-shot because you control the reasoning style.</p>

<p><strong>When CoT helps:</strong> Multi-step math, logical reasoning, planning tasks, complex analysis, any task requiring more than one inference step.</p>

<p><strong>When CoT hurts:</strong> Simple factual retrieval ("What's the capital of France?"), basic classification with clear categories, tasks that don't benefit from decomposition. For these, CoT adds unnecessary "thinking" tokens that can lead to second-guessing correct initial answers.</p>

<h2>Self-Consistency: Voting Across Reasoning Paths</h2>

<p>Generate N different chain-of-thought reasoning paths (using temperature > 0 for diversity), extract the final answer from each, and take the majority vote.</p>

<p><strong>The insight:</strong> Different reasoning paths may make different errors, but the correct answer tends to appear most often across samples. It's the same principle as asking multiple experts — they might disagree on reasoning, but if 7 out of 10 reach the same conclusion, that conclusion is likely right.</p>

<p><strong>Tradeoff:</strong> N times the cost for better reliability. Use for high-stakes decisions where getting it right matters more than cost or latency.</p>

<h2>Tree of Thoughts: Exploring Multiple Paths</h2>

<p>Instead of a single linear reasoning chain, Tree of Thoughts (ToT) explores multiple reasoning paths simultaneously, evaluating each at intermediate steps and pruning unpromising branches.</p>

<p><strong>The process:</strong> At each reasoning step, generate multiple possible next steps. Evaluate which are most promising (using the LLM itself as evaluator). Continue only along promising branches. Backtrack if a path leads nowhere.</p>

<p><strong>When to use it:</strong> Complex planning tasks, puzzles requiring exploration, situations where the right first step isn't obvious and wrong first steps waste time. NOT needed for straightforward reasoning — it's expensive and slow.</p>

<h2>ReAct: Reasoning + Acting</h2>

<p>ReAct interleaves reasoning with actions. The model alternates between thinking (generating reasoning text) and acting (calling tools, searching databases, running calculations). The thinking guides which action to take; the action results inform the next thinking step.</p>

<p><strong>The pattern:</strong></p>
<ol>
<li><strong>Thought:</strong> "I need to find the current population of Tokyo to answer this question."</li>
<li><strong>Action:</strong> search("population Tokyo 2024")</li>
<li><strong>Observation:</strong> "The population of Tokyo is approximately 13.96 million."</li>
<li><strong>Thought:</strong> "Now I can compare this with the user's question about cities over 10 million."</li>
<li><strong>Answer:</strong> "Yes, Tokyo's population of ~14 million exceeds 10 million."</li>
</ol>

<p><strong>Why it matters:</strong> Pure reasoning (CoT) hallucinates facts because it reasons from memory alone. Pure action (calling tools without reasoning) is inefficient — the model calls tools blindly without strategic thinking. ReAct combines the best of both: reasoning guides tool selection, and tool results ground the reasoning in facts. This is the foundation of all modern agent architectures.</p>

<h2>Choosing the Right Strategy</h2>

<p><strong>Simple factual task:</strong> Zero-shot, no CoT needed.</p>
<p><strong>Pattern-following task:</strong> Few-shot examples.</p>
<p><strong>Multi-step reasoning:</strong> Chain-of-thought.</p>
<p><strong>High-stakes reasoning:</strong> Self-consistency (multiple CoT paths + voting).</p>
<p><strong>Complex planning/exploration:</strong> Tree of Thoughts.</p>
<p><strong>Needs external information:</strong> ReAct (reasoning + tool use).</p>

<p>Start with the simplest strategy that works. Escalate only when accuracy is insufficient. Each level adds cost and complexity.</p>
`
},
{
  title: "Chapter 3: Structured Outputs — Making LLMs Produce Reliable Data",
  author: "LLM Engineering Course · Phase 11",
  type: "course",
  description: "Your LLM returns a string. Your application needs JSON. That gap has crashed more production systems than any hallucination. How to bridge it reliably.",
  content: `
<h2>The String-to-Structure Problem</h2>

<p>Here's the fundamental tension: LLMs are text generators. They produce free-form strings. But your application — your API, your database, your frontend — needs typed, structured data. JSON objects with specific keys. Arrays with specific item types. Numbers that are actually numbers, not the word "twenty-three."</p>

<p>The gap between "the model usually outputs valid JSON" and "the model always outputs valid JSON" is the gap between a demo and a production system. In production, "usually" means your downstream parser crashes 3% of the time — that's thousands of failures per day at scale.</p>

<h2>The Four Approaches (From Weakest to Strongest)</h2>

<h3>Level 1: Prompt Instructions (Soft Constraint)</h3>

<p>Ask the model to output JSON in your prompt: "Respond with a JSON object containing keys: name (string), score (number), reasoning (string)."</p>

<p><strong>Reliability:</strong> ~90-95%. Usually works but fails unpredictably — the model might add markdown code fences, include explanatory text before/after the JSON, miss a closing bracket, or add trailing commas (invalid JSON). Good enough for prototyping. Not good enough for production.</p>

<h3>Level 2: JSON Mode (API Feature)</h3>

<p>OpenAI and other providers offer a "JSON mode" that guarantees the output is valid JSON. The model is constrained to only produce syntactically valid JSON. It can still produce the WRONG structure (missing keys, wrong types) but it will always be parseable.</p>

<p><strong>Reliability:</strong> 100% valid JSON, but schema compliance varies. You still need to validate the structure matches your expected schema.</p>

<h3>Level 3: Schema-Constrained Output (Strong Guarantee)</h3>

<p>Provide a JSON Schema (or Pydantic model) that defines exactly what fields exist, their types, required vs optional, enums for allowed values. The provider constrains generation to match this schema exactly.</p>

<p><strong>Reliability:</strong> ~99.9%. The output will have the right structure. Only fails in rare edge cases where the model can't fill a required field meaningfully.</p>

<h3>Level 4: Constrained Decoding (Absolute Guarantee)</h3>

<p>Tools like Outlines and SGLang enforce a grammar at the TOKEN level. At each generation step, they mask the probability of any token that would violate the grammar. The model literally cannot produce an invalid token.</p>

<p><strong>Reliability:</strong> 100%. Structural validity is guaranteed by construction, not by hoping the model complies. The model might fill fields with bad content, but the structure is always perfect.</p>

<h2>Why This Matters More Than You Think</h2>

<p>If your application calls an LLM and parses the result, you have two choices:</p>

<ol>
<li><strong>Trust and hope:</strong> Parse the output, catch exceptions, retry on failure, fall back gracefully. You're building error handling around a probabilistic system.</li>
<li><strong>Constrain and guarantee:</strong> Use schema-constrained output or constrained decoding so failure is structurally impossible. You're eliminating the failure class entirely.</li>
</ol>

<p>In production, option 2 is always preferable. Every retry costs latency and money. Every fallback path is code you have to test and maintain. Eliminating the failure class is cheaper than handling it.</p>

<h2>Function Calling as Structured Output</h2>

<p>Function calling (tool use) is actually structured output in disguise. When the model "calls a function," it's outputting a JSON object with a function name and typed arguments — constrained by the schema you defined for that function.</p>

<p>This means you can use function calling even when you don't actually want to call a function. Define a "function" that represents your desired output schema, let the model "call" it, and extract the structured arguments. The model's function-calling training makes it exceptionally reliable at filling structured schemas this way.</p>

<h2>Error Recovery Patterns</h2>

<p>Even with strong constraints, you need error handling:</p>

<p><strong>Retry with feedback:</strong> If parsing fails (e.g., the model produced invalid content despite structural validity), send the error back: "Your previous output was invalid: [error message]. Please fix it." Models usually self-correct on retry.</p>

<p><strong>Fallback chain:</strong> Primary model with structured output → if it fails, try a secondary model → if that fails, return a graceful error to the user.</p>

<p><strong>Schema validation:</strong> Even with guaranteed structure, validate CONTENT. A "score" field might contain 999 when you expected 0-100. An "email" field might contain "not applicable." Always validate values, not just types.</p>
`
},
{
  title: "Chapter 4: Context Engineering — Everything That Goes Into the Window",
  author: "LLM Engineering Course · Phase 11",
  type: "course",
  description: "Prompt engineering is a subset. Context engineering is the whole game. Deciding what goes into the model's window — and in what order — is the highest-leverage skill in AI engineering.",
  content: `
<h2>Beyond the Prompt</h2>

<p>Most people think prompt engineering is the skill. It's not. It's a subset of a larger, more impactful discipline: <strong>context engineering</strong>.</p>

<p>A prompt is a string you type. Context is EVERYTHING that goes into the model's window: system instructions, retrieved documents, tool definitions, conversation history, few-shot examples, and the prompt itself. The model processes all of this as one continuous input. How you assemble, order, and budget this context determines output quality far more than any single prompt trick.</p>

<p>The best AI engineers in 2026 are context engineers. They decide what goes in, what stays out, and in what order. This is the skill that separates systems that work from systems that don't.</p>

<h2>The Context Window as Scarce Resource</h2>

<p>Every model has a maximum context length. This is a hard budget — your entire input (system prompt + examples + retrieved docs + history + user query) plus the output must fit within it. Once you exceed it, content is truncated or the call fails.</p>

<p>But the real constraint isn't the maximum — it's the effective utilisation. Research consistently shows that models attend poorly to information in the middle of long contexts (the "lost in the middle" effect). A 200k token window where 80% of the content is noise produces worse results than a 4k token window that's 100% signal.</p>

<p><strong>The principle:</strong> Token budget is finite and attention is U-shaped (strong at start/end, weak in middle). Every token in your context must earn its place.</p>

<h2>The Five Context Components</h2>

<h3>1. System Instructions (Top Priority, Beginning of Context)</h3>
<p>Who the model is, what it does, what it never does. This gets the strongest attention position (beginning of context) and sets the behavioural frame for everything that follows. Change the system prompt, change the model's entire personality and capability set.</p>

<h3>2. Tool Definitions (High Priority)</h3>
<p>If the model has access to tools/functions, their schemas and descriptions consume context. 10 tools with detailed descriptions might use 2,000 tokens. Only include tools that are relevant to the current interaction — not your entire tool catalogue.</p>

<h3>3. Retrieved Context (Dynamic, Core for RAG)</h3>
<p>Documents retrieved from your knowledge base for this specific query. The highest-leverage place to invest engineering effort: better retrieval = better context = better answers. Order matters — most relevant documents at the START of this section (primacy effect).</p>

<h3>4. Conversation History (Growing, Must Be Managed)</h3>
<p>Previous turns in the conversation. Grows with every exchange. Eventually dominates the context window if unmanaged. Strategies: sliding window (keep last N turns), summarisation (compress old turns into a summary), selective retention (keep only turns relevant to the current topic).</p>

<h3>5. User Query (End Position, Recency Advantage)</h3>
<p>The actual current request. Placed LAST for recency bias (model attends strongly to what it just read) and for prompt caching (static prefix → cached, dynamic suffix → processed fresh).</p>

<h2>The Ordering Principle</h2>

<p>Position in context correlates with attention strength:</p>
<ul>
<li><strong>Beginning:</strong> Strong attention. Put system instructions and the most important context here.</li>
<li><strong>Middle:</strong> Weakest attention. Don't bury critical information here, especially in long contexts.</li>
<li><strong>End:</strong> Strong attention. Put the user's current query and any high-priority information here.</li>
</ul>

<p>For prompt caching: static content (system prompt, examples) goes first; dynamic content (user query, retrieved docs) goes last. The static prefix is cached, saving cost and latency.</p>

<h2>Context Budget Management</h2>

<p>A typical production prompt breakdown:</p>
<ul>
<li>System prompt: 500-2,000 tokens</li>
<li>Tool definitions: 500-3,000 tokens</li>
<li>Few-shot examples: 500-1,500 tokens</li>
<li>Retrieved context: 2,000-8,000 tokens</li>
<li>Conversation history: grows unboundedly</li>
<li>User query: 50-500 tokens</li>
<li>Reserved for output: 500-4,000 tokens</li>
</ul>

<p>Total: easily 10,000-20,000 tokens per request. At scale, this means real cost. And if your conversation history is long, something must be cut.</p>

<p><strong>Dynamic context assembly:</strong> The harness shouldn't use a fixed template. It should dynamically decide: how many retrieved chunks to include (based on relevance scores), how much history to keep (based on recency and relevance), whether to include few-shot examples (maybe skip them for simple queries to save budget). This dynamic assembly is what separates good AI applications from rigid ones.</p>

<h2>Memory Systems</h2>

<p>When conversation history exceeds what fits in the context window, you need external memory:</p>

<p><strong>Sliding window:</strong> Keep only the last N turns. Simple but loses early context that might still be relevant.</p>

<p><strong>Summarisation:</strong> Periodically summarise older turns into a compact summary. "Earlier in this conversation, the user asked about X and I explained Y." Preserves key information at lower token cost.</p>

<p><strong>Vector memory:</strong> Store all conversation turns as embeddings. At each new turn, retrieve the most relevant past turns (not just the most recent). This gives the model access to relevant history regardless of how long ago it occurred.</p>

<p><strong>Structured memory:</strong> Extract and store key facts ("User's name is Sarah. Preferred language: Python. Working on: payment integration.") in a structured format that's always included in context. Very token-efficient for persistent user preferences.</p>
`
},
{
  title: "Chapter 5: RAG — The Complete Pipeline",
  author: "LLM Engineering Course · Phase 11",
  type: "course",
  description: "The most deployed pattern in production AI. How to build a system that answers questions from your documents — from ingestion to generation, basic to advanced.",
  content: `
<h2>Why RAG Exists</h2>

<p>Your LLM knows everything up to its training cutoff. It knows nothing about your company's docs, your codebase, or last week's meeting notes. RAG solves this by retrieving relevant documents and including them in the prompt. It's the most deployed pattern in production AI. If you understand one architecture pattern deeply, make it RAG.</p>

<p>The alternative — fine-tuning the model on your documents — is expensive, static (can't update without retraining), non-citable (you can't point to which document the answer came from), and risks catastrophic forgetting. RAG avoids all of these problems.</p>

<h2>The Pipeline: Chunk → Embed → Store → Retrieve → Generate</h2>

<h3>Step 1: Document Loading</h3>
<p>Ingest documents from their sources: PDFs, web pages, databases, Confluence wikis, Google Drive, Notion, Slack exports. Each source type needs a specific loader that extracts text while preserving meaningful structure (headings, lists, tables).</p>

<p>Common pitfalls: PDFs with tables (text extraction destroys table structure), scanned documents (need OCR first), images with text (need vision models), multi-column layouts (extraction order gets confused).</p>

<h3>Step 2: Chunking (The Most Important Decision)</h3>
<p>Split documents into smaller pieces for indexing. This single decision has more impact on RAG quality than any other design choice.</p>

<p><strong>Why chunk?</strong> Embedding models produce one vector per input. A single vector for a 50-page document is too diluted — it represents an average of everything, matching nothing well. You need vectors for specific concepts so queries match specific content.</p>

<p><strong>Chunk size tradeoff:</strong></p>
<ul>
<li>Too small (< 128 tokens): Precise retrieval but missing context. "The dosage is 500mg" without knowing for which condition or with what contraindications.</li>
<li>Too large (> 1000 tokens): Full context but diluted embeddings. A chunk about 5 topics matches none well.</li>
<li>Sweet spot: 256-512 tokens. Each chunk covers one coherent concept with enough surrounding context.</li>
</ul>

<p><strong>Overlap:</strong> Include 10-20% overlap between adjacent chunks. If the answer spans a chunk boundary, overlap ensures at least part of the relevant information is captured in each neighbouring chunk.</p>

<p><strong>Splitting strategies:</strong></p>
<ul>
<li><strong>Fixed-size:</strong> Split every N tokens. Simple but often cuts mid-sentence. Bad.</li>
<li><strong>Recursive character:</strong> Try splitting on paragraph breaks (\\n\\n), then sentence endings (. ), then words. Preserves natural boundaries. Good default.</li>
<li><strong>Semantic:</strong> Embed consecutive sentences, split where embedding similarity drops (indicating topic change). Most accurate but expensive. Use for high-value corpora.</li>
</ul>

<h3>Step 3: Embedding</h3>
<p>Run each chunk through an embedding model to produce a dense vector (768-3072 dimensions) that captures its semantic meaning. Similar meaning → similar vectors. This is what enables semantic search — finding relevant documents by meaning, not just keyword match.</p>

<p><strong>Model choice matters:</strong> Check the MTEB leaderboard. Domain-specific embedding models (medical, legal, code) outperform general ones for specialised corpora.</p>

<h3>Step 4: Storage (Vector Database)</h3>
<p>Store the vectors alongside their original text and metadata (source, date, section title, page number). The vector database provides fast similarity search at scale.</p>

<h3>Step 5: Retrieval (At Query Time)</h3>
<p>Embed the user's query with the same embedding model. Search the vector database for the top-k most similar chunk vectors. Return the original text chunks.</p>

<h3>Step 6: Generation</h3>
<p>Pack retrieved chunks into the prompt alongside the user's question. The model generates an answer grounded in the provided context rather than its own potentially outdated or incorrect memory.</p>

<h2>When Basic RAG Fails</h2>

<p>Basic RAG works for straightforward factual questions over clean documents. It fails predictably in several ways, each with specific solutions:</p>

<p><strong>Query-document mismatch:</strong> User asks "How do I fix timeouts?" but docs say "Configure the request deadline parameter." Different words, same concept. Solutions: HyDE (generate a hypothetical answer, embed that instead), query rewriting (expand into multiple search queries).</p>

<p><strong>Precision problem:</strong> Retrieved chunks include noise alongside signal. Solutions: Re-ranking (retrieve many candidates with fast search, then score precisely with a cross-encoder), metadata filtering (narrow by date, source, category before vector search).</p>

<p><strong>Recall problem:</strong> Missing relevant documents entirely. Solutions: Query expansion (multiple reformulations), hybrid search (combine vector search with keyword search using BM25).</p>

<p><strong>Multi-hop reasoning:</strong> Answer requires connecting facts from multiple documents. Solutions: Graph RAG (entity-relationship graph traversed at query time), iterative retrieval (retrieve → reason → retrieve more based on findings).</p>

<p><strong>Stale data:</strong> Documents updated but index wasn't rebuilt. Solution: Incremental indexing with change detection, version tracking on indexed documents.</p>

<h2>Hybrid Search: The Production Standard</h2>

<p>In production, pure vector search is rarely used alone. The standard is <strong>hybrid search</strong>: combine semantic (vector) search with keyword (BM25) search.</p>

<p><strong>Why both?</strong> Semantic search captures meaning ("heart attack" matches "myocardial infarction"). Keyword search captures exact terms (product names, error codes, acronyms that embeddings might not handle well). Each catches what the other misses.</p>

<p><strong>Reciprocal Rank Fusion (RRF):</strong> The standard way to merge two ranked lists into one. For each document, score = Σ 1/(k + rank_i). Documents ranked highly by BOTH methods get boosted to the top.</p>

<h2>Evaluation: Know If Your RAG Works</h2>

<p>Four metrics (from the Ragas framework) tell you where failures occur:</p>
<ul>
<li><strong>Context Precision:</strong> Are retrieved chunks relevant? (Low = too much noise)</li>
<li><strong>Context Recall:</strong> Did you find everything relevant? (Low = missing information)</li>
<li><strong>Faithfulness:</strong> Is the answer supported by context? (Low = hallucination)</li>
<li><strong>Answer Relevance:</strong> Does the answer address the question? (Low = off-topic)</li>
</ul>

<p>Diagnose failures: Low precision → improve chunking or add re-ranking. Low recall → improve retrieval (more queries, hybrid search). Low faithfulness → improve prompt ("only answer from context") or use a better model. Low relevance → clarify the query or improve instructions.</p>
`
},
{
  title: "Chapter 6: Fine-Tuning with LoRA — When Prompting Isn't Enough",
  author: "LLM Engineering Course · Phase 11",
  type: "course",
  description: "Full fine-tuning a 7B model requires 56GB of VRAM. LoRA lets you do it in 6GB by training less than 1% of parameters — matching full quality on most tasks.",
  content: `
<h2>The Full Fine-Tuning Problem</h2>

<p>To fine-tune a model, you need to store: the model weights, the gradients (same size as weights), and the optimiser states (Adam stores momentum + variance = 2× the model size in extra memory). For a 7B model in FP16: 14GB weights + 14GB gradients + 28GB optimiser = 56GB minimum. For a 70B model: 560GB. No single GPU handles this.</p>

<p>And even if you could afford it, full fine-tuning changes ALL parameters — risking catastrophic forgetting (improving on your task while losing general capabilities) and destroying the base model (you'd need to keep a separate copy).</p>

<p>LoRA solves both problems elegantly.</p>

<h2>The LoRA Insight</h2>

<p>During fine-tuning, the actual weight updates (ΔW) have <strong>low intrinsic rank</strong> — they can be approximated by the product of two small matrices. Instead of learning a full d×d update matrix (millions of parameters), LoRA decomposes it into: A (d×r) × B (r×d), where r (the rank) is tiny (8-64).</p>

<p>The base model stays completely frozen. Only the small A and B matrices train. For a 7B model with rank 16: you train about 0.5% of the total parameters. The other 99.5% never change — so the base model's general capabilities are perfectly preserved.</p>

<h2>The Key Hyperparameters</h2>

<p><strong>Rank (r):</strong> The most important dial. Determines how many parameters the adapter has and how much it can learn.</p>
<ul>
<li>r = 4-8: Minimal. Good for simple style/format changes.</li>
<li>r = 16-32: Standard. Sufficient for most domain adaptation tasks.</li>
<li>r = 64-128: High capacity. For complex domain adaptation with lots of training data.</li>
</ul>
<p>Higher rank = more capacity but more parameters and more risk of overfitting with limited data.</p>

<p><strong>Alpha (α):</strong> Scaling factor. The adapter output is multiplied by α/r before being added to the base. If α=32 and r=16, the scaling is 2× — the adapter's contribution is doubled. Common practice: set α = 2×r.</p>

<p><strong>Target modules:</strong> Which layers receive adapters. Typically the attention projections (Q, K, V, O). Adding MLP/FFN layers increases capacity but also cost. Start with attention-only; add MLP if quality is insufficient.</p>

<h2>QLoRA: Fine-Tuning on Consumer Hardware</h2>

<p>QLoRA's innovation: quantise the frozen base model to 4-bit (NF4 format) while keeping LoRA adapters in 16-bit. The base model uses ~4× less memory, leaving room for the adapters and their training state.</p>

<p><strong>What this enables:</strong></p>
<ul>
<li>7B model: fine-tune on a 6GB GPU (gaming laptop)</li>
<li>13B model: fine-tune on a 16GB GPU (mid-range desktop)</li>
<li>70B model: fine-tune on a single 48GB A100</li>
</ul>

<p>Quality is remarkably close to full fine-tuning — typically within 1-2% on benchmarks. The 4-bit base provides strong features; the 16-bit adapters learn task-specific adjustments.</p>

<h2>When to Fine-Tune (And When NOT To)</h2>

<p><strong>Fine-tune when:</strong></p>
<ul>
<li>You need consistent output style/format that prompting can't achieve reliably</li>
<li>You need domain-specific reasoning that doesn't emerge from prompting</li>
<li>You want to reduce inference cost (shorter prompts, cheaper model)</li>
<li>You have 1,000+ quality training examples</li>
<li>You've ALREADY tried prompting and RAG and they're insufficient</li>
</ul>

<p><strong>Do NOT fine-tune when:</strong></p>
<ul>
<li>Prompting works (why add complexity?)</li>
<li>You have fewer than 500 examples (will overfit)</li>
<li>The knowledge changes frequently (re-training is expensive; use RAG instead)</li>
<li>You need citations/traceability (fine-tuned knowledge isn't citable)</li>
<li>You haven't validated that the base model even HAS the capability you're trying to unlock</li>
</ul>

<h2>At Inference: Zero-Cost Deployment</h2>

<p>At inference time, you have two options:</p>

<p><strong>Merged:</strong> Compute W_new = W_base + A×B permanently. The model becomes a single set of weights with zero additional latency. But you lose the ability to swap adapters.</p>

<p><strong>Unmerged (adapter serving):</strong> Keep the base model loaded once and swap different LoRA adapters per-request. One GPU serves multiple "specialised" models — medical-LoRA for health queries, legal-LoRA for law questions. Extremely efficient for multi-tenant serving.</p>

<h2>The Training Process in Brief</h2>

<ol>
<li><strong>Prepare data:</strong> (instruction, response) pairs in the model's expected chat template format. Quality >> quantity.</li>
<li><strong>Choose base model:</strong> Llama-3-8B for efficiency, 70B for capability, Mistral for European data sovereignty.</li>
<li><strong>Set hyperparameters:</strong> rank=16, alpha=32, target_modules=["q_proj","k_proj","v_proj","o_proj"], learning_rate=2e-4, epochs=1-3.</li>
<li><strong>Train:</strong> Monitor eval loss. Stop if it starts increasing (overfitting). 1-3 epochs is typically sufficient.</li>
<li><strong>Evaluate:</strong> Run your eval pipeline. Compare to base model and to prompting-only approach. Check for catastrophic forgetting (run general benchmarks).</li>
<li><strong>Deploy:</strong> Merge or serve as adapter, depending on your multi-tenant needs.</li>
</ol>
`
},
{
  title: "Chapter 7: Function Calling, Evaluation & Production",
  author: "LLM Engineering Course · Phase 11",
  type: "course",
  description: "Giving models the ability to act (function calling), measuring whether your system works (evaluation), and the engineering that makes it production-ready.",
  content: `
<h2>Function Calling: Connecting Brain to Hands</h2>

<p>LLMs cannot do anything. They generate text. That is the entire capability. They cannot check the weather, query a database, send an email, or read a file. Every "AI agent" you've ever seen is an LLM generating JSON that says which function to call — and then your code actually calling it.</p>

<p>The model is the brain. Tools are the hands. Function calling is the nervous system connecting them.</p>

<h3>How It Works</h3>

<p><strong>1. Define tools:</strong> Provide the model with a list of available functions, each described by name, description, and a JSON schema for parameters. The description is critical — it's how the model decides which tool to use.</p>

<p><strong>2. Model decides:</strong> Based on the user's request, the model outputs a structured function call (JSON with function name and arguments) instead of text.</p>

<p><strong>3. You execute:</strong> Your application code actually calls the function with the model-generated arguments. The model never executes anything — it just specifies what to call.</p>

<p><strong>4. Feed result back:</strong> Append the function result to the conversation and let the model generate a response incorporating the real data.</p>

<h3>Critical Design Rules</h3>

<ul>
<li><strong>Descriptions determine selection:</strong> "search" tells the model nothing. "Search the product catalogue by name or category to find product details including price and availability" tells it exactly when to use this tool.</li>
<li><strong>Always validate arguments:</strong> The model might hallucinate invalid values. Validate types, ranges, and permissions before executing anything.</li>
<li><strong>Least privilege:</strong> Only expose tools the model needs. Every tool is an attack surface if the model is compromised via prompt injection.</li>
<li><strong>Never execute destructive actions without human approval:</strong> If the model can call "delete_user" or "send_email", a prompt injection becomes a full system compromise. Require confirmation for anything irreversible.</li>
</ul>

<h2>Evaluation: The Discipline Most Teams Skip</h2>

<p>You would never deploy a web app without tests. But most teams ship LLM applications by reading 10 outputs and saying "yeah, looks good." That's not evaluation — that's hope.</p>

<p>Every prompt change, every model swap, every temperature tweak changes your output distribution in unpredictable ways. Evaluation is the only thing standing between your application and silent degradation.</p>

<h3>Building an Eval Pipeline</h3>

<p><strong>Step 1: Test set.</strong> 50-100 examples covering happy path, edge cases, adversarial inputs, and known failure modes. For each: the input AND criteria for what makes a good output (not necessarily one "right answer" — maybe a rubric).</p>

<p><strong>Step 2: Metrics.</strong> Automated scores. Options: exact match, ROUGE/BLEU (text similarity), LLM-as-judge (rate quality 1-5 with rubric), Ragas metrics (for RAG), custom assertions (contains required fields, valid JSON, under length limit).</p>

<p><strong>Step 3: Regression testing.</strong> Before every change (prompt, model, pipeline), run the same test set against old and new versions. If quality drops on more than 5% of examples, investigate. This is the LLM equivalent of running unit tests before merge.</p>

<p><strong>Step 4: Production monitoring.</strong> User feedback (thumbs up/down), regeneration rate (how often users retry), conversation abandonment, task completion. These are your ongoing quality signals.</p>

<h2>The Production Checklist</h2>

<p>A working prototype ≠ a production system. The gap is filled by these engineering practices:</p>

<p><strong>Streaming:</strong> Users expect to see tokens appear in real-time, not wait 5 seconds for a complete response. Use server-sent events (SSE) to stream tokens as they're generated.</p>

<p><strong>Error handling:</strong> Retry with exponential backoff for transient failures. Fallback models when primary is down. Circuit breakers to avoid hammering a failed service. Graceful degradation — never show users a stack trace.</p>

<p><strong>Cost tracking:</strong> Log token usage (input, output, cached) per request. Track cost per user, per feature, per day. Set budget alerts. A prompt regression that doubles output length doubles your bill overnight.</p>

<p><strong>Observability:</strong> Full request traces: what was the input, what was retrieved, what was the final prompt, what did the model output. When (not if) something goes wrong, traces show WHERE.</p>

<p><strong>Rate limiting:</strong> Protect against abuse and runaway costs. Per-user limits, per-IP limits, global limits. Token bucket algorithm for smooth rate limiting.</p>

<p><strong>Guardrails:</strong> Input validation (topic filtering, PII detection, injection detection). Output validation (content moderation, PII filtering, format validation). Fast checks synchronous, expensive checks async.</p>

<p><strong>A/B testing:</strong> Run new prompt versions on a percentage of traffic. Compare quality metrics. Promote the winner. Don't ship prompt changes blind — measure their impact.</p>

<p>Every one of these is a potential interview question: "How would you handle rate limiting in an LLM application?" "How would you monitor output quality in production?" Understanding these is what separates someone who's built a prototype from someone who's shipped a product.</p>
`
}
];
