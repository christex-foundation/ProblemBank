'use client';

import React, { useMemo, useState, useEffect } from 'react';

interface PitchMasterKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemText?: string;
  solutionText?: string;
  allowEditing?: boolean;
}

// Part 1: The Core Story
type CoreStoryInputs = {
  companyName: string;
  targetAudience: string;
  problem: string;
  solution: string;
  keyBenefit: string;
  secretSauce: string;
};

// Part 2: The Opportunity
type OpportunityInputs = {
  problemEvidence: string;
  differentiation: string; // 3-5 ways, newline separated
  marketSize: string; // TAM, SAM, SOM with logic
};

// Part 3: The Business Engine
type BusinessEngineInputs = {
  businessModel: string;
  unitEconomics: string; // pricing, CAC, lifetime gross margin
  traction: string; // MRR, users, pilots, customer logos
  goToMarketStrategy: string;
};

// Part 4: The Future & The Ask
type FutureAskInputs = {
  productRoadmap: string; // 12-18 months milestones
  financialProjections: string; // 3-5 year summary
  fundingAsk: string; // how much money
  useOfFunds: string; // how will money be spent
};

// Part 5: The Team & Vision
type TeamVisionInputs = {
  teamMembers: string; // key members, roles, accomplishments
  closingVision: string; // grand one-line vision
};

type PitchDeckInputs = {
  coreStory: CoreStoryInputs;
  opportunity: OpportunityInputs;
  businessEngine: BusinessEngineInputs;
  futureAsk: FutureAskInputs;
  teamVision: TeamVisionInputs;
};

function normalizeList(value: string): string[] {
  return value
    .split(/\n/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function buildPitchDeckPrompts(problemText: string | undefined, solutionText: string | undefined, inputs: PitchDeckInputs) {
  const differentiationList = normalizeList(inputs.opportunity.differentiation);
  
  const ctx = {
    original_problem: problemText || '',
    original_solution: solutionText || '',
    company_name: inputs.coreStory.companyName,
    target_audience: inputs.coreStory.targetAudience,
    problem: inputs.coreStory.problem,
    solution: inputs.coreStory.solution,
    key_benefit: inputs.coreStory.keyBenefit,
    secret_sauce: inputs.coreStory.secretSauce,
    problem_evidence: inputs.opportunity.problemEvidence,
    differentiation: differentiationList,
    market_size: inputs.opportunity.marketSize,
    business_model: inputs.businessEngine.businessModel,
    unit_economics: inputs.businessEngine.unitEconomics,
    traction: inputs.businessEngine.traction,
    go_to_market: inputs.businessEngine.goToMarketStrategy,
    product_roadmap: inputs.futureAsk.productRoadmap,
    financial_projections: inputs.futureAsk.financialProjections,
    funding_ask: inputs.futureAsk.fundingAsk,
    use_of_funds: inputs.futureAsk.useOfFunds,
    team_members: inputs.teamVision.teamMembers,
    closing_vision: inputs.teamVision.closingVision,
  };

  const masterPitchPrompt = [
    'Create a 13-slide investor pitch deck with the following content:',
    '',
    '# Slide 1: Title',
    `## ${ctx.company_name}`,
    `${ctx.solution}`,
    '',
    '# Slide 2: Problem',
    `## The Challenge Facing ${ctx.target_audience}`,
    `${ctx.problem}`,
    '',
    '**Evidence:**',
    `${ctx.problem_evidence}`,
    '',
    '# Slide 3: Solution',
    `## How ${ctx.company_name} Solves This`,
    `${ctx.solution}`,
    '',
    '**Key Benefit:**',
    `${ctx.key_benefit}`,
    '',
    '**Our Secret Sauce:**',
    `${ctx.secret_sauce}`,
    '',
    '# Slide 4: Market Opportunity',
    '## Market Size & Growth',
    `${ctx.market_size}`,
    '',
    '# Slide 5: Product',
    `## ${ctx.company_name} Platform`,
    `**Core Value:** ${ctx.key_benefit}`,
    '',
    `**What Makes Us Different:** ${ctx.secret_sauce}`,
    '',
    '# Slide 6: Business Model',
    '## How We Make Money',
    `${ctx.business_model}`,
    '',
    '**Unit Economics:**',
    `${ctx.unit_economics}`,
    '',
    '# Slide 7: Traction',
    '## Proven Results',
    `${ctx.traction}`,
    '',
    '# Slide 8: Competition',
    '## Competitive Advantage',
    '**Our Key Differentiators:**',
    ...ctx.differentiation.map(diff => `• ${diff}`),
    '',
    '# Slide 9: Go-to-Market',
    '## Customer Acquisition Strategy',
    `${ctx.go_to_market}`,
    '',
    '# Slide 10: Financial Projections',
    '## Revenue Forecast',
    `${ctx.financial_projections}`,
    '',
    '# Slide 11: Funding Ask',
    `## We're Raising ${ctx.funding_ask}`,
    '',
    '**Use of Funds:**',
    `${ctx.use_of_funds}`,
    '',
    '# Slide 12: Team',
    '## The Team Behind the Vision',
    `${ctx.team_members}`,
    '',
    '# Slide 13: Vision',
    `## ${ctx.closing_vision}`,
    `Join us in transforming how ${ctx.target_audience} solve ${ctx.problem.toLowerCase()}`,
    '',
    'Ready to make this vision reality together?',
  ].join('\n');

  const executiveSummaryPrompt = [
    `# ${ctx.company_name} Executive Summary`,
    '',
    '## Company Overview',
    `${ctx.company_name} is ${ctx.solution}`,
    '',
    `We serve ${ctx.target_audience} by delivering ${ctx.key_benefit}.`,
    '',
    '## Problem & Opportunity',
    `**The Problem:** ${ctx.problem}`,
    '',
    `**Market Evidence:** ${ctx.problem_evidence}`,
    '',
    `**Market Opportunity:** ${ctx.market_size}`,
    '',
    '## Our Solution',
    `${ctx.solution}`,
    '',
    `**Key Benefit:** ${ctx.key_benefit}`,
    '',
    `**Our Secret Sauce:** ${ctx.secret_sauce}`,
    '',
    '**Competitive Advantages:**',
    ...ctx.differentiation.map(diff => `• ${diff}`),
    '',
    '## Business Model & Traction',
    `**Revenue Model:** ${ctx.business_model}`,
    '',
    `**Unit Economics:** ${ctx.unit_economics}`,
    '',
    `**Current Traction:** ${ctx.traction}`,
    '',
    '## Financial Projections',
    `${ctx.financial_projections}`,
    '',
    '## Go-to-Market Strategy',
    `${ctx.go_to_market}`,
    '',
    '## Product Roadmap',
    `${ctx.product_roadmap}`,
    '',
    '## Funding Ask',
    `**Raising:** ${ctx.funding_ask}`,
    '',
    `**Use of Funds:** ${ctx.use_of_funds}`,
    '',
    '## Team',
    `${ctx.team_members}`,
    '',
    '## Vision',
    `${ctx.closing_vision}`,
  ].join('\n');

  const demoScriptPrompt = [
    `# ${ctx.company_name} Product Demo Script`,
    '',
    '## Demo Opening (30 seconds)',
    `"${ctx.target_audience} face a critical challenge: ${ctx.problem}"`,
    '',
    `"Let me show you how ${ctx.company_name} solves this problem in a completely new way."`,
    '',
    '## Core Product Demo (3 minutes)',
    '',
    '### Key Feature 1: Core Solution',
    `**Show:** ${ctx.solution}`,
    `**Say:** "This delivers ${ctx.key_benefit} by ${ctx.secret_sauce}"`,
    '**Highlight:** What makes this unique compared to alternatives',
    '',
    '### Key Feature 2: Competitive Advantage',
    `**Demonstrate:** ${ctx.differentiation[0] || 'Primary differentiator'}`,
    '**Explain:** How this saves time/money/effort',
    '**Show:** Measurable outcomes and results',
    '',
    '### Key Feature 3: User Experience',
    `**Focus on:** How ${ctx.target_audience} actually use this`,
    '**Demonstrate:** Ease of use and intuitive workflow',
    '**Highlight:** Scalability and growth potential',
    '',
    '## Demo Closing (1 minute)',
    `"As you can see, ${ctx.company_name} directly addresses ${ctx.problem}"`,
    '',
    `"We deliver ${ctx.key_benefit} through ${ctx.secret_sauce}"`,
    '',
    `"This is just the beginning of what's possible for ${ctx.target_audience}"`,
    '',
    '## Backup Plans',
    '- **Screenshots ready** if live demo fails',
    '- **Video recording** as alternative',
    '- **Key talking points** without visuals:',
    `  - ${ctx.key_benefit}`,
    `  - ${ctx.secret_sauce}`,
    `  - ${ctx.differentiation.slice(0, 2).join(' and ')}`,
    '',
    '## Timing Guidelines',
    '- **Total time:** 4-5 minutes maximum',
    '- **Each feature:** Under 60 seconds',
    '- **Quick version:** Focus only on core solution (2 minutes)',
  ].join('\n');

  const qaPreparationPrompt = [
    `# ${ctx.company_name} Q&A Preparation Guide`,
    '',
    '## Market & Competition',
    '',
    '**Q: How big is the market really?**',
    `A: ${ctx.market_size}`,
    '',
    '**Q: Who are your main competitors?**',
    `A: Our key differentiators are: ${ctx.differentiation.join(', ')}. This sets us apart from traditional solutions.`,
    '',
    '**Q: What if a big company enters this space?**',
    `A: Our secret sauce is ${ctx.secret_sauce}, which creates a defensible moat. Plus, we're focused specifically on ${ctx.target_audience}.`,
    '',
    '## Business Model & Revenue',
    '',
    '**Q: How do you make money?**',
    `A: ${ctx.business_model}`,
    '',
    '**Q: What are your unit economics?**',
    `A: ${ctx.unit_economics}`,
    '',
    '**Q: When will you be profitable?**',
    `A: Based on our projections: ${ctx.financial_projections}`,
    '',
    '## Product & Technology',
    '',
    '**Q: What\'s your competitive moat?**',
    `A: ${ctx.secret_sauce} combined with ${ctx.key_benefit} creates a strong competitive advantage.`,
    '',
    '**Q: How scalable is your technology?**',
    `A: Our solution is designed for ${ctx.target_audience} and can scale because ${ctx.secret_sauce}.`,
    '',
    '## Team & Execution',
    '',
    '**Q: Why is your team uniquely qualified?**',
    `A: ${ctx.team_members}`,
    '',
    '**Q: What are your biggest execution risks?**',
    `A: The main challenges are around ${ctx.go_to_market}, but we're mitigating this through our focused approach.`,
    '',
    '## Financials & Funding',
    '',
    '**Q: Why do you need this much money?**',
    `A: We're raising ${ctx.funding_ask} to: ${ctx.use_of_funds}`,
    '',
    '**Q: What are your key milestones?**',
    `A: Our roadmap includes: ${ctx.product_roadmap}`,
    '',
    '**Q: What\'s your exit strategy?**',
    `A: ${ctx.closing_vision} - we see potential for acquisition by companies serving ${ctx.target_audience} or IPO as we scale.`,
    '',
    '## Product & Vision',
    '',
    '**Q: What\'s your long-term vision?**',
    `A: ${ctx.closing_vision}`,
    '',
    '**Q: How do you ensure customer adoption?**',
    `A: We solve a critical problem: ${ctx.problem}. Our traction shows: ${ctx.traction}`,
  ].join('\n');

  return {
    meta: {
      created_with: 'Pitch Master Kit',
      timestamp: new Date().toISOString(),
      company: inputs.coreStory.companyName,
    },
    context: ctx,
    prompts: {
      master_pitch_deck: masterPitchPrompt,
      executive_summary: executiveSummaryPrompt,
      demo_script: demoScriptPrompt,
      qa_preparation: qaPreparationPrompt,
    },
  };
}

const stepLabels = ['Core Story', 'Opportunity', 'Business Engine', 'Future & Ask', 'Team & Vision', 'Generate Assets'] as const;

const PitchMasterKitModal: React.FC<PitchMasterKitModalProps> = ({ isOpen, onClose, problemText, solutionText, allowEditing = false }) => {
  const [step, setStep] = useState<number>(0);
  const [inputs, setInputs] = useState<PitchDeckInputs>({
    coreStory: {
      companyName: '',
      targetAudience: '',
      problem: problemText || '',
      solution: solutionText || '',
      keyBenefit: '',
      secretSauce: '',
    },
    opportunity: {
      problemEvidence: '',
      differentiation: '',
      marketSize: '',
    },
    businessEngine: {
      businessModel: '',
      unitEconomics: '',
      traction: '',
      goToMarketStrategy: '',
    },
    futureAsk: {
      productRoadmap: '',
      financialProjections: '',
      fundingAsk: '',
      useOfFunds: '',
    },
    teamVision: {
      teamMembers: '',
      closingVision: '',
    },
  });

  const [generated, setGenerated] = useState<Record<string, unknown> | null>(null);
  const [activePreview, setActivePreview] = useState<'pitch' | 'summary' | 'demo' | 'qa'>('pitch');
  const [showErrors, setShowErrors] = useState<boolean[]>([false, false, false, false, false]);

  const canProceedStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Core Story
        return (
          inputs.coreStory.companyName.trim().length > 0 &&
          inputs.coreStory.targetAudience.trim().length > 0 &&
          inputs.coreStory.problem.trim().length > 0 &&
          inputs.coreStory.solution.trim().length > 0 &&
          inputs.coreStory.keyBenefit.trim().length > 0 &&
          inputs.coreStory.secretSauce.trim().length > 0
        );
      case 1: // Opportunity
        return (
          inputs.opportunity.problemEvidence.trim().length > 0 &&
          normalizeList(inputs.opportunity.differentiation).length >= 3 &&
          inputs.opportunity.marketSize.trim().length > 0
        );
      case 2: // Business Engine
        return (
          inputs.businessEngine.businessModel.trim().length > 0 &&
          inputs.businessEngine.unitEconomics.trim().length > 0 &&
          inputs.businessEngine.traction.trim().length > 0 &&
          inputs.businessEngine.goToMarketStrategy.trim().length > 0
        );
      case 3: // Future & Ask
        return (
          inputs.futureAsk.productRoadmap.trim().length > 0 &&
          inputs.futureAsk.financialProjections.trim().length > 0 &&
          inputs.futureAsk.fundingAsk.trim().length > 0 &&
          inputs.futureAsk.useOfFunds.trim().length > 0
        );
      case 4: // Team & Vision
        return (
          inputs.teamVision.teamMembers.trim().length > 0 &&
          inputs.teamVision.closingVision.trim().length > 0
        );
      default:
        return true;
    }
  };

  const canGenerate = useMemo(() => {
    return [0, 1, 2, 3, 4].every(i => canProceedStep(i));
  }, [inputs]);

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
    const obj = buildPitchDeckPrompts(problemText, solutionText, inputs);
    setGenerated(obj);
    setStep(5);
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard`);
    } catch {
      alert('Copy failed');
    }
  };

  const handleNext = () => {
    if (step < 4) {
      if (!canProceedStep(step)) {
        const newErrors = [...showErrors];
        newErrors[step] = true;
        setShowErrors(newErrors);
        return;
      }
      const newErrors = [...showErrors];
      newErrors[step] = false;
      setShowErrors(newErrors);
      setStep(step + 1);
    } else if (step === 4) {
      if (!canGenerate) {
        setShowErrors([true, true, true, true, true]);
        return;
      }
      handleGenerate();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative w-full max-w-3xl mx-auto border rounded-[24px] shadow-lg"
        style={{ backgroundColor: '#fffaf3', borderColor: '#e8ddd0', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e8ddd0' }}>
          <div>
            <h3 className="text-xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
              Pitch Master Kit for Gamma
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
              <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                Part 1: The Core Story
              </h4>
              <p className="text-sm mb-4" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                This foundation will be used throughout your entire deck
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    1. Company / Product Name
                  </label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What is the name of your company or product?"
                    value={inputs.coreStory.companyName}
                    onChange={(e) => setInputs(s => ({ ...s, coreStory: { ...s.coreStory, companyName: e.target.value } }))}
                  />
                  {showErrors[0] && inputs.coreStory.companyName.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Company name is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    2. Target Audience
                  </label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="Who is your ideal customer? Be specific."
                    value={inputs.coreStory.targetAudience}
                    onChange={(e) => setInputs(s => ({ ...s, coreStory: { ...s.coreStory, targetAudience: e.target.value } }))}
                  />
                  {showErrors[0] && inputs.coreStory.targetAudience.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Target audience is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    3. The Problem
                    {problemText && inputs.coreStory.problem === problemText && (
                      <span className="ml-2 text-xs" style={{ color: '#666' }}>(from original idea)</span>
                    )}
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ 
                      borderColor: '#e8ddd0', 
                      backgroundColor: (problemText && inputs.coreStory.problem === problemText && !allowEditing) ? '#f9f9f9' : '#fff', 
                      color: (problemText && inputs.coreStory.problem === problemText && !allowEditing) ? '#666' : '#403f3e' 
                    }}
                    placeholder={allowEditing ? "The Problem" : "What critical problem do they face?"}
                    value={inputs.coreStory.problem}
                    onChange={(e) => setInputs(s => ({ ...s, coreStory: { ...s.coreStory, problem: e.target.value } }))}
                    readOnly={!!(problemText && inputs.coreStory.problem === problemText && !allowEditing)}
                  />
                  {problemText && inputs.coreStory.problem === problemText && !allowEditing && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                      This problem is from your original idea and cannot be edited here.
                    </p>
                  )}
                  {showErrors[0] && inputs.coreStory.problem.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Problem description is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    4. The Solution
                    {solutionText && inputs.coreStory.solution === solutionText && (
                      <span className="ml-2 text-xs" style={{ color: '#666' }}>(from original idea)</span>
                    )}
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ 
                      borderColor: '#e8ddd0', 
                      backgroundColor: (solutionText && inputs.coreStory.solution === solutionText && !allowEditing) ? '#f9f9f9' : '#fff', 
                      color: (solutionText && inputs.coreStory.solution === solutionText && !allowEditing) ? '#666' : '#403f3e' 
                    }}
                    placeholder={allowEditing ? "The Solution" : "In one sentence, what is your product and how does it solve their problem?"}
                    value={inputs.coreStory.solution}
                    onChange={(e) => setInputs(s => ({ ...s, coreStory: { ...s.coreStory, solution: e.target.value } }))}
                    readOnly={!!(solutionText && inputs.coreStory.solution === solutionText && !allowEditing)}
                  />
                  {solutionText && inputs.coreStory.solution === solutionText && !allowEditing && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                      This solution is from your original idea and cannot be edited here.
                    </p>
                  )}
                  {showErrors[0] && inputs.coreStory.solution.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Solution description is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    5. The Key Benefit
                  </label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What is the single most important value you deliver to the user?"
                    value={inputs.coreStory.keyBenefit}
                    onChange={(e) => setInputs(s => ({ ...s, coreStory: { ...s.coreStory, keyBenefit: e.target.value } }))}
                  />
                  {showErrors[0] && inputs.coreStory.keyBenefit.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Key benefit is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    6. Your &quot;Secret Sauce&quot;
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What is your unique technology, insight, or approach that makes your solution possible?"
                    value={inputs.coreStory.secretSauce}
                    onChange={(e) => setInputs(s => ({ ...s, coreStory: { ...s.coreStory, secretSauce: e.target.value } }))}
                  />
                  {showErrors[0] && inputs.coreStory.secretSauce.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Secret sauce is required.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                Part 2: The Opportunity
              </h4>
              <p className="text-sm mb-4" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                Detail the market and your unique position in it
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    1. Problem Evidence
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What data, quotes, or evidence prove this is a painful problem?"
                    value={inputs.opportunity.problemEvidence}
                    onChange={(e) => setInputs(s => ({ ...s, opportunity: { ...s.opportunity, problemEvidence: e.target.value } }))}
                  />
                  {showErrors[1] && inputs.opportunity.problemEvidence.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Problem evidence is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    2. Differentiation (3-5 ways)
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="List 3-5 ways your solution is clearly different from the competition or the status quo (one per line)"
                    value={inputs.opportunity.differentiation}
                    onChange={(e) => setInputs(s => ({ ...s, opportunity: { ...s.opportunity, differentiation: e.target.value } }))}
                  />
                  <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                    Enter one differentiator per line. Current: {normalizeList(inputs.opportunity.differentiation).length}
                  </p>
                  {showErrors[1] && normalizeList(inputs.opportunity.differentiation).length < 3 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Please list at least 3 differentiators.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    3. Market Size
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What is your TAM, SAM, and SOM? Briefly explain your bottom-up logic."
                    value={inputs.opportunity.marketSize}
                    onChange={(e) => setInputs(s => ({ ...s, opportunity: { ...s.opportunity, marketSize: e.target.value } }))}
                  />
                  {showErrors[1] && inputs.opportunity.marketSize.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Market size analysis is required.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                Part 3: The Business Engine
              </h4>
              <p className="text-sm mb-4" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                Explain how your business works and will grow
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    1. Business Model
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="How do you make money? Describe your primary and any alternative revenue streams."
                    value={inputs.businessEngine.businessModel}
                    onChange={(e) => setInputs(s => ({ ...s, businessEngine: { ...s.businessEngine, businessModel: e.target.value } }))}
                  />
                  {showErrors[2] && inputs.businessEngine.businessModel.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Business model is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    2. Unit Economics
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What is your pricing, Customer Acquisition Cost (CAC), and lifetime gross margin?"
                    value={inputs.businessEngine.unitEconomics}
                    onChange={(e) => setInputs(s => ({ ...s, businessEngine: { ...s.businessEngine, unitEconomics: e.target.value } }))}
                  />
                  {showErrors[2] && inputs.businessEngine.unitEconomics.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Unit economics are required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    3. Traction
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="List your key metrics: MRR, users, pilots, notable customer logos, etc."
                    value={inputs.businessEngine.traction}
                    onChange={(e) => setInputs(s => ({ ...s, businessEngine: { ...s.businessEngine, traction: e.target.value } }))}
                  />
                  {showErrors[2] && inputs.businessEngine.traction.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Traction metrics are required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    4. Go-to-Market Strategy
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What channels will you use to reach your target audience? Describe your sales motion."
                    value={inputs.businessEngine.goToMarketStrategy}
                    onChange={(e) => setInputs(s => ({ ...s, businessEngine: { ...s.businessEngine, goToMarketStrategy: e.target.value } }))}
                  />
                  {showErrors[2] && inputs.businessEngine.goToMarketStrategy.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Go-to-market strategy is required.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                Part 4: The Future & The Ask
              </h4>
              <p className="text-sm mb-4" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                Outline your plan and what you need to achieve it
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    1. Product Roadmap
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What are your major product milestones for the next 12-18 months?"
                    value={inputs.futureAsk.productRoadmap}
                    onChange={(e) => setInputs(s => ({ ...s, futureAsk: { ...s.futureAsk, productRoadmap: e.target.value } }))}
                  />
                  {showErrors[3] && inputs.futureAsk.productRoadmap.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Product roadmap is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    2. Financial Projections
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="Provide a 3-5 year summary of your key financial assumptions (revenue, growth, etc.)."
                    value={inputs.futureAsk.financialProjections}
                    onChange={(e) => setInputs(s => ({ ...s, futureAsk: { ...s.futureAsk, financialProjections: e.target.value } }))}
                  />
                  {showErrors[3] && inputs.futureAsk.financialProjections.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Financial projections are required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    3. The Ask
                  </label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="How much money are you raising?"
                    value={inputs.futureAsk.fundingAsk}
                    onChange={(e) => setInputs(s => ({ ...s, futureAsk: { ...s.futureAsk, fundingAsk: e.target.value } }))}
                  />
                  {showErrors[3] && inputs.futureAsk.fundingAsk.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Funding ask is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    4. Use of Funds
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="How will you spend the money? (e.g., 40% Engineering, 40% Sales & Marketing, 20% G&A)"
                    value={inputs.futureAsk.useOfFunds}
                    onChange={(e) => setInputs(s => ({ ...s, futureAsk: { ...s.futureAsk, useOfFunds: e.target.value } }))}
                  />
                  {showErrors[3] && inputs.futureAsk.useOfFunds.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Use of funds is required.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                Part 5: The Team & Vision
              </h4>
              <p className="text-sm mb-4" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                Close with confidence
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    1. Your Team
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="List the key team members, their roles, and their single most relevant accomplishment. Why is this the winning team?"
                    value={inputs.teamVision.teamMembers}
                    onChange={(e) => setInputs(s => ({ ...s, teamVision: { ...s.teamVision, teamMembers: e.target.value } }))}
                  />
                  {showErrors[4] && inputs.teamVision.teamMembers.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Team information is required.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    2. Closing Vision
                  </label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What is your grand, one-line vision for the future?"
                    value={inputs.teamVision.closingVision}
                    onChange={(e) => setInputs(s => ({ ...s, teamVision: { ...s.teamVision, closingVision: e.target.value } }))}
                  />
                  {showErrors[4] && inputs.teamVision.closingVision.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Closing vision is required.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 5 && generated && (
            <div>
              <h4 className="text-lg mb-4" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                Your Pitch Assets
              </h4>
              
              {/* Navigation tabs */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {[
                  ['pitch', 'Complete Pitch Deck'],
                  ['summary', 'Executive Summary'],
                  ['demo', 'Demo Script'],
                  ['qa', 'Q&A Preparation']
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className="px-3 py-2 rounded-full text-sm"
                    style={{
                      backgroundColor: activePreview === key ? '#e6dccf' : '#f2e8dc',
                      border: '1px solid #d8cdbc',
                      color: '#403f3e',
                      fontFamily: 'Raleway, sans-serif'
                    }}
                    onClick={() => setActivePreview(key as 'pitch' | 'summary' | 'demo' | 'qa')}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Content area */}
              <div className="space-y-4">
                <div className="rounded-2xl border p-4" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-base" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                      {activePreview === 'pitch' && 'Complete Pitch Deck'}
                      {activePreview === 'summary' && 'Executive Summary'}
                      {activePreview === 'demo' && 'Demo Script & Timing'}
                      {activePreview === 'qa' && 'Q&A Preparation Guide'}
                    </h5>
                    <button
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e' }}
                      onClick={() => {
                        const promptKey = {
                          pitch: 'master_pitch_deck',
                          summary: 'executive_summary',
                          demo: 'demo_script',
                          qa: 'qa_preparation'
                        }[activePreview];
                        const prompts = (generated as Record<string, unknown>)?.prompts as Record<string, unknown>;
                        copy(prompts?.[promptKey] as string, `${activePreview} content`);
                      }}
                    >
                      Copy for Gamma
                    </button>
                  </div>
                  
                  <textarea
                    readOnly
                    rows={12}
                    className="w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                    value={(() => {
                      const promptKey = {
                        pitch: 'master_pitch_deck',
                        summary: 'executive_summary',
                        demo: 'demo_script',
                        qa: 'qa_preparation'
                      }[activePreview];
                      const prompts = (generated as Record<string, unknown>)?.prompts as Record<string, unknown>;
                      return (prompts?.[promptKey] as string) || '';
                    })()}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: '#e8ddd0' }}>
              <div className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
            {step < 5 ? 'Complete all sections to generate ready-to-use content' : 'Copy content and paste directly into Gamma to auto-generate slides'}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && step < 5 && (
              <button
                className="px-3 py-2 rounded-full"
                style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            {step < 5 && (
              <button
                className="px-4 py-2 rounded-full text-white"
                style={{ backgroundColor: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                onClick={handleNext}
              >
                {step === 4 ? 'Generate Assets' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchMasterKitModal;
