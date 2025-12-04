'use client';

import React, { useMemo, useState, useEffect } from 'react';

export type BrandingInputs = {
  businessName: string;
  industry: string;
  targetAudience: string;
  differentiator: string;
  brandPersonality: string; // comma-separated adjectives
  competitors: string; // comma-separated list (1–3)
  researchInsight?: string; // optional
  optionalLogoIdeas?: string; // optional free text
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
};

interface BrandingKitModalProps {
  isOpen: boolean;
  problemText?: string; // from Idea Title per spec
  solutionText?: string; // from Proposed Solution (or blurb fallback)
  defaultBusinessName?: string;
  onClose: () => void;
}

const baseInstruction = "";

// Default brand colors used when the user has not changed selectors
const DEFAULT_COLORS = {
  primary: '#403f3e',
  secondary: '#f2e8dc',
  accent: '#E6B800',
};

// Local helpers for color normalization and comparison
const ensureHashLocal = (v: string) => (v.startsWith('#') ? v : `#${v}`);
const normalizeHexLocal = (v?: string, fallback?: string) => {
  const raw = (v ?? '').trim();
  if (!raw) return fallback ? ensureHashLocal(fallback).toLowerCase() : undefined;
  const withHash = ensureHashLocal(raw);
  return withHash.toLowerCase();
};
const stripHashLower = (v?: string) => (v ?? '').replace(/^#/, '').toLowerCase();

function inferInsightIfEmpty(industry: string, audience: string): string {
  // Simple heuristic placeholder to comply with spec when researchInsight is empty
  if (!industry && !audience) return '';
  const a = audience ? audience.trim() : 'the target audience';
  const i = industry ? industry.trim() : 'this industry';
  return `Potential insight: In ${i}, ${a} often face fragmented offerings and unclear value propositions; they respond to clear positioning and trust signals.`;
}

function buildPrompts(problemText: string, solutionText: string, inputs: BrandingInputs, colorsModified?: boolean) {
  // Normalize arrays
  const personality = inputs.brandPersonality
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const competitors = inputs.competitors
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const maybeInsight = inputs.researchInsight && inputs.researchInsight.trim().length > 0
    ? inputs.researchInsight.trim()
    : inferInsightIfEmpty(inputs.industry, inputs.targetAudience);

  // Shared context block
  const ctx: Record<string, unknown> = {
    problem: problemText,
    proposed_solution: solutionText,
    business_name: inputs.businessName,
    industry: inputs.industry,
    target_audience: inputs.targetAudience,
    key_differentiator: inputs.differentiator,
    brand_personality_adjectives: personality,
    competitors,
    research_insight: maybeInsight || undefined,
  };

  // Include user-selected colors only if they modified the selectors
  if (colorsModified) {
    ctx['brand_colors'] = {
      primary: normalizeHexLocal(inputs.primaryColor, DEFAULT_COLORS.primary),
      secondary: normalizeHexLocal(inputs.secondaryColor, DEFAULT_COLORS.secondary),
      accent: normalizeHexLocal(inputs.accentColor, DEFAULT_COLORS.accent),
    };
  }

  const flatPrompt = [
    `${baseInstruction}`,
    'Context:',
    `Problem: ${ctx.problem}`,
    `Proposed Solution: ${ctx.proposed_solution}`,
    'Collected Inputs:',
    `- Business Name: ${ctx.business_name}`,
    `- Industry: ${ctx.industry}`,
    `- Target Audience: ${ctx.target_audience}`,
    `- Key Differentiator: ${ctx.key_differentiator}`,
    `- Brand Personality Adjectives: ${(ctx.brand_personality_adjectives as string[]).join(', ') || 'N/A'}`,
    `- Competitors: ${(ctx.competitors as string[]).join(', ') || 'N/A'}`,
    `- Research Insight: ${ctx.research_insight ?? 'N/A'}`,
    colorsModified ? `- Brand Colors: primary=${normalizeHexLocal(inputs.primaryColor, DEFAULT_COLORS.primary)}, secondary=${normalizeHexLocal(inputs.secondaryColor, DEFAULT_COLORS.secondary)}, accent=${normalizeHexLocal(inputs.accentColor, DEFAULT_COLORS.accent)}` : null,
    inputs.optionalLogoIdeas?.trim() ? `- Optional Logo Ideas: ${inputs.optionalLogoIdeas.trim()}` : null,
    'Task:',
    'Generate Brand Strategy and Logo & Visual deliverables following these schemas:',
    '- Brand Strategy: market & competitor research; positioning statement; audience profile; UVP; personality traits.',
    '- Logo & Visuals: produce a single inline SVG logo (no code fences, no prose), a color palette with HEX and accessibility notes, and visual style guidelines.',
    'Return JSON only, strictly following the schemas as in Brand Strategy and Logo & Visuals prompts. No extra commentary.'
  ].filter(Boolean).join('\n');

  const flatSummaryPrompt = [
    `${baseInstruction}`,
    'Context:',
    `Problem: ${ctx.problem}`,
    `Proposed Solution: ${ctx.proposed_solution}`,
    'Collected Inputs:',
    `- Business Name: ${ctx.business_name}`,
    `- Industry: ${ctx.industry}`,
    `- Target Audience: ${ctx.target_audience}`,
    `- Key Differentiator: ${ctx.key_differentiator}`,
    `- Brand Personality Adjectives: ${(ctx.brand_personality_adjectives as string[]).join(', ') || 'N/A'}`,
    `- Competitors: ${(ctx.competitors as string[]).join(', ') || 'N/A'}`,
    `- Research Insight: ${ctx.research_insight ?? 'N/A'}`,
    colorsModified ? `- Brand Colors: primary=${normalizeHexLocal(inputs.primaryColor, DEFAULT_COLORS.primary)}, secondary=${normalizeHexLocal(inputs.secondaryColor, DEFAULT_COLORS.secondary)}, accent=${normalizeHexLocal(inputs.accentColor, DEFAULT_COLORS.accent)}` : null,
    inputs.optionalLogoIdeas?.trim() ? `- Optional Logo Ideas: ${inputs.optionalLogoIdeas.trim()}` : null,
    'Task:',
    'Produce a concise plain-text branding summary with clear sections:',
    '- Market & Competitor Insights: 3–5 bullets summarizing key dynamics and gaps.',
    '- Brand Positioning Statement: 1–2 sentences.',
    '- Target Audience Profile: demographics (brief), psychographics (bullets), core needs (bullets), buying triggers (bullets).',
    '- Unique Value Proposition: one clear sentence (<= 25 words).',
    '- Brand Personality: 3–5 traits with one-line rationale each.',
    '- Logo Concept & Visual Direction: 1–2 directions with rationale. Also, generate a single inline SVG logo based on the provided context and visual direction. The SVG should be the raw SVG code, without any surrounding text or explanation.',
    '- Color Palette Suggestions: 5–7 HEX with usage notes and accessibility considerations.',
    '- Visual Style Guidelines: imagery, iconography, typography suggestions, layout/spacing, do/don\'t (bullets).',
    'If anything is ambiguous, ask clarifying questions first, then proceed after I answer.',
    'Output: plain text only. No JSON. No code fences, except for the SVG logo.'
  ].filter(Boolean).join('\n');

  // New: Plain-English Brand Strategy prompt (no JSON)
  const flatBrandStrategyPrompt = [
    'Context:',
    `Problem: ${ctx.problem}`,
    `Proposed Solution: ${ctx.proposed_solution}`,
    'Collected Inputs:',
    `- Business Name: ${ctx.business_name}`,
    `- Industry: ${ctx.industry}`,
    `- Target Audience: ${ctx.target_audience}`,
    `- Key Differentiator: ${ctx.key_differentiator}`,
    `- Brand Personality Adjectives: ${(ctx.brand_personality_adjectives as string[]).join(', ') || 'N/A'}`,
    `- Competitors: ${(ctx.competitors as string[]).join(', ') || 'N/A'}`,
    `- Research Insight: ${ctx.research_insight ?? 'N/A'}`,
    colorsModified ? `- Brand Colors: primary=${normalizeHexLocal(inputs.primaryColor, DEFAULT_COLORS.primary)}, secondary=${normalizeHexLocal(inputs.secondaryColor, DEFAULT_COLORS.secondary)}, accent=${normalizeHexLocal(inputs.accentColor, DEFAULT_COLORS.accent)}` : null,
    'Task:',
    'Create a brand strategy in plain English with the following sections:',
    '- Market & Competitor Insights: 3–5 bullet points identifying key dynamics, gaps, and opportunities.',
    '- Brand Positioning Statement: 1–2 sentences clearly stating who we serve, what we offer, and why it\'s different.',
    '- Target Audience Profile: brief demographics, psychographics (bulleted), core needs (bulleted), and buying triggers (bulleted).',
    '- Unique Value Proposition (UVP): one clear sentence (<= 25 words).',
    '- Brand Personality: 3–5 traits with a one-line rationale for each.',
    'If anything is ambiguous, ask clarifying questions first, then proceed after I answer.',
    'Output: plain text only. No JSON. No code fences.'
  ].filter(Boolean).join('\n');

  // New: Plain-English Logo Concepts prompt requesting 8–10 diverse concepts
  const flatLogoConceptsPrompt = [
    'I need to create a logo for the following brand. Here\'s the context:',
    `Brand Name: ${ctx.business_name}`,
    `Industry/Category: ${ctx.industry}`,
    `Target Audience: ${ctx.target_audience}`,
    `Unique Value Proposition: ${ctx.key_differentiator}`,
    `Brand Personality: ${(ctx.brand_personality_adjectives as string[]).join(', ') || 'N/A'}`,
    inputs.competitors?.length ? `Competitors: ${(ctx.competitors as string[]).join(', ')}` : null,
    inputs.optionalLogoIdeas?.trim() ? `Optional Logo Ideas or constraints: ${inputs.optionalLogoIdeas.trim()}` : null,
    colorsModified ? `Preferred Brand Colors: primary=${normalizeHexLocal(inputs.primaryColor, DEFAULT_COLORS.primary)}, secondary=${normalizeHexLocal(inputs.secondaryColor, DEFAULT_COLORS.secondary)}, accent=${normalizeHexLocal(inputs.accentColor, DEFAULT_COLORS.accent)}` : null,
    '',
    'Please generate 8–10 diverse logo concepts that reflect this brand identity, including a mix of:',
    '- Wordmarks (text-only)',
    '- Logomarks (symbol-only)',
    '- Combination marks (text + symbol)',
    '- A range of stylistic approaches (e.g., modern, classic, playful, minimal, geometric)',
    '',
    'For each concept, provide:',
    '- A short name or label (e.g., \'Shield Check\', \'Monogram\', \'Linked Arrows\')',
    '- A brief rationale explaining how it connects to the brand personality and appeals to the target audience',
    '- Optional minimal shape/style notes (useful for icon/logo generation)',
    '',
    'Output: plain text only. No JSON. No code fences. No SVG markup.'
  ].filter(Boolean).join('\n');

  return {
    meta: {
      created_with: 'Branding Kit (MVP)',
      timestamp: new Date().toISOString(),
      instruction_preface: baseInstruction,
    },
    context: ctx,
    prompts: {
      plain_brand_strategy_prompt: flatBrandStrategyPrompt,
      flat_logo_concepts_prompt: flatLogoConceptsPrompt,
      brand_strategy: {
        market_and_competitor_research: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            'Task: Analyze the market landscape, customer segments, and competitor positioning. Identify 3–5 actionable insights and summarize competitor strengths/weaknesses.',
            'Output: Return JSON {"insights": string[], "segments": [{"name": string, "needs": string[]}], "competitor_summary": [{"name": string, "strengths": string[], "weaknesses": string[]}], "risks": string[]} with no extra commentary.',
          ].join('\n'),
        },
        brand_positioning_statement: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            maybeInsight ? `Additional insight: ${maybeInsight}` : 'If researchInsight is not provided, infer a plausible insight based on the industry and audience.',
            'Task: Craft a concise positioning statement in one or two sentences that clearly communicates who we serve, what we offer, and why we are different.',
            'Output: Return JSON {"positioning_statement": string}',
          ].join('\n'),
        },
        target_audience_profile: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            'Task: Define a target audience profile including demographics, psychographics, core needs, and buying triggers.',
            'Output: Return JSON {"audience": {"demographics": {"age_range": string, "location": string, "income_level": string}, "psychographics": string[], "core_needs": string[], "buying_triggers": string[]}}',
          ].join('\n'),
        },
        unique_value_proposition: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            'Task: Write a single clear Unique Value Proposition sentence (no more than 25 words).',
            'Output: Return JSON {"unique_value_proposition": string}',
          ].join('\n'),
        },
        brand_personality_traits: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            'Task: Select 3–5 personality traits (adjectives) that best represent the brand, and provide a short rationale for each.',
            'Output: Return JSON {"traits": [{"trait": string, "rationale": string}]}' ,
          ].join('\n'),
        },
      },
      logo_and_visuals: {
        logo_creation: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            inputs.optionalLogoIdeas?.trim() ? `Logo ideas from user: ${inputs.optionalLogoIdeas.trim()}` : 'No specific logo ideas provided; propose 3 creative directions aligned with the brand personality.',
            'Task: Provide 3 logo concept directions with name, rationale, and minimal shape/style notes (suitable for icon/logo generators).',
            'Output: Return JSON {"directions": [{"name": string, "rationale": string, "style": {"shapes": string[], "vibe": string}}]}',
          ].join('\n'),
        },
        logo_svg: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            'Task: Generate ONE minimal, production-ready vector logo as inline SVG for the brand. Prefer a simple, scalable mark that works at small sizes. Include a wordmark only if clearly legible at 24px height; otherwise output symbol-only.',
            'Constraints:',
            '- Strictly output a single <svg> element and nothing else (no backticks, no explanations).',
            '- Viewbox 0 0 512 512; width="512" height="512".',
            '- Use basic shapes/paths; no external fonts, no images, no scripts.',
            '- Colors: If palette is provided, use primary and neutrals from context; otherwise default to monochrome (#111111 on transparent).',
            '- Accessibility: sufficient contrast; avoid overly thin strokes (<2).',
            'Recommendation: Choose a concept consistent with the brand personality (e.g., shield/check/link/arrow motifs).',
            'Output: Only the SVG markup. Do not include any prose, code fences, or comments.'
          ].join('\n'),
        },
        color_palette_development: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            'Task: Propose a 5–7 swatch color palette (primary, secondary, accents) with HEX codes and usage notes aligned to the brand personality. Include accessibility notes.',
            'Output: Return JSON {"palette": [{"name": string, "hex": string, "usage": string}], "accessibility_notes": string}',
          ].join('\n'),
        },
        visual_style_guidelines: {
          system: baseInstruction,
          user: [
            `Context: ${JSON.stringify(ctx)}`,
            'Task: Provide concise visual style guidelines covering: imagery style, iconography, typography suggestions, layout/spacing, and do/don\'t examples (min 3 each).',
            'Output: Return JSON {"imagery": string[], "iconography": string[], "typography": {"primary": string, "secondary": string}, "layout_spacing": string[], "do": string[], "dont": string[]}',
          ].join('\n'),
        },
      },
      master_prompt: {
        system: baseInstruction,
        user: [
          `Context: ${JSON.stringify(ctx)}`,
          'Task: Generate both Brand Strategy and Logo/Visual deliverables in one shot, adhering to the schemas specified for each sub-prompt above.',
          'Output: Return JSON {"brand_strategy_output": object, "logo_and_visuals_output": object} where each key follows the schemas defined for their corresponding prompts. No prose or commentary outside JSON.',
        ].join('\n'),
      },
    },
  };
}

