'use client';

import React, { useState, useEffect } from 'react';

interface PRDKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemText?: string;
  solutionText?: string;
  technology?: string;
}

type TargetPlatforms = {
  mobile: boolean;
  web: boolean;
  ussd: boolean;
  whatsapp: boolean;
  sms: boolean;
};

type UserPersona = {
  id: string;
  name: string;
  description: string;
  coreTask: string;
  goals: string;
  frustrations: string;
};

type Feature = {
  id: string;
  name: string;
  userStory: string;
  acceptanceCriteria: string;
};

type ImplementationPhase = {
  phaseNumber: number;
  phaseName: string;
  objective: string;
  aiPrompt: string;
  deliverables: string[];
  dependencies: string;
  successCriteria: string;
};

const stepLabels = ['Core Concept', 'Target Users', 'Features & User Stories', 'Scope Definition', 'Success Metrics'] as const;

const PRDKitModal: React.FC<PRDKitModalProps> = ({ isOpen, onClose, problemText, solutionText, technology }) => {
  const [step, setStep] = useState<number>(0);
  const [projectName, setProjectName] = useState('');
  const [coreProblem, setCoreProblem] = useState(problemText || '');
  const [proposedSolution, setProposedSolution] = useState(solutionText || '');
  const [coreTechnology, setCoreTechnology] = useState(technology || '');
  const [targetPlatforms, setTargetPlatforms] = useState<TargetPlatforms>({
    mobile: false,
    web: false,
    ussd: false,
    whatsapp: false,
    sms: false,
  });

  const [userPersonas, setUserPersonas] = useState<UserPersona[]>([
    { id: '1', name: '', description: '', coreTask: '', goals: '', frustrations: '' }
  ]);

  const [features, setFeatures] = useState<Feature[]>([
    { id: '1', name: '', userStory: '', acceptanceCriteria: '' }
  ]);

  const [outOfScope, setOutOfScope] = useState('');
  const [kpis, setKpis] = useState('');
  const [impactGoal, setImpactGoal] = useState('');
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [implementationPhases, setImplementationPhases] = useState<ImplementationPhase[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showStep0Errors, setShowStep0Errors] = useState(false);
  const [showStep1Errors, setShowStep1Errors] = useState(false);
  const [showStep2Errors, setShowStep2Errors] = useState(false);
  const [showStep4Errors, setShowStep4Errors] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation functions
  const canProceedStep0 = () => {
    if (!projectName.trim()) return false;
    if (!coreProblem.trim()) return false;
    if (!proposedSolution.trim()) return false;
    if (!coreTechnology.trim()) return false;
    return Object.values(targetPlatforms).some(v => v);
  };

  const canProceedStep1 = () => {
    return userPersonas.some(p => 
      p.name.trim() && p.description.trim() && p.coreTask.trim() && p.goals.trim() && p.frustrations.trim()
    );
  };

  const canProceedStep2 = () => {
    return features.some(f => 
      f.name.trim() && f.userStory.trim() && f.acceptanceCriteria.trim()
    );
  };

  const canProceedStep4 = () => {
    return kpis.trim() && impactGoal.trim();
  };

  // Add/Remove functions
  const addUserPersona = () => {
    setUserPersonas([...userPersonas, { 
      id: Date.now().toString(), 
      name: '', 
      description: '', 
      coreTask: '', 
      goals: '', 
      frustrations: '' 
    }]);
  };

  const removeUserPersona = (id: string) => {
    if (userPersonas.length > 1) {
      setUserPersonas(userPersonas.filter(p => p.id !== id));
    }
  };

  const updateUserPersona = (id: string, field: keyof UserPersona, value: string) => {
    setUserPersonas(userPersonas.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addFeature = () => {
    setFeatures([...features, { 
      id: Date.now().toString(), 
      name: '', 
      userStory: '', 
      acceptanceCriteria: '' 
    }]);
  };

  const removeFeature = (id: string) => {
    if (features.length > 1) {
      setFeatures(features.filter(f => f.id !== id));
    }
  };

  const updateFeature = (id: string, field: keyof Feature, value: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  // Generate PRD and Implementation Phases
  const generatePRDAndPhases = () => {
    setIsGenerating(true);
    
    // Generate Implementation Phases first
    const phases = generateImplementationPhases();
    console.log('Generated phases:', phases.length, 'phases');
    setImplementationPhases(phases);
    
    // Generate PRD with phases included
    const prd = generatePRDDocument();
    console.log('Generated PRD length:', prd.length);
    console.log('PRD includes phases section:', prd.includes('# IMPLEMENTATION PHASES'));
    setGeneratedPRD(prd);
    
    setIsGenerating(false);
  };

  const generatePRDDocument = (): string => {
    const selectedPlatforms = Object.entries(targetPlatforms)
      .filter(([_, selected]) => selected)
      .map(([platform]) => platform.charAt(0).toUpperCase() + platform.slice(1))
      .join(', ');

    // Generate implementation phases
    const phases = generateImplementationPhases();
    console.log('Phases in PRD generation:', phases.length, 'phases');
    console.log('First phase name:', phases[0]?.phaseName);

    const prdContent = `# Product Requirements Document: ${projectName}

## Executive Summary

**Project Name:** ${projectName}

**Target Platforms:** ${selectedPlatforms}

**Core Technology:** ${coreTechnology || 'Not specified'}

## Problem Statement

${coreProblem || 'Not specified'}

## Proposed Solution

${proposedSolution || 'Not specified'}

## Target Users

${userPersonas.filter(p => p.name.trim()).map((persona, idx) => `
### ${idx + 1}. ${persona.name}

**Description:** ${persona.description}

**Core User Task:** ${persona.coreTask}

**Goals:**
${persona.goals}

**Frustrations:**
${persona.frustrations}
`).join('\n')}

## Features & User Stories

${features.filter(f => f.name.trim()).map((feature, idx) => `
### Feature ${idx + 1}: ${feature.name}

**User Story:**
${feature.userStory}

**Acceptance Criteria:**
${feature.acceptanceCriteria}
`).join('\n')}

## Out of Scope (Version 1)

${outOfScope || 'Not specified'}

## Success Metrics

### Key Performance Indicators (KPIs)

${kpis}

### National Impact Goal

${impactGoal}

---

# IMPLEMENTATION PHASES

${phases.map(phase => `
## Phase ${phase.phaseNumber}: ${phase.phaseName}

**Objective:** ${phase.objective}

**Deliverables:**
${phase.deliverables.map(d => `- ${d}`).join('\n')}

**Dependencies:** ${phase.dependencies}

**Success Criteria:** ${phase.successCriteria}

### AI Development Prompt
\`\`\`
${phase.aiPrompt}
\`\`\`
`).join('\n')}

---

*Generated on ${new Date().toLocaleDateString()}*
`;

    console.log('Final PRD content length:', prdContent.length);
    console.log('Phases section length:', prdContent.split('# IMPLEMENTATION PHASES')[1]?.length || 0);
    
    return prdContent;
  };

  const generateImplementationPhases = (): ImplementationPhase[] => {
    const phases: ImplementationPhase[] = [];
    const selectedPlatforms = Object.entries(targetPlatforms)
      .filter(([_, selected]) => selected)
      .map(([platform]) => platform);

    const personaNames = userPersonas.filter(p => p.name.trim()).map(p => p.name).join(', ');
    const coreTasks = userPersonas.filter(p => p.coreTask.trim()).map(p => p.coreTask).join('; ');

    // Phase 1: Foundation & Core Setup
    phases.push({
      phaseNumber: 1,
      phaseName: 'Foundation & Core Setup',
      objective: 'Set up project structure, database schema, and authentication system',
      aiPrompt: `Create a ${selectedPlatforms.join(' and ')} application for "${projectName}".

**Problem Context:**
${problemText}

**Solution Overview:**
${solutionText}

**Target Users:** ${personaNames}
**Core User Tasks:** ${coreTasks}

**Phase 1 Requirements:**

1. Initialize a ${technology || 'modern web/mobile'} project with proper folder structure following best practices

2. Set up database schema for:
   - Users table with authentication fields
   - Core entities based on the solution (${features.slice(0, 2).map(f => f.name).join(', ')})
   
3. Implement authentication system supporting:
   ${selectedPlatforms.includes('mobile') ? '- Mobile OAuth/Social login for mobile apps' : ''}
   ${selectedPlatforms.includes('web') ? '- Email/password authentication for web' : ''}
   ${selectedPlatforms.includes('ussd') ? '- Phone number-based authentication for USSD' : ''}
   ${selectedPlatforms.includes('whatsapp') ? '- WhatsApp number verification' : ''}
   ${selectedPlatforms.includes('sms') ? '- SMS OTP verification' : ''}

4. Create basic project structure:
   - API routes/endpoints directory
   - Database models/schemas
   - Utility functions
   - Configuration files

**Technical Specifications:**
- Use ${technology || 'appropriate modern framework'}
- Follow ${selectedPlatforms.includes('mobile') ? 'mobile-first' : 'responsive web'} design principles
- Ensure accessibility for users with varying technical literacy
- Set up proper error handling and logging

**Expected Deliverables:**
- Initialized project with proper folder structure
- Database migrations for core tables
- Authentication API endpoints
- Basic environment configuration
- README with setup instructions`,
      deliverables: [
        'Project structure initialized',
        'Database schema created',
        'Authentication system implemented',
        'Environment configuration',
        'Basic API endpoints'
      ],
      dependencies: 'None - This is the foundation',
      successCriteria: 'Project runs locally, database connects successfully, authentication endpoints are functional'
    });

    // Phase 2: Core Features (MVP)
    const coreFeatures = features.filter(f => f.name.trim()).slice(0, 3);
    phases.push({
      phaseNumber: 2,
      phaseName: 'Core Features (MVP)',
      objective: 'Implement the essential features that solve the core problem',
      aiPrompt: `Building on Phase 1 for "${projectName}", implement the core MVP features.

**Context:**
We're building for ${personaNames} who need to ${coreTasks}.

**Phase 2 Core Features:**

${coreFeatures.map((f, idx) => `
${idx + 1}. **${f.name}**
   
   User Story: ${f.userStory}
   
   Acceptance Criteria:
   ${f.acceptanceCriteria}
   
`).join('\n')}

**Implementation Requirements:**

1. Create API endpoints for each feature
2. Implement business logic and data validation
3. Build UI components for ${selectedPlatforms.join(' and ')} platforms
4. Ensure data persistence and proper error handling
5. Add loading states and user feedback

**Platform-Specific Considerations:**
${selectedPlatforms.includes('ussd') ? '- USSD: Keep menus simple, maximum 10 items per page, support session management' : ''}
${selectedPlatforms.includes('whatsapp') ? '- WhatsApp Bot: Use interactive buttons and lists, handle message templates' : ''}
${selectedPlatforms.includes('sms') ? '- SMS: Keep messages under 160 characters, use clear keywords' : ''}
${selectedPlatforms.includes('mobile') ? '- Mobile: Optimize for offline-first functionality, handle network failures gracefully' : ''}
${selectedPlatforms.includes('web') ? '- Web: Ensure responsive design, progressive enhancement' : ''}

**Testing:**
- Write unit tests for business logic
- Test all user flows from start to finish
- Validate against acceptance criteria`,
      deliverables: coreFeatures.map(f => `${f.name} feature complete`),
      dependencies: 'Phase 1 must be complete (authentication and database setup)',
      successCriteria: 'All core features work end-to-end, acceptance criteria met, basic testing complete'
    });

    // Phase 3: Platform-Specific Implementation
    if (selectedPlatforms.length > 1) {
      phases.push({
        phaseNumber: 3,
        phaseName: 'Platform-Specific Implementation',
        objective: 'Optimize and complete implementations for each target platform',
        aiPrompt: `For "${projectName}", optimize and complete platform-specific implementations.

**Platforms to Implement:**

${selectedPlatforms.map(platform => {
  switch(platform) {
    case 'ussd':
      return `**USSD Implementation:**
- Create session management system
- Build menu navigation structure
- Implement timeout handling
- Add USSD gateway integration
- Test with actual USSD simulator`;
    case 'whatsapp':
      return `**WhatsApp Bot Implementation:**
- Set up WhatsApp Business API integration
- Create message templates
- Implement interactive buttons and lists
- Add media handling (if needed)
- Set up webhook handlers`;
    case 'sms':
      return `**SMS Service Implementation:**
- Integrate SMS gateway (Twilio, Africa's Talking, etc.)
- Create SMS command parser
- Implement keyword-based interactions
- Add delivery confirmation
- Handle opt-in/opt-out`;
    case 'mobile':
      return `**Mobile App Implementation:**
- Complete native UI components
- Add offline functionality
- Implement push notifications
- Optimize app size and performance
- Add app icons and splash screens`;
    case 'web':
      return `**Web App Implementation:**
- Complete responsive layouts
- Add PWA capabilities (if needed)
- Implement SEO basics
- Add web analytics
- Optimize load times`;
    default:
      return '';
  }
}).join('\n\n')}

**Integration Requirements:**
- Ensure all platforms share the same backend APIs
- Maintain consistent business logic across platforms
- Synchronize user data across platforms
- Handle platform-specific edge cases`,
        deliverables: selectedPlatforms.map(p => `${p.toUpperCase()} platform fully functional`),
        dependencies: 'Phase 2 core features must be complete',
        successCriteria: 'Each platform works independently, cross-platform data synchronization working'
      });
    }

    // Phase 4: Advanced Features & Integration
    const advancedFeatures = features.filter(f => f.name.trim()).slice(3);
    if (advancedFeatures.length > 0) {
      phases.push({
        phaseNumber: phases.length + 1,
        phaseName: 'Advanced Features & Integration',
        objective: 'Implement secondary features and third-party integrations',
        aiPrompt: `For "${projectName}", implement advanced features and integrations.

**Advanced Features:**

${advancedFeatures.map((f, idx) => `
${idx + 1}. **${f.name}**
   
   User Story: ${f.userStory}
   
   Acceptance Criteria:
   ${f.acceptanceCriteria}
`).join('\n')}

**Integration Requirements:**
- Add analytics and tracking
- Implement payment gateway (if applicable)
- Add third-party service integrations
- Set up notification system
- Add reporting and dashboard features

**Quality Assurance:**
- Integration testing
- Performance testing
- Security audit
- User acceptance testing prep`,
        deliverables: advancedFeatures.map(f => `${f.name} implemented`).concat(['Integrations complete', 'Analytics setup']),
        dependencies: `Phase ${phases.length} (platform-specific work) must be complete`,
        successCriteria: 'All planned features working, integrations tested, ready for user testing'
      });
    }

    // Phase 5: Testing, Optimization & Launch
    phases.push({
      phaseNumber: phases.length + 1,
      phaseName: 'Testing, Optimization & Launch',
      objective: 'Final testing, optimization, and production deployment',
      aiPrompt: `Final phase for "${projectName}" - prepare for production launch.

**Testing Requirements:**

1. **User Testing:**
   - Recruit users matching personas: ${personaNames}
   - Test all core user flows
   - Gather feedback on usability
   - Fix critical issues

2. **Performance Optimization:**
   - Database query optimization
   - API response time optimization
   - Frontend bundle size reduction
   - Caching implementation
   - CDN setup (if applicable)

3. **Security Hardening:**
   - Security audit and penetration testing
   - Input validation review
   - Authentication/authorization review
   - Data encryption verification
   - API rate limiting
   - GDPR/data privacy compliance

4. **Deployment Setup:**
   ${selectedPlatforms.includes('web') ? '- Web hosting and domain setup' : ''}
   ${selectedPlatforms.includes('mobile') ? '- App store deployment (iOS/Android)' : ''}
   ${selectedPlatforms.includes('ussd') ? '- USSD shortcode registration' : ''}
   ${selectedPlatforms.includes('whatsapp') ? '- WhatsApp Business account verification' : ''}
   - Database backup and recovery
   - Monitoring and alerting
   - CI/CD pipeline
   - Documentation

5. **Launch Preparation:**
   - Create user onboarding materials
   - Set up customer support channels
   - Prepare marketing materials
   - Set up feedback collection
   - Configure analytics for KPIs: ${kpis}

**Success Metrics Setup:**
Track these KPIs from launch:
${kpis}

Work towards this impact goal:
${impactGoal}`,
      deliverables: [
        'All testing complete',
        'Performance optimized',
        'Security hardened',
        'Production deployment',
        'Monitoring setup',
        'User documentation',
        'Launch ready'
      ],
      dependencies: `All previous phases complete`,
      successCriteria: 'Application live in production, monitoring active, first users onboarded, KPI tracking functional'
    });

    return phases;
  };

  const handleNext = () => {
    if (step === 0 && !canProceedStep0()) {
      setShowStep0Errors(true);
      return;
    }
    if (step === 1 && !canProceedStep1()) {
      setShowStep1Errors(true);
      return;
    }
    if (step === 2 && !canProceedStep2()) {
      setShowStep2Errors(true);
      return;
    }
    if (step === 4 && !canProceedStep4()) {
      setShowStep4Errors(true);
      return;
    }
    
    setShowStep0Errors(false);
    setShowStep1Errors(false);
    setShowStep2Errors(false);
    setShowStep4Errors(false);
    
    if (step === 4) {
      generatePRDAndPhases();
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl mx-auto border rounded-[24px] shadow-lg"
        style={{ backgroundColor: '#fffaf3', borderColor: '#e8ddd0', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e8ddd0' }}>
          <div>
            <h3 className="text-xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
              PRD Kit
            </h3>
            <p className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
              {step < 5 ? `Step ${step + 1} of ${stepLabels.length}: ${stepLabels[step]}` : 'Complete PRD and Implementation Plan'}
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

        {/* Progress Steps */}
        {step < 5 && (
          <div className="px-5 py-3" style={{ backgroundColor: '#f2e8dc' }}>
            <div className="flex items-center justify-between">
              {stepLabels.map((label, idx) => (
                <div key={idx} className="flex items-center">
                  <div 
                    className="flex items-center justify-center w-6 h-6 rounded-full text-xs"
                    style={{
                      backgroundColor: idx === step ? '#403f3e' : idx < step ? '#E6B800' : '#d8cdbc',
                      color: idx <= step ? '#fff' : '#666'
                    }}
                  >
                    {idx < step ? '✓' : idx + 1}
                  </div>
                  <span 
                    className="ml-2 text-xs"
                    style={{ 
                      fontFamily: 'Raleway, sans-serif',
                      color: idx === step ? '#403f3e' : '#666',
                      fontWeight: idx === step ? 600 : 400
                    }}
                  >
                    {label}
                  </span>
                  {idx < stepLabels.length - 1 && (
                    <div 
                      className="w-8 h-0.5 mx-3"
                      style={{ backgroundColor: idx < step ? '#E6B800' : '#d8cdbc' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-5 overflow-y-auto flex-1">
          {/* Step 0: Core Concept */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Project Name <span style={{ color: '#E6B800' }}>*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., AgriConnect - Farmer-to-Market Platform"
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}
                />
                {showStep0Errors && !projectName.trim() && (
                  <p className="text-sm mt-1" style={{ color: '#E6B800' }}>Project name is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Target Platform(s) <span style={{ color: '#E6B800' }}>*</span>
                </label>
                <div className="space-y-2">
                  {Object.entries(targetPlatforms).map(([platform, selected]) => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => setTargetPlatforms({ ...targetPlatforms, [platform]: e.target.checked })}
                        className="mr-2"
                        style={{ accentColor: '#E6B800' }}
                      />
                      <span className="capitalize" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>{
                        platform === 'ussd' ? 'USSD' :
                        platform === 'whatsapp' ? 'WhatsApp Bot' :
                        platform === 'sms' ? 'SMS-based Service' :
                        platform === 'mobile' ? 'Mobile App (iOS/Android)' :
                        platform === 'web' ? 'Web App (Desktop/Mobile Web)' :
                        platform
                      }</span>
                    </label>
                  ))}
                </div>
                {showStep0Errors && !Object.values(targetPlatforms).some(v => v) && (
                  <p className="text-sm mt-1" style={{ color: '#E6B800' }}>Select at least one platform</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Core Problem <span style={{ color: '#E6B800' }}>*</span>
                </label>
                <textarea
                  value={coreProblem}
                  onChange={(e) => setCoreProblem(e.target.value)}
                  placeholder="Describe the main problem your product solves..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', fontFamily: 'Raleway, sans-serif' }}
                />
                {showStep0Errors && !coreProblem.trim() && (
                  <p className="text-sm mt-1" style={{ color: '#E6B800', fontFamily: 'Raleway, sans-serif' }}>Core problem is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Proposed Solution <span style={{ color: '#E6B800' }}>*</span>
                </label>
                <textarea
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  placeholder="Describe how your product solves the problem..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', fontFamily: 'Raleway, sans-serif' }}
                />
                {showStep0Errors && !proposedSolution.trim() && (
                  <p className="text-sm mt-1" style={{ color: '#E6B800', fontFamily: 'Raleway, sans-serif' }}>Proposed solution is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Core Technology <span style={{ color: '#E6B800' }}>*</span>
                </label>
                <input
                  type="text"
                  value={coreTechnology}
                  onChange={(e) => setCoreTechnology(e.target.value)}
                  placeholder="e.g., React, Node.js, Python, Flutter, etc."
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', fontFamily: 'Raleway, sans-serif' }}
                />
                {showStep0Errors && !coreTechnology.trim() && (
                  <p className="text-sm mt-1" style={{ color: '#E6B800', fontFamily: 'Raleway, sans-serif' }}>Core technology is required</p>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Target Users */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg mb-2" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Define Your Target Users</h4>
                <p className="text-sm mb-4" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                  Create detailed personas for the people who will use your product.
                </p>
              </div>

              {userPersonas.map((persona, idx) => (
                <div key={persona.id} className="border rounded-lg p-4 space-y-4" style={{ borderColor: '#e8ddd0' }}>
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>User Persona {idx + 1}</h4>
                    {userPersonas.length > 1 && (
                      <button
                        onClick={() => removeUserPersona(persona.id)}
                        className="text-sm"
                        style={{ color: '#E6B800' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Persona Name <span style={{ color: '#E6B800' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={persona.name}
                      onChange={(e) => updateUserPersona(persona.id, 'name', e.target.value)}
                      placeholder="e.g., Kadiatu the Farmer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description <span style={{ color: '#E6B800' }}>*</span>
                    </label>
                    <textarea
                      value={persona.description}
                      onChange={(e) => updateUserPersona(persona.id, 'description', e.target.value)}
                      placeholder="e.g., A 45-year-old smallholder farmer in Makeni, owns a basic feature phone, leads a local cooperative."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Core User Task <span style={{ color: '#E6B800' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={persona.coreTask}
                      onChange={(e) => updateUserPersona(persona.id, 'coreTask', e.target.value)}
                      placeholder="e.g., Register a new batch of produce for tracking"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Goals <span style={{ color: '#E6B800' }}>*</span>
                    </label>
                    <textarea
                      value={persona.goals}
                      onChange={(e) => updateUserPersona(persona.id, 'goals', e.target.value)}
                      placeholder="e.g., Get a fair price for her ginger"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frustrations <span style={{ color: '#E6B800' }}>*</span>
                    </label>
                    <textarea
                      value={persona.frustrations}
                      onChange={(e) => updateUserPersona(persona.id, 'frustrations', e.target.value)}
                      placeholder="e.g., Middlemen always cheat her on price"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addUserPersona}
                className="w-full py-2 border-2 border-dashed rounded-lg"
                style={{ 
                  borderColor: '#d8cdbc', 
                  color: '#403f3e',
                  fontFamily: 'Raleway, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#E6B800';
                  e.currentTarget.style.color = '#E6B800';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d8cdbc';
                  e.currentTarget.style.color = '#403f3e';
                }}
              >
                + Add Another User Persona
              </button>

              {showStep1Errors && !canProceedStep1() && (
                <p className="text-sm" style={{ color: '#E6B800', fontFamily: 'Raleway, sans-serif' }}>Please complete at least one user persona</p>
              )}
            </div>
          )}

          {/* Step 2: Features & User Stories */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Features & User Stories</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Define specific features and how they serve your users.
                </p>
              </div>

              {features.map((feature, idx) => (
                <div key={feature.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Feature {idx + 1}</h4>
                    {features.length > 1 && (
                      <button
                        onClick={() => removeFeature(feature.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feature Name <span style={{ color: '#E6B800' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={feature.name}
                      onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
                      placeholder="e.g., Farmer Onboarding"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Story <span style={{ color: '#E6B800' }}>*</span>
                    </label>
                    <textarea
                      value={feature.userStory}
                      onChange={(e) => updateFeature(feature.id, 'userStory', e.target.value)}
                      placeholder="As a [Persona Name], I want to [Action], so that I can [Benefit]."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Acceptance Criteria <span style={{ color: '#E6B800' }}>*</span>
                    </label>
                    <textarea
                      value={feature.acceptanceCriteria}
                      onChange={(e) => updateFeature(feature.id, 'acceptanceCriteria', e.target.value)}
                      placeholder="1. User can register via USSD&#10;2. A unique ID is generated&#10;3. A confirmation SMS is sent"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addFeature}
                className="w-full py-2 border-2 border-dashed rounded-lg"
                style={{ 
                  borderColor: '#d8cdbc', 
                  color: '#403f3e',
                  fontFamily: 'Raleway, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#E6B800';
                  e.currentTarget.style.color = '#E6B800';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d8cdbc';
                  e.currentTarget.style.color = '#403f3e';
                }}
              >
                + Add Another Feature
              </button>

              {showStep2Errors && !canProceedStep2() && (
                <p className="text-sm" style={{ color: '#E6B800', fontFamily: 'Raleway, sans-serif' }}>Please complete at least one feature</p>
              )}
            </div>
          )}

          {/* Step 3: Scope Definition */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scope Definition</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Be realistic about what you can achieve in Version 1. List features that will come later.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Out of Scope Features (for Version 1)
                </label>
                <textarea
                  value={outOfScope}
                  onChange={(e) => setOutOfScope(e.target.value)}
                  placeholder="e.g.,&#10;- Direct mobile money integration&#10;- A web-based dashboard for buyers&#10;- Multi-language support&#10;- Advanced analytics"
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-sm text-gray-500 mt-1">
                  List important ideas that will be saved for future releases
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Success Metrics */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Metrics</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Define how you&apos;ll measure the success of your product.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Performance Indicators (KPIs) <span style={{ color: '#E6B800' }}>*</span>
                </label>
                <textarea
                  value={kpis}
                  onChange={(e) => setKpis(e.target.value)}
                  placeholder="List 3-5 quantifiable metrics, e.g.,&#10;- Number of registered farmers&#10;- Weekly active users&#10;- Average transaction value&#10;- User retention rate (30-day)&#10;- Customer satisfaction score"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {showStep4Errors && !kpis.trim() && (
                  <p className="text-sm mt-1" style={{ color: '#E6B800', fontFamily: 'Raleway, sans-serif' }}>KPIs are required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National Impact Goal <span style={{ color: '#E6B800' }}>*</span>
                </label>
                <textarea
                  value={impactGoal}
                  onChange={(e) => setImpactGoal(e.target.value)}
                  placeholder="What is the single most important long-term impact metric you are aiming for?&#10;&#10;e.g., Increase the average income of our registered farmers by 25% within 2 years"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {showStep4Errors && !impactGoal.trim() && (
                  <p className="text-sm mt-1" style={{ color: '#E6B800', fontFamily: 'Raleway, sans-serif' }}>National impact goal is required</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Generated Output */}
          {step === 5 && (
            <div className="space-y-6">
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Generating your complete PRD with integrated implementation phases...</p>
                  <p className="mt-2 text-sm text-gray-500">This includes all phases with AI development prompts</p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Complete PRD with Implementation Phases</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Complete PRD document with integrated implementation phases and AI development prompts
                    </p>
                    {implementationPhases.length > 0 && (
                      <p className="text-xs text-gray-500 mb-2">
                        Generated {implementationPhases.length} implementation phases with AI prompts
                      </p>
                    )}
                  </div>

                  {/* Complete Document */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Complete PRD with Implementation Phases</h4>
                      <div className="space-x-2">
                        <button
                          onClick={() => downloadMarkdown(generatedPRD, `${projectName.replace(/\s+/g, '-')}-Complete-PRD.md`)}
                          className="px-3 py-1 text-sm rounded-full"
                          style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                        >
                          Download Complete Document
                        </button>
                      </div>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{generatedPRD}</pre>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: '#e8ddd0' }}>
          <div className="flex items-center gap-3">
            <div className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
              {step < 5 ? 'Inputs are not persisted in this MVP' : 'PRD and Implementation Plan generated with your inputs'}
            </div>
            {copyFeedback && (
              <div className="text-xs" style={{ color: '#10B981', fontFamily: 'Raleway, sans-serif', fontWeight: 500 }}>
                ✓ Copied to clipboard!
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && step < 5 && (
              <button
                className="px-3 py-2 rounded-full"
                style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {step < 5 && (
              <button
                className="px-3 py-2 rounded-full"
                style={{ backgroundColor: '#E6B800', color: '#403f3e', fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}
                onClick={handleNext}
              >
                {step === 4 ? 'Generate PRD & Implementation Plan' : 'Next'}
              </button>
            )}
            {step === 5 && (
              <button
                className="px-3 py-2 rounded-full"
                style={{ backgroundColor: '#E6B800', color: '#403f3e', fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}
                onClick={() => copyToClipboard(generatedPRD)}
              >
                Copy Complete Document
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDKitModal;

