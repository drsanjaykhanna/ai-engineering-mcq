#!/bin/bash
# Pulls AI Engineering from Scratch (MIT licensed) into your app as a reference book
# Run once: bash build-reference.sh
# Then commit and push to update the app

set -e

echo "Cloning AI Engineering from Scratch..."
rm -rf /tmp/aie-build
git clone --depth 1 https://github.com/rohitg00/ai-engineering-from-scratch.git /tmp/aie-build 2>/dev/null

echo "Converting lessons to app format..."
python3 << 'PYEOF'
import os, re

phases = [
    ("07-transformers-deep-dive", "Transformers Deep Dive"),
    ("10-llms-from-scratch", "LLMs from Scratch"),
    ("11-llm-engineering", "LLM Engineering"),
    ("13-tools-and-protocols", "Tools & Protocols"),
    ("14-agent-engineering", "Agent Engineering"),
    ("15-autonomous-systems", "Autonomous Systems"),
    ("16-multi-agent-and-swarms", "Multi-Agent & Swarms"),
    ("17-infrastructure-and-production", "Infrastructure & Production"),
    ("18-ethics-safety-alignment", "Ethics, Safety & Alignment"),
]

base = "/tmp/aie-build/phases"
chapters = []

for phase_dir, phase_title in phases:
    phase_path = os.path.join(base, phase_dir)
    if not os.path.exists(phase_path):
        continue
    lessons = sorted([d for d in os.listdir(phase_path) if os.path.isdir(os.path.join(phase_path, d)) and d[0].isdigit()])
    for lesson_dir in lessons:
        doc_path = os.path.join(phase_path, lesson_dir, "docs", "en.md")
        if not os.path.exists(doc_path):
            continue
        with open(doc_path, 'r') as f:
            md = f.read()
        title_match = re.match(r'#\s+(.+)', md)
        title = title_match.group(1) if title_match else lesson_dir.replace('-', ' ').title()
        h = md
        h = re.sub(r'^#### (.+)$', r'<h4>\1</h4>', h, flags=re.MULTILINE)
        h = re.sub(r'^### (.+)$', r'<h3>\1</h3>', h, flags=re.MULTILINE)
        h = re.sub(r'^## (.+)$', r'<h2>\1</h2>', h, flags=re.MULTILINE)
        h = re.sub(r'^# (.+)$', r'<h2>\1</h2>', h, flags=re.MULTILINE)
        h = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', h)
        h = re.sub(r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)', r'<em>\1</em>', h)
        h = re.sub(r'`([^`\n]+?)`', r'<code>\1</code>', h)
        def code_block(m):
            code = m.group(1).replace('<', '&lt;').replace('>', '&gt;')
            return f'<pre>{code}</pre>'
        h = re.sub(r'```[a-z]*\n(.*?)```', code_block, h, flags=re.DOTALL)
        h = re.sub(r'^> (.+)$', r'<blockquote>\1</blockquote>', h, flags=re.MULTILINE)
        h = re.sub(r'^- (.+)$', r'<li>\1</li>', h, flags=re.MULTILINE)
        h = re.sub(r'^\d+\. (.+)$', r'<li>\1</li>', h, flags=re.MULTILINE)
        lines = h.split('\n')
        out = []
        in_pre = False
        for line in lines:
            if '<pre>' in line: in_pre = True
            if '</pre>' in line: in_pre = False
            if in_pre:
                out.append(line)
            elif line.strip() == '':
                out.append('')
            elif not line.strip().startswith('<') and not line.strip().startswith('|'):
                out.append(f'<p>{line}</p>')
            else:
                out.append(line)
        h = '\n'.join(out)
        h = h.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        title = title.replace('`', "'").replace('\\', '')
        chapters.append((phase_title, lesson_dir, title, h))

script_dir = os.path.dirname(os.path.abspath("__file__"))
out_path = os.path.join(os.getcwd(), "reference.js")
with open(out_path, 'w') as f:
    f.write('// AI Engineering from Scratch by Rohit Ghumare (MIT License)\n')
    f.write('// https://github.com/rohitg00/ai-engineering-from-scratch\n')
    f.write('const REFERENCE_BOOK = [\n')
    for i, (phase, lesson, title, content) in enumerate(chapters):
        f.write('{\n')
        f.write(f'  phase: \`{phase}\`,\n')
        f.write(f'  lesson: \`{lesson}\`,\n')
        f.write(f'  title: \`{title}\`,\n')
        f.write(f'  content: \`{content}\`\n')
        f.write('}')
        if i < len(chapters)-1: f.write(',')
        f.write('\n')
    f.write('];\n')

print(f"Done: {len(chapters)} chapters, {os.path.getsize(out_path)/1024:.0f} KB")
PYEOF

rm -rf /tmp/aie-build
echo ""
echo "reference.js created. Now commit and push:"
echo "  git add reference.js && git commit -m 'Add reference book' && git push"