const stepLabels = ['Context', 'Core Identity', 'Brand Assets', 'Review & Export'] as const;

type StepKey = typeof stepLabels[number];

const BrandingKitModal: React.FC<BrandingKitModalProps> = ({ isOpen, problemText, solutionText, defaultBusinessName, onClose }) => {
  const [step, setStep] = useState<number>(0);
  const [inputs, setInputs] = useState<BrandingInputs>({
    businessName: '',
    industry: '',
    targetAudience: '',
    differentiator: '',
    brandPersonality: '',
    competitors: '',
    researchInsight: '',
    optionalLogoIdeas: '',
    primaryColor: DEFAULT_COLORS.primary,
    secondaryColor: DEFAULT_COLORS.secondary,
    accentColor: DEFAULT_COLORS.accent,
  });
  const [generated, setGenerated] = useState<string>('');
  const [generatedObj, setGeneratedObj] = useState<Record<string, unknown> | null>(null);
  const [activePreview, setActivePreview] = useState<'brand' | 'logo'>('brand');
  const [showStep1Errors, setShowStep1Errors] = useState(false);
  const [showStep2Errors, setShowStep2Errors] = useState(false);

  // Auto-skip Context step if it is fully prefilled
  useEffect(() => {
    const hasProblem = typeof problemText === 'string' && problemText.trim().length > 0;
    const hasSolution = typeof solutionText === 'string' && solutionText.trim().length > 0;
    if (hasProblem && hasSolution) {
      setStep(1);
    }
  }, [problemText, solutionText]);

  const personalityCount = useMemo(() => {
    return inputs.brandPersonality
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0).length;
  }, [inputs.brandPersonality]);

  const canProceedStep1 = useMemo(() => {
    return (
      inputs.businessName.trim().length > 0 &&
      inputs.industry.trim().length > 0 &&
      inputs.targetAudience.trim().length > 0 &&
      inputs.differentiator.trim().length > 0 &&
      personalityCount >= 3
    );
  }, [inputs.businessName, inputs.industry, inputs.targetAudience, inputs.differentiator, personalityCount]);

  const canGenerate = useMemo(() => {
    return (
      inputs.businessName.trim().length > 0 &&
      inputs.industry.trim().length > 0 &&
      inputs.targetAudience.trim().length > 0 &&
      inputs.differentiator.trim().length > 0 &&
      inputs.competitors.trim().length > 0 &&
      personalityCount >= 3
    );
  }, [inputs.businessName, inputs.industry, inputs.targetAudience, inputs.differentiator, inputs.competitors, personalityCount]);

  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    // Determine if the user actually changed any color selector from defaults
    const primaryChanged = stripHashLower(inputs.primaryColor) !== stripHashLower(DEFAULT_COLORS.primary);
    const secondaryChanged = stripHashLower(inputs.secondaryColor) !== stripHashLower(DEFAULT_COLORS.secondary);
    const accentChanged = stripHashLower(inputs.accentColor) !== stripHashLower(DEFAULT_COLORS.accent);
    const colorsModified = !!(primaryChanged || secondaryChanged || accentChanged);

    const obj = buildPrompts(problemText || '', solutionText || '', inputs, colorsModified);
    setGenerated(JSON.stringify(obj, null, 2));
    setGeneratedObj(obj);
    setStep(3);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      alert('Branding Kit JSON copied to clipboard');
    } catch {
      alert('Copy failed');
    }
  };

  const copySection = async (data: Record<string, unknown>, label: string) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert(`${label} copied to clipboard`);
    } catch {
      alert('Copy failed');
    }
  };

  const copyText = async (text?: string, label?: string) => {
    if (!text) {
      alert('Nothing to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      alert(label ? `${label} copied to clipboard` : 'Copied to clipboard');
    } catch {
      alert('Copy failed');
    }
  };

  // Color helpers
  const isValidHex = (v: string) => /^#?[0-9a-fA-F]{6}$/.test(v.trim());
  const ensureHash = (v: string) => (v.startsWith('#') ? v : `#${v}`);
  const normalizeColor = (v?: string, fallback = '#000000') => (v && isValidHex(v) ? ensureHash(v) : fallback);

  const downloadJson = () => {
    const blob = new Blob([generated], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branding-kit-prompts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl mx-auto border rounded-[24px] shadow-lg"
        style={{ backgroundColor: '#fffaf3', borderColor: '#e8ddd0', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e8ddd0' }}>
          <div>
            <h3 className="text-xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
              Complete Branding Kit
            </h3>
            <p className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
              Step {step + 1} of {stepLabels.length}: {stepLabels[step]}
            </p>
          </div>
          <button
            className="px-3 py-1 rounded-full text-sm"
            onClick={onClose}
            style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e' }}
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 overflow-y-auto flex-1">
          {step === 0 && (
            <div>
              <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Context</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Problem</label>
                  <div className="mt-1 p-3 rounded-lg border" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>{problemText || 'Not provided'}</div>
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Proposed Solution</label>
                  <div className="mt-1 p-3 rounded-lg border" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>{solutionText || 'Not provided'}</div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Your Core Brand Identity</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Business Name</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    value={inputs.businessName}
                    onChange={(e) => setInputs((s) => ({ ...s, businessName: e.target.value }))}
                    placeholder="e.g., Idea title or your business name"
                  />
                  {showStep1Errors && inputs.businessName.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Business name is required.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Industry</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    value={inputs.industry}
                    onChange={(e) => setInputs((s) => ({ ...s, industry: e.target.value }))}
                    placeholder="e.g., Fintech, Healthtech"
                  />
                  {showStep1Errors && inputs.industry.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Industry is required.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Target Audience</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    value={inputs.targetAudience}
                    onChange={(e) => setInputs((s) => ({ ...s, targetAudience: e.target.value }))}
                    placeholder="e.g., SMB owners, Gen Z creators"
                  />
                  {showStep1Errors && inputs.targetAudience.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Target audience is required.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Key Differentiator</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    value={inputs.differentiator}
                    onChange={(e) => setInputs((s) => ({ ...s, differentiator: e.target.value }))}
                    placeholder="e.g., Faster onboarding, higher accuracy"
                  />
                  {showStep1Errors && inputs.differentiator.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Key differentiator is required.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Brand Personality (3–5 adjectives)</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    value={inputs.brandPersonality}
                    onChange={(e) => setInputs((s) => ({ ...s, brandPersonality: e.target.value }))}
                    placeholder="e.g., friendly, credible, bold"
                  />
                  <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: personalityCount < 3 ? '#8b0000' : '#666' }}>
                    {personalityCount < 3 ? 'Please provide at least 3 adjectives.' : `Adjectives: ${personalityCount} (max is soft)`}
                  </p>
                  <p className="text-[11px]" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                    Use commas between adjectives, e.g., &quot;modern, playful, trustworthy&quot;.
                  </p>
                  {showStep1Errors && personalityCount < 3 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Please enter at least 3 comma-separated adjectives.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Generate Your Brand Assets</h4>
              <div className="space-y-4">
                {/* Color pickers */}
                <div className="rounded-2xl border p-3" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>
                  <div className="text-sm mb-2" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Brand Colors</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Primary */}
                    <div>
                      <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Primary</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="color"
                          value={normalizeColor(inputs.primaryColor, '#403f3e')}
                          onChange={(e) => setInputs((s) => ({ ...s, primaryColor: e.target.value }))}
                          className="h-9 w-10 border rounded-md"
                          style={{ borderColor: '#e8ddd0' }}
                        />
                        <input
                          value={inputs.primaryColor ?? ''}
                          onChange={(e) => setInputs((s) => ({ ...s, primaryColor: e.target.value }))}
                          placeholder="#403f3e"
                          className="flex-1 h-9 px-2 rounded-md border text-sm"
                          style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                        />
                      </div>
                    </div>
                    {/* Secondary */}
                    <div>
                      <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Secondary</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="color"
                          value={normalizeColor(inputs.secondaryColor, '#f2e8dc')}
                          onChange={(e) => setInputs((s) => ({ ...s, secondaryColor: e.target.value }))}
                          className="h-9 w-10 border rounded-md"
                          style={{ borderColor: '#e8ddd0' }}
                        />
                        <input
                          value={inputs.secondaryColor ?? ''}
                          onChange={(e) => setInputs((s) => ({ ...s, secondaryColor: e.target.value }))}
                          placeholder="#f2e8dc"
                          className="flex-1 h-9 px-2 rounded-md border text-sm"
                          style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                        />
                      </div>
                    </div>
                    {/* Accent */}
                    <div>
                      <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Accent</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="color"
                          value={normalizeColor(inputs.accentColor, '#E6B800')}
                          onChange={(e) => setInputs((s) => ({ ...s, accentColor: e.target.value }))}
                          className="h-9 w-10 border rounded-md"
                          style={{ borderColor: '#e8ddd0' }}
                        />
                        <input
                          value={inputs.accentColor ?? ''}
                          onChange={(e) => setInputs((s) => ({ ...s, accentColor: e.target.value }))}
                          placeholder="#E6B800"
                          className="flex-1 h-9 px-2 rounded-md border text-sm"
                          style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* More visible preview of selected colors */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl h-16 border flex items-center justify-center" style={{ backgroundColor: normalizeHexLocal(inputs.primaryColor, DEFAULT_COLORS.primary), borderColor: '#e8ddd0' }}>
                      <span className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Primary</span>
                    </div>
                    <div className="rounded-xl h-16 border flex items-center justify-center" style={{ backgroundColor: normalizeHexLocal(inputs.secondaryColor, DEFAULT_COLORS.secondary), borderColor: '#e8ddd0' }}>
                      <span className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Secondary</span>
                    </div>
                    <div className="rounded-xl h-16 border flex items-center justify-center" style={{ backgroundColor: normalizeHexLocal(inputs.accentColor, DEFAULT_COLORS.accent), borderColor: '#e8ddd0' }}>
                      <span className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Accent</span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: '#e8ddd0' }}>
                    <div className="flex items-center gap-2">
                      <button className="h-9 px-3 rounded-md border" style={{ backgroundColor: normalizeHexLocal(inputs.primaryColor, DEFAULT_COLORS.primary), color: '#fff', borderColor: '#e8ddd0' }}>Primary</button>
                      <button className="h-9 px-3 rounded-md border" style={{ backgroundColor: normalizeHexLocal(inputs.secondaryColor, DEFAULT_COLORS.secondary), color: '#403f3e', borderColor: '#e8ddd0' }}>Secondary</button>
                      <button className="h-9 px-3 rounded-md border" style={{ backgroundColor: normalizeHexLocal(inputs.accentColor, DEFAULT_COLORS.accent), color: '#403f3e', borderColor: '#e8ddd0' }}>Accent</button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>You can pick a color or paste a HEX code (with or without #).</p>
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Competitors (1–3, comma-separated)</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    value={inputs.competitors}
                    onChange={(e) => setInputs((s) => ({ ...s, competitors: e.target.value }))}
                    placeholder="e.g., Competitor A, Competitor B"
                  />
                  {showStep2Errors && inputs.competitors.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Please list at least one competitor.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Research Insight (optional)</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    value={inputs.researchInsight}
                    onChange={(e) => setInputs((s) => ({ ...s, researchInsight: e.target.value }))}
                    placeholder="Leave empty to infer a plausible insight based on industry and audience"
                  />
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Optional Logo Ideas</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    value={inputs.optionalLogoIdeas}
                    onChange={(e) => setInputs((s) => ({ ...s, optionalLogoIdeas: e.target.value }))}
                    placeholder="Any ideas or constraints (symbols, shapes, themes)"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              {/* Clickable nav + preview + conditional copy */}
              {generatedObj && (
                <div className="mt-4">
                  <div className="flex gap-2 mb-2">
                    <button
                      className="px-3 py-2 rounded-full"
                      style={{ backgroundColor: activePreview === 'brand' ? '#e6dccf' : '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                      onClick={() => setActivePreview('brand')}
                    >
                      Brand Strategy
                    </button>
                    <button
                      className="px-3 py-2 rounded-full"
                      style={{ backgroundColor: activePreview === 'logo' ? '#e6dccf' : '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                      onClick={() => setActivePreview('logo')}
                    >
                      Logo Concepts
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={10}
                    className="w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                    value={
                      activePreview === 'brand' 
                        ? ((generatedObj as Record<string, unknown>)?.prompts as Record<string, unknown>)?.plain_brand_strategy_prompt as string || ''
                        : ((generatedObj as Record<string, unknown>)?.prompts as Record<string, unknown>)?.flat_logo_concepts_prompt as string || ''
                    }
                  />
                  <div className="mt-2">
                    {activePreview === 'brand' ? (
                      <button
                        className="px-4 py-2 rounded-full"
                        style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                        onClick={() => {
                          const prompts = (generatedObj as Record<string, unknown>)?.prompts as Record<string, unknown>;
                          const prompt = prompts?.plain_brand_strategy_prompt as string;
                          copyText(prompt, 'Brand Strategy prompt');
                        }}
                      >
                        Copy Brand Strategy Prompt
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 rounded-full"
                        style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                        onClick={() => {
                          const prompts = (generatedObj as Record<string, unknown>)?.prompts as Record<string, unknown>;
                          const prompt = prompts?.flat_logo_concepts_prompt as string;
                          copyText(prompt, 'Logo Concepts prompt');
                        }}
                      >
                        Copy Logo Concepts Prompt
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: '#e8ddd0' }}>
          <div className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
            {step < 3 ? 'Inputs are not persisted in this MVP' : 'Prompts generated with your inputs'}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && step < 3 && (
              <button
                className="px-3 py-2 rounded-full"
                style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </button>
            )}
            {step < 2 && (
              <button
                className="px-4 py-2 rounded-full text-white"
                style={{ backgroundColor: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                onClick={() => {
                  if (step === 1 && !canProceedStep1) {
                    setShowStep1Errors(true);
                    return;
                  }
                  setShowStep1Errors(false);
                  setStep((s) => Math.min(3, s + 1));
                }}
              >
                Next
              </button>
            )}
            {step === 2 && (
              <button
                className="px-4 py-2 rounded-full text-white disabled:opacity-60"
                style={{ backgroundColor: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                onClick={() => {
                  if (!canGenerate) {
                    setShowStep1Errors(true);
                    setShowStep2Errors(true);
                    return;
                  }
                  handleGenerate();
                }}
                disabled={!canGenerate}
              >
                Generate Prompt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingKitModal;