const QUESTIONS = [
// === DOMAIN 1: LLM FUNDAMENTALS ===
{
  id: "lf1", topic: "LLM Fundamentals", pageId: "kp_attention",
  question: "In the self-attention mechanism, what does the dot product of Query and Key vectors represent?",
  options: [
    "The information content to pass forward",
    "The relevance score between two tokens",
    "The positional distance between tokens",
    "The gradient signal for backpropagation"
  ],
  correct: 1,
  explanation: [
    "Incorrect. The Values (V) carry the information content. The Q·K dot product only determines how much attention to pay, not what information to pass.",
    "Correct. The dot product of Q and K measures how much one token should 'attend to' another — a higher score means greater relevance, which translates to more of that token's Value being included in the output.",
    "Incorrect. Positional encoding handles distance/position — it's a separate mechanism. Attention scores are based on semantic compatibility, not position (without positional encoding, attention is position-agnostic).",
    "Incorrect. Gradients are computed during backpropagation through automatic differentiation. The Q·K dot product is a forward-pass computation that determines attention weights."
  ]
},
{
  id: "lf2", topic: "LLM Fundamentals", pageId: "kp_attention",
  question: "Why is the attention score scaled by √d_k (square root of the key dimension)?",
  options: [
    "To reduce computational cost by using smaller numbers",
    "To make the model invariant to the embedding dimension",
    "To prevent softmax from producing near-one-hot distributions that kill gradients",
    "To normalize the output to unit length"
  ],
  correct: 2,
  explanation: [
    "Incorrect. The scaling doesn't reduce compute — it's a single division. The computation cost of the dot product itself is unchanged.",
    "Incorrect. The model is not dimension-invariant; changing d_k changes model capacity. Scaling just prevents a numerical issue that worsens with larger dimensions.",
    "Correct. As d_k grows large, dot products grow in magnitude (variance ≈ d_k). Large values push softmax into saturation — producing distributions close to one-hot, where gradients become vanishingly small. Dividing by √d_k keeps the variance at ~1 regardless of dimension.",
    "Incorrect. The output of attention isn't unit length. The scaling is applied to logits before softmax, not to the final output vectors."
  ]
},
{
  id: "lf3", topic: "LLM Fundamentals", pageId: "kp_attention",
  question: "What is the computational complexity of self-attention with respect to sequence length n?",
  options: [
    "O(n) — linear with sequence length",
    "O(n log n) — linearithmic",
    "O(n²) — quadratic with sequence length",
    "O(n³) — cubic with sequence length"
  ],
  correct: 2,
  explanation: [
    "Incorrect. Linear attention variants exist (like Mamba/state-space models) that achieve O(n), but standard self-attention is not linear. Every token must compute a score with every other token.",
    "Incorrect. Some efficient attention approximations (like Performer) aim for O(n log n), but standard self-attention requires all-pairs computation.",
    "Correct. Each of the n tokens computes attention scores with all n tokens, giving n × n = O(n²) score computations. This is why doubling context length quadruples compute, and why long-context models need architectural innovations.",
    "Incorrect. The matrix multiplications involved are at most O(n²·d) where d is the dimension, but with respect to sequence length alone it's quadratic, not cubic."
  ]
},
{
  id: "lf4", topic: "LLM Fundamentals", pageId: "kp_multihead",
  question: "A model has embedding dimension 1024 and 16 attention heads. What dimension does each head operate on?",
  options: [
    "1024 — each head sees the full dimension",
    "64 — the dimension is split equally across heads",
    "16 — one dimension per head",
    "16384 — the dimension is multiplied by the number of heads"
  ],
  correct: 1,
  explanation: [
    "Incorrect. If each head used the full 1024 dimensions, multi-head attention would cost 16× more than single-head. The whole point is to split the dimension.",
    "Correct. Multi-head attention divides the model dimension evenly: 1024 ÷ 16 = 64 dimensions per head. Each head learns its own Q/K/V projections in this 64-dimensional subspace. Total computation stays roughly equivalent to a single head operating on 1024 dimensions.",
    "Incorrect. 16 is the number of heads, not the dimension per head. Each head needs enough dimensions to learn meaningful attention patterns — 16 would be far too few.",
    "Incorrect. Multi-head attention doesn't expand the dimension — that would be enormously expensive. It partitions the existing dimension across heads."
  ]
},
{
  id: "lf5", topic: "LLM Fundamentals", pageId: "kp_multihead",
  question: "What is the primary benefit of having multiple attention heads rather than a single attention head of the same total dimension?",
  options: [
    "It reduces the total number of parameters in the attention layer",
    "It allows the model to attend to different types of relationships simultaneously",
    "It enables the model to process longer sequences",
    "It makes training converge faster by reducing gradient variance"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Multi-head attention has approximately the same parameter count as equivalent single-head attention. The parameters are just organized differently (split across heads + a final output projection).",
    "Correct. Different heads can specialize in different relationship types: syntactic structure, semantic similarity, positional proximity, or copying patterns. This parallel specialization is more expressive than a single monolithic attention function trying to capture everything at once.",
    "Incorrect. Multi-head attention doesn't change the sequence length capability. That's determined by positional encoding and attention complexity, not the number of heads.",
    "Incorrect. While multi-head attention trains well in practice, faster convergence isn't its primary design motivation. It's about representational capacity — capturing multiple relationship types simultaneously."
  ]
},
{
  id: "lf6", topic: "LLM Fundamentals", pageId: "kp_positional",
  question: "Why do transformer models need positional encoding at all?",
  options: [
    "To reduce the computational cost of attention",
    "Because self-attention is permutation-invariant — it has no inherent notion of token order",
    "To enable the model to handle variable-length sequences",
    "Because the embedding layer destroys positional information from the input"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Positional encoding adds computation (or at least parameters); it doesn't reduce cost. It's solving a different problem entirely.",
    "Correct. Self-attention computes the same output regardless of input order (it's set-like, not sequence-like). 'The cat sat' and 'sat cat the' would produce identical attention patterns without positional information. Position encoding breaks this symmetry.",
    "Incorrect. Transformers can handle variable-length inputs naturally through masking. Positional encoding is about knowing WHERE tokens are, not handling different-length inputs.",
    "Incorrect. The embedding layer maps tokens to vectors — it doesn't interact with position at all. The lack of positional awareness comes from the attention mechanism being order-agnostic, not from embedding."
  ]
},
{
  id: "lf7", topic: "LLM Fundamentals", pageId: "kp_positional",
  question: "What key advantage does RoPE (Rotary Position Embeddings) have over learned absolute positional embeddings?",
  options: [
    "RoPE uses fewer parameters",
    "RoPE encodes relative position through rotation, enabling better length generalization",
    "RoPE works with any vocabulary size",
    "RoPE eliminates the need for the softmax operation"
  ],
  correct: 1,
  explanation: [
    "Incorrect. While RoPE doesn't have a learned position embedding table, the parameter savings are minimal compared to the total model size. The benefit is functional, not about parameter count.",
    "Correct. RoPE rotates Q and K vectors by an angle proportional to their position. When you compute Q·K (dot product), the result depends on the DIFFERENCE in rotation angles — i.e., relative distance. This means the model naturally handles relative positioning and can better generalize to sequence lengths not seen during training.",
    "Incorrect. Positional encoding is independent of vocabulary. All position encoding methods work regardless of vocabulary size.",
    "Incorrect. RoPE doesn't change the attention mechanism — softmax is still applied to the scaled dot products. It only changes how position is encoded in the Q and K vectors."
  ]
},
{
  id: "lf8", topic: "LLM Fundamentals", pageId: "kp_architectures",
  question: "Why can't an encoder-only model like BERT generate text?",
  options: [
    "It has too few parameters for generation",
    "It uses bidirectional attention and has no autoregressive generation mechanism",
    "It was only trained on English text",
    "It doesn't have an embedding layer for output tokens"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Model size doesn't determine whether generation is possible — even a tiny decoder-only model can generate text. It's about architecture, not scale.",
    "Correct. BERT sees ALL tokens simultaneously (bidirectional) and is trained to predict masked tokens given full context. It has no mechanism to generate left-to-right one token at a time. Generation requires causal (left-to-right) masking so the model can predict the NEXT token given only PREVIOUS tokens.",
    "Incorrect. BERT has multilingual variants (mBERT). Language coverage has nothing to do with generation capability — that's an architectural property.",
    "Incorrect. BERT does have output projections over the vocabulary (used for MLM predictions). The issue isn't the output layer — it's that the model processes all positions at once rather than sequentially."
  ]
},
{
  id: "lf9", topic: "LLM Fundamentals", pageId: "kp_architectures",
  question: "Which architecture dominates modern large language models (GPT-4, Llama, Claude)?",
  options: [
    "Encoder-only",
    "Encoder-decoder",
    "Decoder-only",
    "Mixture of encoder and decoder stacks"
  ],
  correct: 2,
  explanation: [
    "Incorrect. Encoder-only models (BERT-style) are used for understanding/embedding tasks, not generation. They can't produce text autoregressively.",
    "Incorrect. While encoder-decoder (T5-style) works well for seq2seq tasks, the industry has converged on decoder-only for general-purpose LLMs. It's simpler and scales better.",
    "Correct. Decoder-only dominates because: (1) simpler architecture = easier to scale, (2) single training objective (next-token prediction) is surprisingly general, (3) can handle both understanding and generation without architectural asymmetry. GPT, Llama, Mistral, Claude are all decoder-only.",
    "Incorrect. While GPT-4 likely uses Mixture of Experts (MoE), the experts are within a decoder-only stack, not mixing encoder/decoder architectures."
  ]
},
{
  id: "lf10", topic: "LLM Fundamentals", pageId: "kp_tokenization",
  question: "What is the key difference between BPE and WordPiece tokenization?",
  options: [
    "BPE works on characters while WordPiece works on whole words",
    "BPE merges by frequency, WordPiece merges by likelihood gain",
    "BPE is faster at inference, WordPiece is faster at training",
    "BPE supports multiple languages, WordPiece only supports English"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Both BPE and WordPiece operate at the subword level, starting from characters and building up. Neither works exclusively on whole words.",
    "Correct. BPE selects the most frequent adjacent pair to merge at each step (simple counting). WordPiece selects the merge that maximizes the likelihood of the training corpus — a more principled but computationally heavier criterion. In practice, they produce similar vocabularies.",
    "Incorrect. The tokenization speed difference is negligible for both methods at inference time. The difference is in how the vocabulary is constructed during training.",
    "Incorrect. Both methods are language-agnostic — they work on any text. Multilingual support depends on training data diversity, not the tokenization algorithm."
  ]
},
{
  id: "lf11", topic: "LLM Fundamentals", pageId: "kp_tokenization",
  question: "Why do LLMs often struggle with simple arithmetic like adding large numbers?",
  options: [
    "They weren't trained on enough math examples",
    "Numbers tokenize unpredictably — '123456' may become multiple unrelated tokens",
    "Neural networks fundamentally cannot learn mathematical operations",
    "The softmax function can't represent precise numerical values"
  ],
  correct: 1,
  explanation: [
    "Incorrect. LLMs see enormous amounts of math during training. The issue isn't data volume — it's how numbers are represented at the input level.",
    "Correct. Tokenizers split numbers in arbitrary ways that don't respect place value. '123456' might become '123' + '456' or '12' + '345' + '6' depending on the tokenizer. The model has to learn arithmetic without consistent digit-level representation — like trying to add numbers when you can only see random chunks of digits.",
    "Incorrect. Neural networks can learn arithmetic (calculators exist as neural nets). The issue is specific to how LLMs tokenize and process numbers, not a fundamental limitation of neural computation.",
    "Incorrect. Softmax produces probability distributions over tokens, not numerical values directly. The model could in principle learn to output digit-by-digit, but tokenization makes the input representation inconsistent."
  ]
},
{
  id: "lf12", topic: "LLM Fundamentals", pageId: "kp_decoding",
  question: "A developer sets temperature=0 for their LLM API call. What behavior does this produce?",
  options: [
    "The model refuses to generate (zero creativity)",
    "Greedy decoding — always selects the highest probability token",
    "Random sampling from the full distribution",
    "The model generates the shortest possible response"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Temperature=0 doesn't disable generation — it just makes it completely deterministic. The model still generates tokens, just always the most probable ones.",
    "Correct. Temperature=0 means greedy decoding: the model always picks the single highest-probability token at each step. Same input = same output every time. This maximizes confidence but can produce repetitive, bland text for creative tasks. Ideal for factual extraction, classification, structured outputs.",
    "Incorrect. Random sampling uses temperature=1 (or >1 for more randomness). Temperature=0 is the opposite — zero randomness, pure determinism.",
    "Incorrect. Temperature doesn't control response length — that's determined by max_tokens or stop sequences. It only controls how the model selects each individual token."
  ]
},
{
  id: "lf13", topic: "LLM Fundamentals", pageId: "kp_decoding",
  question: "What advantage does top-p (nucleus sampling) have over top-k sampling?",
  options: [
    "Top-p is computationally cheaper",
    "Top-p adapts the candidate pool size based on model confidence",
    "Top-p guarantees grammatically correct output",
    "Top-p works without needing a temperature parameter"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Top-p requires sorting and cumulative sum operations — if anything it's marginally more expensive than a simple top-k cutoff.",
    "Correct. Top-p dynamically adjusts how many tokens are in the sampling pool. When the model is confident (one token has 95% probability), the nucleus is just 1-2 tokens. When uncertain (flat distribution), it might include 100+ tokens. Top-k always uses exactly k tokens regardless of confidence, which is either too restrictive or too loose depending on context.",
    "Incorrect. Neither top-p nor top-k guarantee grammatical correctness. They're sampling strategies, not grammar checkers.",
    "Incorrect. Top-p is typically used alongside temperature — they address different aspects of the sampling process. Temperature shapes the distribution; top-p truncates it."
  ]
},
{
  id: "lf14", topic: "LLM Fundamentals", pageId: "kp_scaling",
  question: "According to the Chinchilla scaling laws, a 70B parameter model should be trained on approximately how many tokens?",
  options: [
    "70 billion tokens (1:1 ratio)",
    "700 billion tokens (10:1 ratio)",
    "1.4 trillion tokens (20:1 ratio)",
    "7 trillion tokens (100:1 ratio)"
  ],
  correct: 2,
  explanation: [
    "Incorrect. A 1:1 ratio massively undertrained the model. Early models like GPT-3 (175B params, 300B tokens ~1.7:1) were undertrained by Chinchilla standards.",
    "Incorrect. 10:1 is still below optimal. The Chinchilla finding specifically showed that previous practice significantly under-trained models.",
    "Correct. The Chinchilla paper showed compute-optimal training uses ~20 tokens per parameter. 70B × 20 = 1.4T tokens. This finding reshaped the industry — Llama was trained on 1-1.4T tokens following this principle, and smaller well-trained models started outperforming larger undertrained ones.",
    "Incorrect. 100:1 goes beyond Chinchilla-optimal into 'over-training' territory. While Llama-3 showed over-training can work (15T tokens for 8B-405B models), the Chinchilla-optimal ratio is 20:1."
  ]
},
{
  id: "lf15", topic: "LLM Fundamentals", pageId: "kp_scaling",
  question: "What did the Chinchilla paper demonstrate about GPT-3?",
  options: [
    "GPT-3 was too small for its training data",
    "GPT-3 was significantly undertrained relative to its model size",
    "GPT-3's architecture was fundamentally flawed",
    "GPT-3 needed more attention heads"
  ],
  correct: 1,
  explanation: [
    "Incorrect. The opposite — GPT-3 was too LARGE for its training data. It had 175B parameters but only saw 300B tokens (~1.7:1 ratio, far below the 20:1 Chinchilla optimal).",
    "Correct. GPT-3 (175B params) was trained on only 300B tokens — a ratio of ~1.7:1. Chinchilla showed the optimal is ~20:1. This means GPT-3 could have achieved similar performance with far fewer parameters if trained on much more data, or alternatively, a 175B model trained on 3.5T tokens would have been vastly better.",
    "Incorrect. The transformer architecture was fine. Chinchilla's insight was about compute allocation (model size vs. data quantity), not architecture.",
    "Incorrect. The number of attention heads is an architectural detail. Chinchilla's finding was about the high-level balance between model size and training data volume."
  ]
},
{
  id: "lf16", topic: "LLM Fundamentals", pageId: "kp_layernorm",
  question: "Why did modern LLMs switch from post-norm to pre-norm layer normalization?",
  options: [
    "Pre-norm produces better final model quality",
    "Pre-norm is computationally cheaper",
    "Pre-norm keeps the residual path clean, dramatically improving training stability at scale",
    "Pre-norm removes the need for learning rate warmup"
  ],
  correct: 2,
  explanation: [
    "Incorrect. Actually, post-norm can achieve marginally better final loss — IF you can get training to converge. The issue is that post-norm is much harder to train stably at large scales.",
    "Incorrect. The computational cost of LayerNorm is the same regardless of placement. The benefit is about training dynamics, not speed.",
    "Correct. In pre-norm, the residual path is x + Sublayer(Norm(x)) — the addition has no normalization in its way, so gradients flow cleanly through the network. In post-norm, Norm(x + Sublayer(x)) puts normalization ON the residual path, making deep gradient flow unstable. This matters enormously at the scale of modern LLMs (dozens to hundreds of layers).",
    "Incorrect. Pre-norm still benefits from learning rate warmup — it just makes training less likely to diverge catastrophically without it. It reduces fragility but doesn't eliminate the need for standard training practices."
  ]
},
{
  id: "lf17", topic: "LLM Fundamentals", pageId: "kp_context_window",
  question: "What is the 'lost in the middle' phenomenon in long-context LLMs?",
  options: [
    "Models lose coherence after generating too many tokens",
    "Models attend poorly to information placed in the middle of long contexts, favoring start and end",
    "Models forget their system prompt when the conversation gets too long",
    "Models produce hallucinations when the context is half-full"
  ],
  correct: 1,
  explanation: [
    "Incorrect. That describes a different issue (degeneration). 'Lost in the middle' is specifically about retrieval/attention over the input context, not about output quality degradation.",
    "Correct. Research shows that when relevant information is placed in the middle of a long context (vs. beginning or end), model performance significantly drops. Models have a U-shaped attention pattern — strong at start (primacy) and end (recency), weak in the middle. This directly impacts RAG system design: put critical information early or late in the prompt.",
    "Incorrect. System prompt 'forgetting' is a related but different issue about instruction-following degradation. 'Lost in the middle' is specifically about factual retrieval from different positions in context.",
    "Incorrect. 'Lost in the middle' has nothing to do with context utilization percentage. It's about positional bias in attention patterns regardless of how full the context is."
  ]
},
{
  id: "lf18", topic: "LLM Fundamentals", pageId: "kp_foundation_models",
  question: "What key architectural innovation did Mistral-7B introduce that helped it compete with much larger models?",
  options: [
    "Mixture of Experts routing",
    "Sliding window attention combined with Grouped-Query Attention (GQA)",
    "A novel tokenizer with 128k vocabulary",
    "Reinforcement learning from human feedback during pre-training"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Mixture of Experts was introduced later with Mixtral-8x7B. The original Mistral-7B was a dense model.",
    "Correct. Mistral-7B used sliding window attention (each token attends to only the local window of ~4096 previous tokens in lower layers, with higher layers building on this) + GQA (shared K/V heads across query heads for memory efficiency). These innovations made it faster and more memory-efficient while maintaining quality that rivaled Llama-2-13B (a model nearly 2× its size).",
    "Incorrect. While tokenizer design matters, Mistral's competitive advantage came from architectural choices in attention, not vocabulary design.",
    "Incorrect. RLHF is a post-training alignment technique, not used during pre-training. Mistral-7B's advantage was in efficient architecture design."
  ]
},
{
  id: "lf19", topic: "LLM Fundamentals", pageId: "kp_foundation_models",
  question: "What distinguishes open-weight models (Llama, Mistral) from open-source models?",
  options: [
    "There is no difference — they are the same thing",
    "Open-weight means weights are available but training code/data may not be; open-source means everything is public",
    "Open-weight models are smaller; open-source models are larger",
    "Open-weight models require a license fee; open-source models are free"
  ],
  correct: 1,
  explanation: [
    "Incorrect. There's an important legal and practical distinction that matters when choosing models for production.",
    "Correct. Open-weight models release the trained model parameters so you can run them, fine-tune them, and deploy them — but may not release training data, training code, or data preprocessing pipelines. True open-source (like OLMo from AI2) releases everything: code, data, training logs, checkpoints. Most 'open' LLMs (Llama, Mistral) are technically open-weight with restrictive licenses.",
    "Incorrect. Size has nothing to do with the open-weight vs open-source distinction. Llama-405B is open-weight and massive.",
    "Incorrect. Both can be free to use. The difference is about what artifacts are shared (just weights vs. entire reproduction recipe), not pricing."
  ]
},
{
  id: "lf20", topic: "LLM Fundamentals", pageId: "kp_decoding",
  question: "When building a system that extracts structured data (JSON) from text, which decoding settings are most appropriate?",
  options: [
    "High temperature (1.5) with top-p 0.95 for maximum creativity",
    "Low temperature (0-0.2) with structured output mode",
    "Top-k=100 with no temperature modification",
    "Beam search with 5 beams"
  ],
  correct: 1,
  explanation: [
    "Incorrect. High temperature introduces randomness — the opposite of what you want for structured extraction. You'd get malformed JSON, hallucinated fields, and inconsistent outputs.",
    "Correct. Structured data extraction needs determinism and precision. Low temperature (or 0) ensures the model picks the most confident tokens. Structured output mode (JSON mode, guided generation) additionally constrains output to valid JSON. This combination maximizes reliability for extraction tasks.",
    "Incorrect. Top-k=100 still allows substantial randomness. For structured extraction, you want minimal variance in output. The model should commit to its best interpretation, not explore alternatives.",
    "Incorrect. Beam search is better for translation-like tasks where you want the single most probable complete sequence. For API-based extraction, temperature=0 achieves determinism more simply, and beam search isn't available in most LLM APIs."
  ]
},
// === DOMAIN 2: PRE-TRAINING ===
{
  id: "pt1", topic: "Pre-training & Data", pageId: "kp_pretraining_objectives",
  question: "What is the training objective for decoder-only models like GPT and Llama?",
  options: [
    "Masked language modeling — predict randomly masked tokens",
    "Next-token prediction — predict the token that follows the sequence so far",
    "Contrastive learning — distinguish similar from dissimilar sequences",
    "Denoising — reconstruct corrupted input sequences"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Masked Language Modeling (MLM) is BERT's objective (encoder-only). It sees all tokens and predicts masked ones — this requires bidirectional attention which decoder-only models don't have.",
    "Correct. Decoder-only models use causal language modeling: given tokens 1...n, predict token n+1. The model sees the sequence left-to-right (causal mask) and is trained with cross-entropy loss against the actual next token. This simple objective, at scale, teaches the model grammar, facts, reasoning, and more.",
    "Incorrect. Contrastive learning is used for embedding models (CLIP, sentence-transformers), not for pre-training generative LLMs.",
    "Incorrect. Denoising is used by encoder-decoder models like T5 (which corrupts spans of text and reconstructs them). Decoder-only models use the simpler next-token prediction."
  ]
},
{
  id: "pt2", topic: "Pre-training & Data", pageId: "kp_pretraining_objectives",
  question: "Why is next-token prediction considered such a powerful training objective?",
  options: [
    "It's the cheapest objective to compute",
    "To predict well, the model must implicitly learn grammar, facts, reasoning, and world knowledge",
    "It directly optimizes for human preferences",
    "It forces the model to memorize the entire training set"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Next-token prediction isn't especially cheap — the cost comes from scale (trillions of tokens, billions of parameters). Other objectives have similar per-step cost.",
    "Correct. Predicting the next token requires understanding context at every level: syntax (what's grammatical), semantics (what makes sense), pragmatics (what's likely given the topic), and world knowledge (what's factually true). It's a universal compression task — to predict well is to understand well.",
    "Incorrect. Next-token prediction optimizes for predicting training data, NOT human preferences. That's what RLHF/DPO adds later — aligning the model with what humans actually want.",
    "Incorrect. Models don't memorize everything — they learn compressed representations and generalizable patterns. A 7B parameter model trained on 1T tokens clearly can't memorize 1T tokens of text; it must compress and generalize."
  ]
},
{
  id: "pt3", topic: "Pre-training & Data", pageId: "kp_distributed_training",
  question: "In distributed training, what is tensor parallelism?",
  options: [
    "Each GPU processes a different mini-batch of data",
    "Individual layer computations are split across multiple GPUs",
    "Different layers of the model are placed on different GPUs",
    "Multiple complete copies of the model train on different data shards"
  ],
  correct: 1,
  explanation: [
    "Incorrect. That's data parallelism — each GPU has the full model and processes different data. Simple but requires each GPU to hold the entire model.",
    "Correct. Tensor parallelism splits the matrices within a single layer. For example, a large matrix multiplication is divided so each GPU computes part of the output. Requires very fast interconnects (NVLink) because GPUs must communicate within every single forward and backward pass.",
    "Incorrect. That's pipeline parallelism — GPU 1 handles layers 1-10, GPU 2 handles 11-20, etc. Like an assembly line where each GPU is a station.",
    "Incorrect. That describes data parallelism. The key distinction: tensor parallelism splits WITHIN a layer (the computation itself), not across layers or across data."
  ]
},
{
  id: "pt4", topic: "Pre-training & Data", pageId: "kp_deepspeed_zero",
  question: "In DeepSpeed ZeRO, what consumes the most GPU memory per parameter during Adam optimization?",
  options: [
    "The model weights themselves (2 bytes in FP16)",
    "The gradients (2 bytes in FP16)",
    "The optimizer states — momentum, variance, and FP32 weight copy (~12 bytes total)",
    "The activations stored for backpropagation"
  ],
  correct: 2,
  explanation: [
    "Incorrect. Model weights in FP16 use 2 bytes per parameter — significant but not the largest consumer.",
    "Incorrect. Gradients in FP16 use 2 bytes per parameter. They're the same size as the weights.",
    "Correct. Adam optimizer stores: (1) FP32 copy of weights (4 bytes), (2) first moment/momentum (4 bytes), (3) second moment/variance (4 bytes) = 12 bytes per parameter. For a 7B model, that's 84GB just for optimizer states! This is why ZeRO is so important — it partitions these massive states across GPUs.",
    "Incorrect. Activations can be large but are typically handled by gradient checkpointing (recompute instead of store). The persistent memory hog is the optimizer state, which must exist for the entire training run."
  ]
},
{
  id: "pt5", topic: "Pre-training & Data", pageId: "kp_mixed_precision",
  question: "Why is BF16 preferred over FP16 for LLM training?",
  options: [
    "BF16 uses less memory than FP16",
    "BF16 has the same dynamic range as FP32, so it doesn't need loss scaling",
    "BF16 is faster on all GPU types",
    "BF16 produces more accurate results than FP16"
  ],
  correct: 1,
  explanation: [
    "Incorrect. BF16 and FP16 are both 16-bit — exactly the same memory footprint. The bits are just allocated differently (more exponent bits in BF16, more mantissa bits in FP16).",
    "Correct. BF16 uses 8 exponent bits (same as FP32) giving it the same dynamic range (~10³⁸). FP16 only has 5 exponent bits (max ~65504), which causes overflow during training and requires loss scaling as a workaround. BF16 eliminates this headache while keeping the 2× memory savings.",
    "Incorrect. BF16 requires hardware support (A100+ GPUs, TPUs). Older GPUs don't support it natively. Speed is similar to FP16 on supported hardware.",
    "Incorrect. BF16 actually has LESS precision (fewer mantissa bits) than FP16. The tradeoff: less precision but more range. The range matters more for training stability, which is why BF16 is preferred."
  ]
},
// === DOMAIN 3: FINE-TUNING ===
{
  id: "ft1", topic: "Fine-tuning & Alignment", pageId: "kp_lora",
  question: "In LoRA, what does the rank (r) hyperparameter control?",
  options: [
    "The number of layers that receive adapters",
    "The learning rate for the adapter matrices",
    "The capacity of the adapter — how many parameters it adds and how expressive it is",
    "The number of training epochs"
  ],
  correct: 2,
  explanation: [
    "Incorrect. Which layers get LoRA adapters is configured separately (target_modules). The rank applies within each adapter, not to which layers have adapters.",
    "Incorrect. Learning rate is a separate training hyperparameter. Rank defines the adapter's structure, not how fast it learns.",
    "Correct. Rank determines the inner dimension of the two adapter matrices A (d×r) and B (r×d). Higher rank = more parameters = more capacity to learn task-specific adjustments. r=16 adds ~0.5% extra parameters to a typical layer; r=64 adds ~2%. The tradeoff: higher rank can learn more complex adaptations but risks overfitting with limited data.",
    "Incorrect. Training epochs are independent of LoRA architecture. Rank defines the adapter's size, not how long you train it."
  ]
},
{
  id: "ft2", topic: "Fine-tuning & Alignment", pageId: "kp_lora",
  question: "What happens to LoRA adapters at inference time?",
  options: [
    "They run as a separate forward pass after the base model",
    "They are merged into the base weights (W + A×B), adding zero latency",
    "They replace the original weights entirely",
    "They are discarded — only the modified base weights are kept"
  ],
  correct: 1,
  explanation: [
    "Incorrect. LoRA doesn't require a separate forward pass. The adapters can be seamlessly combined with the base model.",
    "Correct. Since LoRA computes W×x + (A×B)×x = (W + A×B)×x, you can pre-compute W_merged = W + A×B and use it directly. This means zero additional inference latency — the merged model is the same size and speed as the original. You can also keep them separate to hot-swap different LoRA adapters for different tasks.",
    "Incorrect. The original weights are preserved — LoRA adds to them, doesn't replace them. This is what makes it so flexible: one base model + multiple task-specific adapters.",
    "Incorrect. The adapters contain the task-specific learning. Discarding them would lose all the fine-tuning. They're either merged in or kept for hot-swapping."
  ]
},
{
  id: "ft3", topic: "Fine-tuning & Alignment", pageId: "kp_qlora",
  question: "What is QLoRA's key innovation for making fine-tuning memory-efficient?",
  options: [
    "Using smaller batch sizes during training",
    "Keeping the base model in 4-bit while training LoRA adapters in 16-bit",
    "Reducing the number of transformer layers",
    "Training only the final layer of the model"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Smaller batch sizes reduce memory somewhat but aren't QLoRA's innovation. You'd still need to hold the full FP16 model in memory.",
    "Correct. QLoRA's insight: the frozen base model doesn't need full precision — you only compute forward passes through it, never update it. So quantize it to 4-bit (NF4 format), saving ~4× memory. But the LoRA adapters that DO get gradient updates stay in BF16 for training accuracy. This lets you fine-tune a 65B model on a single 48GB GPU.",
    "Incorrect. QLoRA doesn't modify the architecture. It changes the precision of the frozen base, not the model structure.",
    "Incorrect. QLoRA still applies adapters to multiple layers (typically all attention layers). Training only the final layer would severely limit what can be learned."
  ]
},
{
  id: "ft4", topic: "Fine-tuning & Alignment", pageId: "kp_rlhf",
  question: "In RLHF, what is the role of the reward model?",
  options: [
    "It generates training data for the LLM",
    "It scores LLM outputs based on learned human preferences",
    "It filters harmful content from model responses",
    "It determines the optimal learning rate schedule"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Training data comes from demonstrations (SFT stage) and human comparisons (reward model training). The reward model scores, it doesn't generate.",
    "Correct. The reward model is trained on human comparison data (which of two outputs is better?) and learns to assign scalar scores that predict human preference. During PPO training, the LLM generates responses, the reward model scores them, and the LLM is updated to produce higher-scoring outputs.",
    "Incorrect. While reward models implicitly learn some safety preferences, that's not their primary design purpose. Content filtering is typically a separate system. The reward model's job is to predict overall quality as judged by human raters.",
    "Incorrect. Learning rate scheduling is a standard optimization decision unrelated to reward modeling. The reward model is about WHAT to optimize for (human preferences), not HOW fast to optimize."
  ]
},
{
  id: "ft5", topic: "Fine-tuning & Alignment", pageId: "kp_dpo",
  question: "What is the main advantage of DPO over RLHF?",
  options: [
    "DPO produces higher quality models",
    "DPO eliminates the need for preference data",
    "DPO skips the reward model and RL loop — it's simpler, more stable, and easier to implement",
    "DPO works without any fine-tuning data"
  ],
  correct: 2,
  explanation: [
    "Incorrect. Quality comparisons are mixed — some tasks favor DPO, others favor RLHF. DPO's advantage is in simplicity and stability, not necessarily final quality.",
    "Incorrect. DPO still needs preference pairs (chosen vs rejected responses). It just uses them differently — directly as a training signal rather than through a separate reward model.",
    "Correct. DPO mathematically derives the closed-form solution of the RLHF objective and turns it into a supervised loss function. No reward model to train, no PPO instability, no RL hyperparameter tuning. Just standard supervised training on preference pairs. Much simpler pipeline with comparable results.",
    "Incorrect. DPO requires preference data (pairs of preferred/dispreferred outputs). Without this data, it has nothing to optimize against."
  ]
},
{
  id: "ft6", topic: "Fine-tuning & Alignment", pageId: "kp_when_to_finetune",
  question: "A company has a well-working GPT-4 prompt for their task but wants to reduce costs. What's the most appropriate approach?",
  options: [
    "Immediately fine-tune GPT-4 on their data",
    "Fine-tune a smaller open model to replicate the GPT-4 behavior, using GPT-4 outputs as training data",
    "Switch to a random smaller model without any adaptation",
    "Increase the temperature to generate more tokens per call"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Fine-tuning GPT-4 is expensive and may not reduce per-query costs significantly (you'd still pay for fine-tuned GPT-4 inference). Also, you can't fine-tune GPT-4 in most cases.",
    "Correct. This is 'model distillation' for cost reduction: use the expensive model to generate high-quality training data, then fine-tune a smaller model to replicate its behavior. A fine-tuned Llama-8B or Mistral-7B can often achieve 80-90% of GPT-4 quality on a specific task at a fraction of the cost.",
    "Incorrect. Switching without adaptation would likely degrade quality significantly. The smaller model needs to be taught the specific task behavior.",
    "Incorrect. Higher temperature = more randomness, not lower cost. Cost is determined by input + output tokens, not temperature. This would likely produce worse results AND similar cost."
  ]
},
// === DOMAIN 4: PROMPT ENGINEERING ===
{
  id: "pe1", topic: "Prompt Engineering", pageId: "kp_cot",
  question: "Why does Chain-of-Thought prompting improve LLM reasoning accuracy?",
  options: [
    "It activates a special reasoning module in the model",
    "It gives the model intermediate tokens that serve as working memory for multi-step computation",
    "It slows down generation, allowing more computation per token",
    "It forces the model to access its training data more carefully"
  ],
  correct: 1,
  explanation: [
    "Incorrect. LLMs don't have separate modules — they're a single neural network. CoT doesn't activate anything special; it changes the generation pattern.",
    "Correct. Without CoT, the model must 'jump' from question to answer in effectively one step (the answer token). With CoT, each reasoning token is a computation step — the model can decompose the problem, track intermediate results, and build toward the answer incrementally. The generated text IS the working memory.",
    "Incorrect. Generation speed per token is fixed (one forward pass per token regardless of content). CoT produces MORE tokens, but each token takes the same time to generate.",
    "Incorrect. LLMs don't 'access training data' at inference — they use learned parameters. CoT helps by decomposing the computation, not by changing how the model uses its weights."
  ]
},
{
  id: "pe2", topic: "Prompt Engineering", pageId: "kp_cot",
  question: "What is 'self-consistency' in the context of Chain-of-Thought prompting?",
  options: [
    "Ensuring the model doesn't contradict itself within a single response",
    "Generating multiple reasoning paths and taking the majority vote on the final answer",
    "Verifying the output against the input for logical consistency",
    "Training the model to always give the same answer to the same question"
  ],
  correct: 1,
  explanation: [
    "Incorrect. That's coherence checking, which is different. Self-consistency is a specific technique that uses multiple samples.",
    "Correct. Self-consistency generates N different CoT reasoning chains (using temperature > 0 for diversity), extracts the final answer from each, then picks the answer that appears most often. Different reasoning paths may make different errors, but the correct answer tends to be most frequent. Trades compute cost for accuracy.",
    "Incorrect. That's more like output validation. Self-consistency is specifically about sampling multiple paths and voting.",
    "Incorrect. Models are inherently stochastic (with temperature > 0). Self-consistency embraces this stochasticity by sampling multiple times and aggregating, rather than trying to eliminate variation."
  ]
},
{
  id: "pe3", topic: "Prompt Engineering", pageId: "kp_react",
  question: "What problem does ReAct solve that pure Chain-of-Thought cannot?",
  options: [
    "ReAct is faster than CoT",
    "ReAct grounds reasoning in real information by allowing the model to use tools and look things up",
    "ReAct requires less prompt engineering",
    "ReAct works with smaller models where CoT fails"
  ],
  correct: 1,
  explanation: [
    "Incorrect. ReAct is actually slower — it involves multiple LLM calls and tool executions. The advantage is accuracy, not speed.",
    "Correct. Pure CoT reasons from the model's memory, which can be wrong, outdated, or hallucinated. ReAct lets the model pause reasoning to take actions (search, calculate, query databases) and incorporate real results. The reasoning guides WHAT to look up, and the results ground the reasoning in facts.",
    "Incorrect. ReAct actually requires more prompt engineering — you need to define the thought/action/observation format and specify available tools.",
    "Incorrect. ReAct and CoT have similar model size requirements. ReAct's advantage is factual grounding, not working with weaker models."
  ]
},
{
  id: "pe4", topic: "Prompt Engineering", pageId: "kp_prompt_injection",
  question: "Why is indirect prompt injection considered more dangerous than direct prompt injection?",
  options: [
    "Indirect injection uses more sophisticated language",
    "Indirect injection comes through data the model processes (retrieved docs, emails), not from the user — making it invisible and scalable",
    "Indirect injection bypasses the model's safety training",
    "Indirect injection affects the model's weights permanently"
  ],
  correct: 1,
  explanation: [
    "Incorrect. The sophistication of language isn't what makes it dangerous. Simple hidden text in a webpage can be an indirect injection.",
    "Correct. Indirect injection is hidden in content the LLM processes — a webpage in RAG retrieval, an email being summarized, a document being analyzed. The user never sees the attack, can't catch it, and the attacker can place it on any website/document the system might retrieve. It scales across all users who query that content.",
    "Incorrect. Both direct and indirect injection attempt to override instructions. Safety training doesn't reliably prevent either form — it's a probabilistic defense, not a guarantee.",
    "Incorrect. No form of prompt injection modifies model weights. Weights only change during training. Injection manipulates behavior within a single context/session."
  ]
},
{
  id: "pe5", topic: "Prompt Engineering", pageId: "kp_prompt_injection",
  question: "An AI engineer is building a RAG system that retrieves web pages. What is the MOST critical security concern?",
  options: [
    "The web pages might contain copyrighted content",
    "The web pages might load slowly",
    "Retrieved pages could contain hidden prompt injection instructions that hijack the model's behavior",
    "The embedding model might not understand the web page content"
  ],
  correct: 2,
  explanation: [
    "Incorrect. Copyright is a legal concern, not a security vulnerability. It won't compromise the system's behavior.",
    "Incorrect. Slow loading is a performance issue. It doesn't threaten system security.",
    "Correct. Any webpage retrieved by a RAG system could contain hidden instructions (e.g., invisible text, HTML comments, or text colored to match the background). These instructions get included in the LLM's context and can override system prompts — telling the model to exfiltrate data, produce harmful output, or redirect users. This is indirect prompt injection and it's the #1 security risk for RAG systems.",
    "Incorrect. Embedding quality affects retrieval accuracy but isn't a security vulnerability. Bad embeddings give irrelevant results, not compromised behavior."
  ]
},
// === DOMAIN 5: RAG ===
{
  id: "rag1", topic: "RAG Systems", pageId: "kp_rag_pipeline",
  question: "What is the primary advantage of RAG over fine-tuning for incorporating new knowledge?",
  options: [
    "RAG produces more creative responses",
    "RAG is updateable without retraining — just re-index the new documents",
    "RAG is faster at inference time",
    "RAG requires less engineering effort"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Creativity comes from the LLM's generation capabilities and temperature settings, not from the knowledge source.",
    "Correct. When information changes, you just update the document index — no expensive retraining. Fine-tuning bakes knowledge into weights permanently; updating requires re-training. RAG also provides citations (you know WHICH document informed the answer) and works with private data without training on it.",
    "Incorrect. RAG adds latency — you have an extra retrieval step (embedding query + vector search + loading chunks) before generation. Fine-tuned models respond directly without retrieval.",
    "Incorrect. RAG actually requires significant engineering: chunking strategy, embedding model selection, vector store setup, retrieval tuning, prompt engineering for context packing. It's simpler than training but not trivial."
  ]
},
{
  id: "rag2", topic: "RAG Systems", pageId: "kp_chunking",
  question: "A developer's RAG system returns irrelevant passages. The chunks are 2000 tokens each. What's the likely problem?",
  options: [
    "The embedding model is too small",
    "Chunks are too large — they contain multiple topics, diluting the embedding's specificity",
    "The vector database needs more indexing",
    "The LLM needs a larger context window"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Embedding model size affects quality but isn't the likely culprit when chunks are 2000 tokens. Even a good embedding model can't create a precise vector for a chunk covering 5 different topics.",
    "Correct. At 2000 tokens, a single chunk likely covers multiple topics. Its embedding becomes an average of all those topics — matching none of them well. When a user asks a specific question, the diluted embedding won't score highly for any particular topic. Solution: reduce to 256-512 tokens so each chunk covers one coherent concept.",
    "Incorrect. Indexing structure (IVF, HNSW) affects search speed, not relevance. If the underlying embeddings are diluted by oversized chunks, no indexing strategy fixes that.",
    "Incorrect. Context window size determines how many chunks you can pack into the prompt. But if retrieval returns irrelevant chunks, a larger window just means more irrelevant context — garbage in, garbage out."
  ]
},
{
  id: "rag3", topic: "RAG Systems", pageId: "kp_chunking",
  question: "What is the purpose of chunk overlap in a RAG indexing pipeline?",
  options: [
    "To increase the total number of chunks for better coverage",
    "To ensure information at chunk boundaries isn't lost when a concept spans two chunks",
    "To improve embedding model accuracy",
    "To reduce storage requirements through deduplication"
  ],
  correct: 1,
  explanation: [
    "Incorrect. More chunks isn't the goal — better retrieval is. Overlap ensures boundary information is captured, not that you have more chunks to search through.",
    "Correct. If a key concept spans a chunk boundary (split right in the middle of an explanation), neither chunk captures the full concept. Overlap (typically 10-20%) means the end of chunk N overlaps with the start of chunk N+1, so boundary-spanning information appears in at least one chunk completely.",
    "Incorrect. Embedding model accuracy is determined by the model architecture and training, not by chunk overlap. Overlap affects what text is available to embed.",
    "Incorrect. Overlap actually INCREASES storage (some text is indexed multiple times). It's a tradeoff: more storage for better retrieval coverage at boundaries."
  ]
},
{
  id: "rag4", topic: "RAG Systems", pageId: "kp_advanced_rag",
  question: "What does HyDE (Hypothetical Document Embedding) do to improve retrieval?",
  options: [
    "It generates synthetic training data for the embedding model",
    "It asks the LLM to generate a hypothetical answer, then uses THAT embedding for retrieval",
    "It creates hyperlinks between related documents",
    "It applies dynamic pricing to API calls based on query complexity"
  ],
  correct: 1,
  explanation: [
    "Incorrect. HyDE doesn't retrain anything. It's a query-time technique that improves the search query representation.",
    "Correct. User queries are short and stylistically different from documents ('How does X work?' vs a paragraph explaining X). HyDE bridges this gap: the LLM generates a hypothetical answer (which is document-like in style and length), then this fake answer is embedded and used for retrieval. The fake answer's embedding is closer in vector space to the real relevant documents than the original short query would be.",
    "Incorrect. Hyperlinking is a different concept (more related to Graph RAG). HyDE is about improving the query representation for vector search.",
    "Incorrect. HyDE has nothing to do with pricing or API management. It's a retrieval technique for improving query-document matching."
  ]
},
{
  id: "rag5", topic: "RAG Systems", pageId: "kp_advanced_rag",
  question: "In a two-stage retrieval system, what is the role of re-ranking?",
  options: [
    "To sort results alphabetically",
    "To reduce the total number of API calls",
    "To use a more expensive cross-encoder model to precisely score relevance after fast initial retrieval",
    "To remove duplicate results from the initial retrieval"
  ],
  correct: 2,
  explanation: [
    "Incorrect. Alphabetical sorting has nothing to do with relevance ranking.",
    "Incorrect. Re-ranking adds computation (another model inference). It doesn't reduce API calls — it adds a processing step for better accuracy.",
    "Correct. Stage 1: vector search retrieves top-50 candidates quickly (bi-encoder, independent embeddings). Stage 2: a cross-encoder jointly processes (query, document) pairs to compute a precise relevance score. Cross-encoders are much more accurate (they see query and doc together) but too slow to run on the full index — so you use fast retrieval for recall, then re-ranking for precision.",
    "Incorrect. Deduplication is a separate concern. Re-ranking is specifically about using a more accurate model to reorder results by true relevance."
  ]
},
// === DOMAIN 6: AGENTS ===
{
  id: "ag1", topic: "AI Agents & Tool Use", pageId: "kp_agents",
  question: "What distinguishes an AI agent from a standard LLM API call?",
  options: [
    "Agents use larger models",
    "Agents operate in a loop — they can take actions, observe results, and decide next steps autonomously",
    "Agents are always multi-modal",
    "Agents don't require prompts"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Agent capability comes from the architecture (loop + tools), not model size. A 7B model in an agent loop can be more capable at tasks than a 70B model in a single call.",
    "Correct. The defining feature of an agent is the autonomous loop: observe → think → act → observe result → think again → act again. Standard API calls are one-shot (input → output). Agents iterate until the task is complete, handling errors and adapting their approach based on intermediate results.",
    "Incorrect. Agents can use text-only models. Multi-modal capabilities are orthogonal to agency — you can have text-only agents and non-agentic multi-modal models.",
    "Incorrect. Agents absolutely require prompts — usually more complex ones that define available tools, expected behavior, and output format for tool calls."
  ]
},
{
  id: "ag2", topic: "AI Agents & Tool Use", pageId: "kp_agents",
  question: "When should you use an agent architecture instead of a simple prompt chain?",
  options: [
    "Always — agents are strictly superior to chains",
    "When the number of steps is unknown in advance and the path depends on intermediate results",
    "Only when you need to process images",
    "When you want to reduce API costs"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Agents add complexity, latency, and cost. For fixed workflows with predictable steps, a simple chain is better — more reliable, faster, cheaper, easier to debug.",
    "Correct. Agents shine when you can't predict the path upfront: debugging (depends on what error you find), research (depends on search results), complex data tasks (depends on what data looks like). If the workflow is always 'do A then B then C', just chain them — no agent needed.",
    "Incorrect. Image processing doesn't require agents. A single multi-modal LLM call handles images fine. Agents are about iterative decision-making, not modality.",
    "Incorrect. Agents typically INCREASE costs because they make multiple LLM calls in a loop. They solve capability problems, not cost problems."
  ]
},
{
  id: "ag3", topic: "AI Agents & Tool Use", pageId: "kp_mcp",
  question: "What problem does the Model Context Protocol (MCP) solve?",
  options: [
    "It makes LLMs generate faster",
    "It standardizes how LLM applications connect to tools, preventing N×M integration complexity",
    "It encrypts communication between the user and the LLM",
    "It compresses the context window to fit more tokens"
  ],
  correct: 1,
  explanation: [
    "Incorrect. MCP doesn't affect generation speed. It's about tool connectivity, not inference performance.",
    "Correct. Before MCP, every tool needed custom integration with every LLM platform (N tools × M platforms = N×M work). MCP provides one standard interface: build a tool as an MCP server once, and it works with any MCP-compatible host (Claude, IDEs, custom apps). Like USB standardized peripheral connections.",
    "Incorrect. MCP isn't about encryption or security. It's a protocol for tool discovery and invocation, not communication security.",
    "Incorrect. MCP doesn't modify the context window or compress anything. It standardizes how tools are exposed to and called by LLM applications."
  ]
},
{
  id: "ag4", topic: "AI Agents & Tool Use", pageId: "kp_mcp",
  question: "In the MCP architecture, what does an MCP Server expose?",
  options: [
    "GPU compute resources for model inference",
    "Tools (callable functions), Resources (readable data), and Prompts (templates)",
    "Model weights and configuration files",
    "User authentication credentials"
  ],
  correct: 1,
  explanation: [
    "Incorrect. MCP servers expose capabilities for LLM apps, not compute infrastructure. Model inference happens elsewhere.",
    "Correct. MCP servers provide three types of capabilities: (1) Tools — functions the LLM can invoke with specific arguments and get results, (2) Resources — data the LLM can read (files, database views), and (3) Prompts — pre-built prompt templates for specific workflows. The LLM host discovers and uses these through the standardized protocol.",
    "Incorrect. Model weights are not part of MCP. MCP connects LLM applications to external tools and data, not to other models.",
    "Incorrect. MCP doesn't handle authentication credentials. Security and auth are handled at the transport layer, not exposed as MCP primitives."
  ]
},
// === DOMAIN 7: EVALUATION ===
{
  id: "ev1", topic: "Evaluation & Benchmarking", pageId: "kp_eval",
  question: "Why is perplexity alone insufficient for evaluating whether an LLM is a good assistant?",
  options: [
    "Perplexity can't be computed for large models",
    "Perplexity measures language modeling quality but doesn't predict task performance or helpfulness",
    "Perplexity only works for English text",
    "Perplexity requires too much compute to calculate"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Perplexity can be computed for any autoregressive model regardless of size. It's just the exponentiated average cross-entropy loss.",
    "Correct. A model with lower perplexity is better at predicting text — but that doesn't mean it follows instructions better, gives more helpful answers, or is safer. A model trained on toxic content could have excellent perplexity on a toxic test set. Perplexity measures 'how good is this language model?' not 'how good is this assistant?'",
    "Incorrect. Perplexity works for any language with a tokenizer. It's language-agnostic as a metric.",
    "Incorrect. Perplexity is actually quite cheap to compute — just a forward pass over the test set. It's cheaper than generation-based evaluation."
  ]
},
{
  id: "ev2", topic: "Evaluation & Benchmarking", pageId: "kp_eval",
  question: "What is the main risk of relying solely on benchmark scores (like MMLU) to choose a model?",
  options: [
    "Benchmarks are too easy for modern models",
    "Models may be contaminated — trained on benchmark data — giving inflated scores without real capability",
    "Benchmarks only test English",
    "Benchmark scores change too frequently to be useful"
  ],
  correct: 1,
  explanation: [
    "Incorrect. While benchmark saturation is a concern for some tests, many benchmarks still differentiate models. The real issue is whether scores reflect genuine capability.",
    "Correct. Contamination (benchmark data leaking into training data) means a model might score 90% on MMLU by memorizing answers, not by understanding the concepts. This is widespread — popular benchmarks get scraped into training data or models are specifically optimized for them. Always validate on YOUR task, not just benchmarks.",
    "Incorrect. Many benchmarks are multilingual. The concern isn't language coverage but whether high scores reflect real capabilities.",
    "Incorrect. Benchmark scores for a given model are stable. The issue isn't instability but whether they measure what matters for your use case."
  ]
},
// === DOMAIN 8: INFERENCE & QUANTIZATION ===
{
  id: "io1", topic: "Inference & Quantization", pageId: "kp_kvcache",
  question: "What does the KV-cache store and why?",
  options: [
    "The model's weights in a compressed format for faster loading",
    "Previously computed Key and Value vectors so they don't need to be recomputed at each generation step",
    "The user's conversation history in a database",
    "Cached API responses to avoid redundant calls"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Model weights are loaded once and stay in GPU memory. KV-cache is about intermediate computations during generation, not weight storage.",
    "Correct. During autoregressive generation, computing attention for token N requires K and V from all tokens 1 to N-1. Without caching, you'd recompute all these from scratch at every step. KV-cache stores them so each token's K/V is computed exactly once. The tradeoff: significant memory usage (grows linearly with sequence length × layers).",
    "Incorrect. KV-cache is a GPU memory optimization for inference, not a conversation database. It exists only during a single generation session.",
    "Incorrect. KV-cache is internal to model inference, not about external API calls. It's a GPU-memory-level optimization."
  ]
},
{
  id: "io2", topic: "Inference & Quantization", pageId: "kp_kvcache",
  question: "What does Grouped-Query Attention (GQA) do to reduce KV-cache memory?",
  options: [
    "It reduces the number of layers in the model",
    "It shares Key/Value heads across groups of Query heads, reducing the number of K/V vectors stored",
    "It compresses the KV-cache using quantization",
    "It limits the context length the model can attend to"
  ],
  correct: 1,
  explanation: [
    "Incorrect. GQA doesn't change the number of layers. It modifies the attention mechanism within each layer.",
    "Correct. In standard multi-head attention, each head has its own Q, K, and V. With 32 heads, you store 32 K/V pairs per token per layer. GQA uses fewer K/V heads (e.g., 8) shared across groups of Q heads (4 Q heads per K/V head group). This reduces KV-cache by 4× while maintaining most of the quality — the Q heads still have independent queries but share the K/V representations.",
    "Incorrect. KV-cache quantization exists as a separate technique, but GQA is architecturally different — it reduces the NUMBER of K/V heads rather than their precision.",
    "Incorrect. GQA doesn't limit context length. It makes any given context length use less memory, enabling LONGER contexts within the same memory budget."
  ]
},
{
  id: "io3", topic: "Inference & Quantization", pageId: "kp_flash_attention",
  question: "Flash Attention achieves its speedup primarily by:",
  options: [
    "Approximating the attention computation to reduce FLOPs",
    "Avoiding materializing the full N×N attention matrix in slow GPU HBM by computing in SRAM tiles",
    "Using a smaller model for attention computation",
    "Skipping attention for tokens that are far apart"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Flash Attention is EXACT — it computes the same mathematical result as standard attention. The speedup comes from memory access patterns, not from approximation.",
    "Correct. Standard attention writes the full N×N matrix to HBM (slow GPU memory), then reads it back. Flash Attention computes attention in small tiles that fit in SRAM (fast on-chip cache), never materializing the full matrix. Since attention is memory-bound (not compute-bound), reducing memory traffic gives 2-4× speedup.",
    "Incorrect. Flash Attention doesn't use a different model. It's a computation reorganization that produces identical results from the same model.",
    "Incorrect. That would be sparse attention (a different technique). Flash Attention computes ALL attention pairs — it just organizes the computation to minimize memory transfers."
  ]
},
{
  id: "io4", topic: "Inference & Quantization", pageId: "kp_quantization",
  question: "A 70B parameter model in FP16 requires ~140GB of GPU memory. Approximately how much would it need in 4-bit quantization?",
  options: [
    "~70GB (2× reduction)",
    "~35GB (4× reduction)",
    "~17.5GB (8× reduction)",
    "~10GB (14× reduction)"
  ],
  correct: 1,
  explanation: [
    "Incorrect. 2× reduction would be going from FP16 to INT8. FP16 uses 2 bytes per parameter; INT8 uses 1 byte.",
    "Correct. FP16 = 2 bytes/param → 140GB. 4-bit = 0.5 bytes/param → 35GB. That's a 4× reduction. In practice it's slightly more than 35GB due to quantization metadata (scaling factors, zero-points) stored alongside the quantized weights, but ~35GB is the right ballpark.",
    "Incorrect. 8× would require 2-bit quantization, which exists but severely degrades quality. Standard 4-bit gives 4× reduction from FP16.",
    "Incorrect. This would require less than 2 bits per parameter, which isn't practical for maintaining model quality."
  ]
},
{
  id: "io5", topic: "Inference & Quantization", pageId: "kp_quantization",
  question: "What is AWQ's key insight compared to standard uniform quantization?",
  options: [
    "It uses a larger vocabulary to compensate for precision loss",
    "It identifies that ~1% of weight channels disproportionately affect outputs and preserves them at higher precision",
    "It only quantizes the first half of the model",
    "It retrains the model from scratch at lower precision"
  ],
  correct: 1,
  explanation: [
    "Incorrect. AWQ doesn't modify the vocabulary or tokenizer. It's purely about weight quantization strategy.",
    "Correct. AWQ (Activation-Aware Quantization) observes that a small fraction of weight channels correspond to high activation magnitudes and contribute disproportionately to output quality. By identifying these 'salient' channels and handling them more carefully (per-channel scaling), AWQ achieves better quality than uniform quantization methods that treat all channels equally.",
    "Incorrect. AWQ quantizes the entire model. Selectively quantizing layers would leave half the model at full size, defeating the purpose.",
    "Incorrect. AWQ is post-training quantization — no retraining required. That's its advantage: take any trained model and quantize it efficiently."
  ]
},
// === DOMAIN 9: EMBEDDINGS ===
{
  id: "em1", topic: "Embeddings & Vector Search", pageId: "kp_embeddings",
  question: "Why are contextual embeddings (sentence-transformers) preferred over static word embeddings (Word2Vec) for RAG systems?",
  options: [
    "They produce smaller vectors",
    "They capture meaning based on surrounding context — same word gets different embeddings in different sentences",
    "They're faster to compute",
    "They don't require a GPU"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Contextual embeddings typically produce larger vectors (768-1536 dims) than static word embeddings (100-300 dims).",
    "Correct. Static embeddings give 'bank' the same vector whether it means riverbank or financial institution. Contextual models produce different embeddings based on the surrounding sentence, capturing the actual intended meaning. For RAG, this means searching for 'bank account issues' won't retrieve documents about riverbanks.",
    "Incorrect. Contextual embeddings require running a neural network over the full text — much slower than looking up a pre-computed static vector.",
    "Incorrect. While some contextual models can run on CPU, they're much faster on GPU. Static embeddings are simpler but less capable."
  ]
},
{
  id: "em2", topic: "Embeddings & Vector Search", pageId: "kp_embeddings",
  question: "What does the MTEB (Massive Text Embedding Benchmark) leaderboard help you decide?",
  options: [
    "Which LLM to use for text generation",
    "Which embedding model to use for your specific retrieval/similarity task",
    "How much GPU memory you need",
    "Which vector database to choose"
  ],
  correct: 1,
  explanation: [
    "Incorrect. MTEB evaluates embedding models, not generative LLMs. These serve different purposes (representation vs generation).",
    "Correct. MTEB evaluates embedding models across multiple tasks: retrieval, similarity, classification, clustering. It helps you choose the right embedding model based on your specific needs — some models excel at retrieval but are mediocre at classification. Check the task-specific scores, not just the overall average.",
    "Incorrect. MTEB doesn't report memory requirements. It benchmarks embedding quality across tasks.",
    "Incorrect. MTEB evaluates embedding models, not vector databases. The database choice depends on scale, features, and infrastructure — separate from which embedding model you use."
  ]
},
// === DOMAIN 10: DEPLOYMENT ===
{
  id: "dp1", topic: "Deployment & MLOps", pageId: "kp_serving",
  question: "What is PagedAttention (vLLM's key innovation)?",
  options: [
    "A new attention algorithm that's mathematically different from standard attention",
    "Managing KV-cache memory like OS virtual memory pages — eliminating fragmentation and enabling efficient batching",
    "Splitting attention computation across multiple pages of the model",
    "A pagination system for displaying long model outputs"
  ],
  correct: 1,
  explanation: [
    "Incorrect. PagedAttention computes standard attention — the mathematical result is the same. The innovation is in memory management, not the attention algorithm.",
    "Correct. In standard serving, each request pre-allocates a contiguous block of memory for its KV-cache (sized for max possible length), wasting huge amounts of memory. PagedAttention stores KV-cache in non-contiguous memory pages, allocated on-demand as the sequence grows. Like how OS virtual memory eliminates physical memory fragmentation. This typically improves throughput by 2-4× by serving more concurrent requests.",
    "Incorrect. PagedAttention doesn't split the attention computation. It optimizes how the KV-cache (attention's memory) is stored and managed.",
    "Incorrect. PagedAttention has nothing to do with output display. It's a GPU memory management technique internal to the serving engine."
  ]
},
{
  id: "dp2", topic: "Deployment & MLOps", pageId: "kp_serving",
  question: "A startup wants to serve a fine-tuned Llama-8B model with minimal operational overhead. Which option is most appropriate?",
  options: [
    "Build a custom serving infrastructure from scratch",
    "Deploy with vLLM behind a load balancer for production scale",
    "Use Ollama for quick deployment with basic API compatibility",
    "Use llama.cpp for maximum performance"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Building custom serving infrastructure is massive engineering effort with no benefit over existing solutions. Only giant companies (Google, Meta) do this.",
    "Correct. vLLM provides production-grade serving with PagedAttention, continuous batching, streaming, and API compatibility (OpenAI-format endpoints). Behind a load balancer, it handles production traffic reliably. Minimal ops: just configure the model, run the server, put a load balancer in front.",
    "Incorrect. Ollama is great for local development but isn't designed for production scale. It lacks production features like continuous batching, advanced memory management, and horizontal scaling.",
    "Incorrect. llama.cpp is for CPU inference and edge deployment. For a production service with GPUs, vLLM is significantly faster and more feature-rich."
  ]
},
// === DOMAIN 11: MULTIMODAL ===
{
  id: "mm1", topic: "Multimodal AI", pageId: "kp_clip",
  question: "How does CLIP enable 'zero-shot' image classification?",
  options: [
    "It was trained on every possible category of image",
    "You describe categories in text, embed them, and find which text embedding is closest to the image embedding",
    "It generates text descriptions of images, then classifies the text",
    "It uses reinforcement learning to discover new categories"
  ],
  correct: 1,
  explanation: [
    "Incorrect. No model can be trained on every possible category. Zero-shot means classifying into categories NOT seen during training.",
    "Correct. Since CLIP maps images and text into the same embedding space, you can: (1) embed the image, (2) embed text descriptions of each possible category ('a photo of a dog', 'a photo of a cat'), (3) find which text embedding has the highest cosine similarity to the image embedding. No category-specific training needed — just describe the categories in language.",
    "Incorrect. That would be image captioning followed by text classification — a two-step process that's slower and less accurate. CLIP directly compares embeddings.",
    "Incorrect. CLIP uses contrastive learning (supervised on image-text pairs), not reinforcement learning. Zero-shot ability emerges from the shared embedding space, not from exploration."
  ]
},
{
  id: "mm2", topic: "Multimodal AI", pageId: "kp_clip",
  question: "In Stable Diffusion's architecture, what role does CLIP play?",
  options: [
    "It generates the final image pixels",
    "It encodes the text prompt into an embedding that guides the diffusion process",
    "It evaluates the quality of generated images",
    "It stores previously generated images for retrieval"
  ],
  correct: 1,
  explanation: [
    "Incorrect. The U-Net (or transformer) + VAE decoder generate the pixels through iterative denoising. CLIP doesn't generate images.",
    "Correct. CLIP's text encoder converts your text prompt into a dense embedding that represents the semantic content. This embedding conditions the diffusion model — telling it WHAT to generate at each denoising step. Without CLIP's text encoding, the model would have no understanding of what your text prompt means.",
    "Incorrect. While CLIP-based metrics (like CLIPScore) exist for evaluation, within Stable Diffusion's pipeline, CLIP serves as the text encoder, not the evaluator.",
    "Incorrect. Stable Diffusion generates images from noise — it doesn't retrieve stored images. CLIP's role is encoding the text condition, not storage."
  ]
},
// === DOMAIN 12: SECURITY ===
{
  id: "ss1", topic: "Security & Safety", pageId: "kp_owasp_llm",
  question: "According to OWASP's LLM Top 10, what should you ALWAYS do with LLM output before using it in your application?",
  options: [
    "Cache it for 24 hours to check for consistency",
    "Treat it as untrusted input and validate/sanitize it before rendering or executing",
    "Run it through another LLM for quality checking",
    "Log it to a database before displaying to users"
  ],
  correct: 1,
  explanation: [
    "Incorrect. Caching doesn't address security. A consistently dangerous output cached for 24 hours is still dangerous.",
    "Correct. LLM output can contain: malicious code (XSS if rendered as HTML), SQL injection strings (if used in queries), command injection (if used in shell commands), or manipulated content (from prompt injection). Treat it EXACTLY like untrusted user input: escape HTML, parameterize queries, validate formats. The LLM is not a trusted component.",
    "Incorrect. Another LLM as a checker can help but isn't a security guarantee — it can also be manipulated. Proper input validation and output sanitization are fundamental, not optional.",
    "Incorrect. Logging is good for observability but doesn't prevent security vulnerabilities. You need to sanitize BEFORE the output reaches the user or any other system."
  ]
},
{
  id: "ss2", topic: "Security & Safety", pageId: "kp_owasp_llm",
  question: "An AI agent has access to a database and a code executor. What's the most critical security principle to apply?",
  options: [
    "Use the most capable model available",
    "Least privilege — give the agent only the minimum permissions needed, never full database or system access",
    "Run the agent on the fastest hardware for quicker responses",
    "Log all agent actions to a monitoring dashboard"
  ],
  correct: 1,
  explanation: [
    "Incorrect. A more capable model doesn't prevent security issues. In fact, more capable models may be more susceptible to sophisticated prompt injection because they follow instructions better.",
    "Correct. If a prompt injection compromises the agent, the blast radius is limited to what the agent can access. Read-only database access, sandboxed code execution, no access to production systems, no ability to send emails or make payments without human approval. Assume the agent WILL be compromised and limit the damage.",
    "Incorrect. Hardware speed is a performance concern, not security. Fast execution of a compromised agent just means faster damage.",
    "Incorrect. Logging is important for detection and forensics but doesn't PREVENT attacks. Least privilege prevents damage even when an attack succeeds. You need both, but prevention (least privilege) is more critical than detection (logging)."
  ]
}
];
