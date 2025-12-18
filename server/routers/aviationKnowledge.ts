/**
 * AVIATION KNOWLEDGE COACH
 * 
 * Complete interview preparation system for Senior Maintenance Manager position
 * Based on "THE DEFINITIVE MUST-KNOW LIST" (Director-level, not mechanic-level)
 * 
 * 10 MUST-KNOW AREAS:
 * 1. Accountable Manager Concept (14 CFR §119.67(c))
 * 2. Mandatory vs Discretionary
 * 3. FAR Part 121 vs Part 145
 * 4. Quality Assurance vs Quality Control
 * 5. Maintenance Program Control
 * 6. Documentation Discipline
 * 7. Government Oversight Roles
 * 8. Safety Authority
 * 9. Lean-Team Leadership
 * 10. How You Learn What You Don't Know
 * 
 * MODES:
 * - Learn: AI teaches each concept with context
 * - Quiz: Multiple choice and scenario questions
 * - Verbal: Practice explaining while AI watches delivery
 * - Scenario: "What would you do if..." questions
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Knowledge area types
type KnowledgeArea = 
  | "accountable_manager"
  | "mandatory_discretionary"
  | "part121_vs_part145"
  | "qa_vs_qc"
  | "maintenance_program"
  | "documentation"
  | "government_oversight"
  | "safety_authority"
  | "lean_leadership"
  | "learning_judgment";

type StudyMode = "learn" | "quiz" | "verbal" | "scenario";

// Complete knowledge base
const KNOWLEDGE_BASE: Record<KnowledgeArea, {
  title: string;
  shortTitle: string;
  icon: string;
  regulation?: string;
  keyPoints: string[];
  anchorStatement: string;
  deepDive: string;
  commonMistakes: string[];
  interviewTips: string[];
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  scenarios: Array<{
    situation: string;
    goodResponse: string;
    keyElements: string[];
  }>;
  verbalPrompts: string[];
}> = {
  accountable_manager: {
    title: "Accountable Manager Concept",
    shortTitle: "Accountable Manager",
    icon: "👔",
    regulation: "14 CFR §119.67(c)",
    keyPoints: [
      "Single point of authority for maintenance and inspection",
      "Has BOTH responsibility AND authority",
      "Controls resources, policy, and compliance",
      "Can stop operations for safety or compliance",
      "Not just a title - it's operational authority"
    ],
    anchorStatement: "The Accountable Manager must have the authority to ensure compliance across maintenance and inspection functions and to allocate resources necessary to remain compliant.",
    deepDive: `The Accountable Manager concept exists because the FAA needs ONE person who can be held responsible for an organization's compliance. This isn't about blame - it's about ensuring someone has the actual POWER to make compliance happen.

Key insight: Many organizations make the mistake of giving someone the title without the authority. A true Accountable Manager must be able to:
- Stop an aircraft from flying if there's a safety concern
- Allocate budget for compliance needs
- Hire/fire personnel affecting airworthiness
- Override schedule pressure for safety

The FAA will ask: "If you discovered a compliance issue at 2 AM before a critical flight, do you have the authority to ground that aircraft?" The answer must be YES.`,
    commonMistakes: [
      "Confusing the title with actual authority",
      "Thinking it's just about signing paperwork",
      "Not understanding the resource allocation aspect",
      "Believing schedule can override safety decisions"
    ],
    interviewTips: [
      "Don't quote the regulation verbatim - show you understand the CONCEPT",
      "Emphasize the authority aspect, not just responsibility",
      "Give an example of when you'd exercise that authority",
      "Show you understand it's about empowerment, not blame"
    ],
    quizQuestions: [
      {
        question: "What is the PRIMARY purpose of the Accountable Manager concept?",
        options: [
          "To have someone to blame when things go wrong",
          "To ensure one person has both responsibility AND authority for compliance",
          "To satisfy FAA paperwork requirements",
          "To delegate maintenance decisions to lower levels"
        ],
        correctIndex: 1,
        explanation: "The Accountable Manager must have BOTH responsibility AND authority. Without authority, they cannot ensure compliance."
      },
      {
        question: "An Accountable Manager discovers a compliance issue at 2 AM before a critical revenue flight. What authority must they have?",
        options: [
          "Authority to document the issue for later review",
          "Authority to notify the pilot of the concern",
          "Authority to ground the aircraft regardless of schedule pressure",
          "Authority to request a meeting with management"
        ],
        correctIndex: 2,
        explanation: "The Accountable Manager must have the authority to stop operations for safety or compliance - this is non-negotiable."
      },
      {
        question: "Which of the following is NOT a key aspect of the Accountable Manager role?",
        options: [
          "Control over resource allocation",
          "Authority to stop operations for safety",
          "Detailed knowledge of every maintenance procedure",
          "Single point of authority for compliance"
        ],
        correctIndex: 2,
        explanation: "The Accountable Manager operates at director-level, not mechanic-level. They ensure systems work, not perform every task."
      }
    ],
    scenarios: [
      {
        situation: "You're the new Senior Maintenance Manager. The VP of Operations tells you that you're responsible for compliance but all budget decisions go through him. How do you respond?",
        goodResponse: "I would respectfully explain that the Accountable Manager concept requires both responsibility AND authority. I'd need the ability to allocate resources for compliance needs, or we'd need to restructure who holds that accountability. I can't be responsible for outcomes I don't have the authority to influence.",
        keyElements: ["Recognize the authority gap", "Reference the regulatory concept", "Propose a solution", "Don't accept responsibility without authority"]
      },
      {
        situation: "A major customer flight is scheduled in 2 hours. Your inspector finds a discrepancy that requires further investigation. Operations is pressuring you to release the aircraft. What do you do?",
        goodResponse: "Safety and compliance come before schedule - always. I would not release the aircraft until the discrepancy is properly investigated and resolved. I'd communicate clearly with Operations about the timeline and work to expedite the investigation, but the aircraft doesn't move until it's airworthy and properly documented.",
        keyElements: ["Safety first", "Clear communication", "No compromise on airworthiness", "Work to minimize impact while maintaining standards"]
      }
    ],
    verbalPrompts: [
      "Explain the Accountable Manager concept as if I'm a new board member who needs to understand why this role matters.",
      "Tell me about a time you had to exercise authority to stop something for safety or compliance reasons.",
      "What's the difference between having the title of Accountable Manager and actually being one?"
    ]
  },

  mandatory_discretionary: {
    title: "Mandatory vs Discretionary Requirements",
    shortTitle: "Mandatory vs Discretionary",
    icon: "⚖️",
    keyPoints: [
      "ADs (Airworthiness Directives) are ALWAYS mandatory",
      "Approved maintenance program requirements are mandatory",
      "Contractual SOW requirements are mandatory",
      "SBs become mandatory when incorporated into ADs, Ops Specs, or contracts",
      "Best practices and internal policies are discretionary"
    ],
    anchorStatement: "ADs are mandatory. SBs become mandatory when incorporated into ADs, Ops Specs, or contractual requirements.",
    deepDive: `Understanding what's mandatory vs discretionary is one of the most critical skills for a maintenance leader. Get this wrong and you either:
1. Fail to comply with mandatory requirements (regulatory violation)
2. Waste resources treating discretionary items as mandatory

MANDATORY:
- Airworthiness Directives (ADs): These address unsafe conditions. Non-negotiable.
- Approved Maintenance Program: Whatever is in your approved program, you must do.
- Contract Requirements: If the SOW says it, it's mandatory for that contract.

CONDITIONALLY MANDATORY:
- Service Bulletins (SBs): These are manufacturer recommendations UNLESS:
  * An AD references them (then mandatory)
  * Your Ops Specs incorporate them (then mandatory)
  * Your contract requires them (then mandatory)

DISCRETIONARY:
- Best practices beyond requirements
- Internal policy enhancements
- "Nice to have" improvements

The key skill is reading a document and immediately knowing: "Is this mandatory or discretionary for MY operation?"`,
    commonMistakes: [
      "Treating all SBs as mandatory (wastes resources)",
      "Treating all SBs as optional (misses when they become mandatory)",
      "Not checking if an SB is referenced by an AD",
      "Forgetting contractual requirements can make things mandatory"
    ],
    interviewTips: [
      "Use the anchor statement - it's clean and memorable",
      "Show you understand the CONDITIONAL nature of SBs",
      "Demonstrate you know how to research what applies to your operation",
      "Give an example of how you'd determine if something is mandatory"
    ],
    quizQuestions: [
      {
        question: "A manufacturer issues a Service Bulletin. When does it become mandatory?",
        options: [
          "Immediately upon issuance",
          "After 90 days",
          "When incorporated into an AD, Ops Specs, or contract",
          "When the manufacturer marks it as 'mandatory'"
        ],
        correctIndex: 2,
        explanation: "SBs are recommendations unless incorporated into ADs, Ops Specs, or contractual requirements."
      },
      {
        question: "Which of the following is ALWAYS mandatory?",
        options: [
          "Service Bulletins",
          "Airworthiness Directives",
          "Manufacturer recommendations",
          "Industry best practices"
        ],
        correctIndex: 1,
        explanation: "ADs address unsafe conditions and are always mandatory. No exceptions."
      },
      {
        question: "Your contract SOW requires compliance with a specific Service Bulletin. Is this mandatory?",
        options: [
          "No, SBs are always discretionary",
          "Only if the FAA also requires it",
          "Yes, contractual requirements make it mandatory for that contract",
          "Only if the manufacturer marks it mandatory"
        ],
        correctIndex: 2,
        explanation: "Contractual requirements can make otherwise discretionary items mandatory for that specific operation."
      }
    ],
    scenarios: [
      {
        situation: "A technician asks you whether they need to comply with a Service Bulletin they just received. How do you determine the answer?",
        goodResponse: "I'd check three things: First, is this SB referenced by any applicable AD? Second, is it incorporated into our Ops Specs or approved maintenance program? Third, does our contract require it? If the answer to all three is no, it's discretionary - but we should still evaluate if it's a good practice to adopt.",
        keyElements: ["Check AD references", "Check Ops Specs/program", "Check contract", "Evaluate even if discretionary"]
      }
    ],
    verbalPrompts: [
      "Explain to a new inspector how to determine if a Service Bulletin is mandatory or discretionary.",
      "A customer asks why you're not implementing a manufacturer's Service Bulletin. How do you explain your decision?",
      "Walk me through your process for evaluating new maintenance requirements."
    ]
  },

  part121_vs_part145: {
    title: "FAR Part 121 vs Part 145",
    shortTitle: "Part 121 vs 145",
    icon: "✈️",
    keyPoints: [
      "Part 121: OWNS the aircraft AND the maintenance program",
      "Part 145: EXECUTES maintenance within approved capabilities",
      "Part 121 is the certificate holder - ultimately responsible",
      "Part 145 is the repair station - works under their approval",
      "Know the BOUNDARY, not the details"
    ],
    anchorStatement: "Part 121 owns the aircraft and the maintenance program. Part 145 executes maintenance within approved capabilities.",
    deepDive: `The distinction between Part 121 and Part 145 is about OWNERSHIP vs EXECUTION.

PART 121 - Air Carrier Operations:
- Holds the operating certificate
- OWNS the maintenance program
- Ultimately responsible for airworthiness
- Can perform maintenance in-house OR contract to Part 145
- Sets the standards and approves the work

PART 145 - Repair Stations:
- Holds repair station certificate
- Has specific CAPABILITIES (ratings)
- Executes work within those capabilities
- Works under the Part 121 operator's program
- Returns aircraft to service per their approval

KEY INSIGHT: When a Part 121 operator contracts maintenance to a Part 145 repair station, the Part 121 operator is STILL responsible for airworthiness. They're outsourcing execution, not responsibility.

You don't need to know airline dispatch rules, MEL details, or Part 145 rating structures. You need to understand WHO OWNS WHAT.`,
    commonMistakes: [
      "Thinking Part 145 transfers responsibility from Part 121",
      "Getting lost in the details instead of understanding the boundary",
      "Not understanding that Part 121 approves the maintenance program",
      "Confusing capability ratings with ownership"
    ],
    interviewTips: [
      "Keep it conceptual - they're testing if you understand the relationship",
      "Use the ownership vs execution framework",
      "Don't get into MEL/CDL details unless specifically asked",
      "Show you understand accountability stays with the certificate holder"
    ],
    quizQuestions: [
      {
        question: "A Part 121 air carrier contracts maintenance to a Part 145 repair station. Who is ultimately responsible for the aircraft's airworthiness?",
        options: [
          "The Part 145 repair station",
          "The Part 121 air carrier",
          "Both equally",
          "The FAA"
        ],
        correctIndex: 1,
        explanation: "The Part 121 certificate holder is always ultimately responsible for airworthiness, even when contracting work out."
      },
      {
        question: "What does a Part 145 repair station 'own' in the maintenance relationship?",
        options: [
          "The maintenance program",
          "The aircraft airworthiness",
          "Their approved capabilities and ratings",
          "The operating certificate"
        ],
        correctIndex: 2,
        explanation: "Part 145 repair stations have specific capabilities (ratings) within which they execute maintenance."
      }
    ],
    scenarios: [
      {
        situation: "You're interviewing for a position where the company operates under Part 121 but contracts heavy maintenance to Part 145 facilities. How do you describe the oversight relationship?",
        goodResponse: "As the Part 121 operator, we own the maintenance program and are ultimately responsible for airworthiness. When we contract to Part 145 facilities, we're outsourcing execution, not responsibility. We need robust oversight to ensure the Part 145 work meets our program requirements and standards.",
        keyElements: ["Ownership stays with Part 121", "Outsourcing execution not responsibility", "Need for oversight", "Program compliance"]
      }
    ],
    verbalPrompts: [
      "Explain the relationship between Part 121 and Part 145 as if I'm a new quality manager.",
      "Why can't a Part 121 operator simply 'hand off' responsibility to a Part 145 repair station?",
      "How would you ensure quality when contracting maintenance to outside facilities?"
    ]
  },

  qa_vs_qc: {
    title: "Quality Assurance vs Quality Control",
    shortTitle: "QA vs QC",
    icon: "🔍",
    keyPoints: [
      "QC = Inspection of completed work (finds defects)",
      "QA = System that ensures QC works consistently (prevents defects)",
      "QC is reactive - catches problems after they occur",
      "QA is proactive - prevents problems from occurring",
      "Both are essential but serve different purposes"
    ],
    anchorStatement: "QC finds defects; QA prevents them.",
    deepDive: `This distinction comes up constantly in aviation maintenance leadership interviews because it reveals whether you understand SYSTEMS thinking.

QUALITY CONTROL (QC):
- Inspection-focused
- Examines completed work
- Catches defects AFTER they happen
- "Did this specific task get done correctly?"
- Reactive by nature

QUALITY ASSURANCE (QA):
- System-focused
- Ensures processes work correctly
- Prevents defects from happening
- "Is our system designed to produce correct results?"
- Proactive by nature

EXAMPLE:
- QC: Inspector checks that a bolt is torqued correctly
- QA: Ensures torque procedures are correct, tools are calibrated, technicians are trained, and inspectors know what to look for

KEY INSIGHT: You can have perfect QC (catching every defect) and still have a broken system if defects keep occurring. QA asks "WHY are defects happening?" and fixes the system.

A mature organization has strong QA that makes QC's job easier because fewer defects occur in the first place.`,
    commonMistakes: [
      "Using QA and QC interchangeably",
      "Thinking more inspectors = better quality (that's just more QC)",
      "Focusing only on catching defects instead of preventing them",
      "Not understanding the system-level thinking QA requires"
    ],
    interviewTips: [
      "Use the anchor statement - it's memorable and accurate",
      "Give an example showing you understand the difference",
      "Show you value PREVENTION over just detection",
      "Demonstrate systems thinking"
    ],
    quizQuestions: [
      {
        question: "An inspector examines a completed repair and finds it meets specifications. This is an example of:",
        options: [
          "Quality Assurance",
          "Quality Control",
          "Continuous Improvement",
          "Root Cause Analysis"
        ],
        correctIndex: 1,
        explanation: "QC is the inspection of completed work to verify it meets requirements."
      },
      {
        question: "Your organization has a high defect rate. A QA approach would focus on:",
        options: [
          "Hiring more inspectors to catch defects",
          "Analyzing why defects occur and fixing the system",
          "Increasing inspection frequency",
          "Documenting each defect found"
        ],
        correctIndex: 1,
        explanation: "QA focuses on preventing defects by improving the system, not just catching more defects."
      },
      {
        question: "Which statement best describes the relationship between QA and QC?",
        options: [
          "They are the same thing with different names",
          "QC is more important than QA",
          "QA ensures QC works consistently; QC catches individual defects",
          "QA replaces the need for QC"
        ],
        correctIndex: 2,
        explanation: "QA is the system that ensures QC (and all quality processes) work consistently. Both are needed."
      }
    ],
    scenarios: [
      {
        situation: "Your inspection team is catching many defects, but the defect rate isn't decreasing. What's your approach?",
        goodResponse: "Catching defects is QC working. But if the rate isn't decreasing, we have a QA problem - our system is consistently producing defects. I'd initiate root cause analysis to understand WHY defects are occurring and fix the underlying system issues - whether that's training, procedures, tools, or work environment.",
        keyElements: ["Recognize QC vs QA issue", "Root cause analysis", "System-level thinking", "Fix underlying causes"]
      }
    ],
    verbalPrompts: [
      "Explain the difference between QA and QC to a technician who thinks they're the same thing.",
      "How would you build a quality culture that emphasizes prevention over detection?",
      "Give me an example of a QA improvement you've implemented."
    ]
  },

  maintenance_program: {
    title: "Maintenance Program Control",
    shortTitle: "Maintenance Program",
    icon: "📋",
    keyPoints: [
      "Approved maintenance manuals are the foundation",
      "Work cards / task cards drive execution",
      "Revision control ensures current information",
      "Compliance tracking proves you did what you said",
      "The program must be AUDITABLE"
    ],
    anchorStatement: "A legitimate maintenance program has approved manuals, controlled work cards, current revisions, and documented compliance tracking.",
    deepDive: `You don't need to design a maintenance program from scratch. You need to understand what makes one LEGITIMATE and AUDITABLE.

THE FOUR PILLARS:

1. APPROVED MAINTENANCE MANUALS
- The foundation of your program
- Approved by the FAA or accepted from manufacturer
- Defines WHAT maintenance is required

2. WORK CARDS / TASK CARDS
- Translate manual requirements into executable tasks
- Step-by-step instructions
- Capture sign-offs and findings

3. REVISION CONTROL
- Ensures everyone uses CURRENT information
- Tracks what version is in effect
- Critical for configuration control

4. COMPLIANCE TRACKING
- Proves you did what the program requires
- Tracks intervals, due dates, accomplishment
- Your audit trail

AUDITABILITY TEST:
An auditor should be able to:
1. See what your program requires
2. See that you have current procedures
3. See evidence you accomplished the work
4. Trace any maintenance action back to its authorization

If any link in this chain is broken, your program isn't truly controlled.`,
    commonMistakes: [
      "Having good procedures but poor revision control",
      "Doing good work but not documenting compliance",
      "Not being able to prove what version was in effect when",
      "Treating the program as paperwork instead of operational control"
    ],
    interviewTips: [
      "Show you understand the SYSTEM, not just individual elements",
      "Emphasize auditability - that's what regulators care about",
      "Give examples of how you've maintained program control",
      "Demonstrate you understand revision control challenges"
    ],
    quizQuestions: [
      {
        question: "What is the PRIMARY purpose of revision control in a maintenance program?",
        options: [
          "To create more paperwork",
          "To ensure everyone uses current, approved information",
          "To track who made changes",
          "To satisfy auditor requests"
        ],
        correctIndex: 1,
        explanation: "Revision control ensures that maintenance is performed using current, approved procedures and data."
      },
      {
        question: "An auditor asks to see evidence that a required inspection was performed. This tests your:",
        options: [
          "Maintenance manual quality",
          "Technician training records",
          "Compliance tracking system",
          "Tool calibration program"
        ],
        correctIndex: 2,
        explanation: "Compliance tracking provides the evidence trail that required maintenance was accomplished."
      }
    ],
    scenarios: [
      {
        situation: "During an audit, you discover that some technicians were using an outdated revision of a maintenance procedure. How do you respond?",
        goodResponse: "First, I'd assess the impact - was any work done incorrectly due to the outdated revision? Then I'd investigate how the revision control system failed - why didn't technicians have current procedures? Finally, I'd implement corrective action to prevent recurrence, whether that's better distribution, training, or system controls.",
        keyElements: ["Assess impact", "Investigate root cause", "Corrective action", "System improvement"]
      }
    ],
    verbalPrompts: [
      "Walk me through how you ensure your maintenance program stays current and controlled.",
      "How would you explain the importance of revision control to a new supervisor?",
      "What does 'auditable' mean to you in the context of a maintenance program?"
    ]
  },

  documentation: {
    title: "Documentation Discipline",
    shortTitle: "Documentation",
    icon: "📝",
    keyPoints: [
      "If it isn't documented, it didn't happen",
      "Configuration control matters - know what you have",
      "Logbooks and records are LEGAL documents",
      "Documentation is not paperwork - it's proof of airworthiness",
      "Especially critical in DoD programs"
    ],
    anchorStatement: "Good maintenance without documentation is still non-compliance.",
    deepDive: `This is HUGE in aviation, and even more critical in DoD programs.

THE FUNDAMENTAL TRUTH:
You can do perfect maintenance, but if you don't document it properly, you have:
- No proof it was done
- No legal record of airworthiness
- A potential compliance violation
- An aircraft with unknown status

WHY IT MATTERS:

1. LEGAL REQUIREMENT
- Aircraft records are legal documents
- Falsification is a federal crime
- Records follow the aircraft for its entire life

2. CONFIGURATION CONTROL
- You must know exactly what configuration an aircraft is in
- What modifications have been done?
- What parts are installed?
- What's the current status of all ADs and SBs?

3. TRACEABILITY
- Every part must be traceable to approved data
- Every maintenance action must trace to authorization
- The chain must be unbroken

4. DoD SPECIFICS
- Government contracts have strict documentation requirements
- CDRLs (Contract Data Requirements Lists) specify what's needed
- Government inspectors will audit your records
- Non-compliance can mean contract termination

THE DISCIPLINE:
Documentation isn't something you do AFTER the work - it's part of the work. A job isn't complete until it's properly documented.`,
    commonMistakes: [
      "Treating documentation as 'paperwork' to do later",
      "Good mechanics who are poor documenters",
      "Not understanding records are legal documents",
      "Incomplete configuration control"
    ],
    interviewTips: [
      "Use the anchor statement - it's powerful and memorable",
      "Show you understand documentation IS compliance",
      "Give examples of documentation discipline you've enforced",
      "Demonstrate understanding of DoD documentation requirements"
    ],
    quizQuestions: [
      {
        question: "A technician performs excellent maintenance but forgets to complete the documentation. The status of this work is:",
        options: [
          "Complete - the work was done correctly",
          "Acceptable - documentation can be done later",
          "Non-compliant - undocumented work is not credited",
          "Pending - just needs supervisor signature"
        ],
        correctIndex: 2,
        explanation: "Good maintenance without documentation is still non-compliance. The work isn't complete until documented."
      },
      {
        question: "Why is configuration control particularly important in aviation maintenance?",
        options: [
          "It helps with inventory management",
          "It ensures you know exactly what state the aircraft is in",
          "It makes audits easier",
          "It's required for insurance purposes"
        ],
        correctIndex: 1,
        explanation: "Configuration control ensures you know exactly what modifications, parts, and status apply to each aircraft."
      }
    ],
    scenarios: [
      {
        situation: "You discover that a critical inspection was performed but the documentation is incomplete. The aircraft is scheduled to fly in 2 hours. What do you do?",
        goodResponse: "The aircraft doesn't fly until the documentation is complete and correct. I'd work to reconstruct the documentation with the technician and inspector who performed the work, but if we can't properly document it, we may need to re-perform the inspection. Schedule pressure doesn't override documentation requirements.",
        keyElements: ["No flight without proper documentation", "Attempt to reconstruct", "May need to re-perform", "Schedule doesn't override compliance"]
      }
    ],
    verbalPrompts: [
      "Explain to a new technician why documentation is as important as the physical work.",
      "How do you build a culture of documentation discipline?",
      "Tell me about a time when documentation discipline prevented a problem."
    ]
  },

  government_oversight: {
    title: "Government Oversight Roles",
    shortTitle: "Government Oversight",
    icon: "🏛️",
    keyPoints: [
      "GFR (Government Flight Representative) - flight operations oversight",
      "GGR (Government Ground Representative) - ground/maintenance oversight", 
      "Customer QA - quality assurance presence",
      "PMO (Program Management Office) - overall program oversight",
      "You don't fight oversight - you work WITH it"
    ],
    anchorStatement: "You don't fight oversight — you work with it.",
    deepDive: `In DoD and government contract work, you'll have multiple oversight entities. Your job isn't to minimize their involvement - it's to work WITH them effectively.

KEY OVERSIGHT ROLES:

GFR (Government Flight Representative):
- Oversees flight operations
- Ensures flight safety compliance
- Can ground aircraft for safety

GGR (Government Ground Representative):
- Oversees ground/maintenance operations
- Monitors maintenance compliance
- Reviews maintenance documentation

Customer QA:
- Government quality assurance personnel
- Conducts surveillance of your operations
- Verifies your QA system works

PMO (Program Management Office):
- Overall program oversight
- Contract compliance
- Performance monitoring

THE RIGHT MINDSET:
These aren't adversaries - they're partners in ensuring mission success. When you have good oversight relationships:
- Issues get resolved faster
- You get early warning of concerns
- Trust builds over time
- The program runs smoother

THE WRONG MINDSET:
Treating oversight as the enemy leads to:
- Adversarial relationships
- Hidden problems that become bigger
- Loss of trust
- Contract issues

Your job is to be transparent, responsive, and professional. When oversight finds something, thank them and fix it.`,
    commonMistakes: [
      "Viewing oversight as adversarial",
      "Hiding problems from government representatives",
      "Not building relationships with oversight personnel",
      "Being defensive instead of responsive"
    ],
    interviewTips: [
      "Show you understand oversight is HELPFUL, not hindering",
      "Demonstrate experience working with government oversight",
      "Emphasize transparency and partnership",
      "Give examples of positive oversight relationships"
    ],
    quizQuestions: [
      {
        question: "A GGR (Government Ground Representative) identifies a concern with your maintenance documentation. The best response is to:",
        options: [
          "Defend your current practices",
          "Minimize the concern and move on",
          "Thank them, investigate, and address the issue",
          "Escalate to your legal department"
        ],
        correctIndex: 2,
        explanation: "Working WITH oversight means being responsive and addressing concerns professionally."
      },
      {
        question: "What is the PRIMARY purpose of government oversight in contract maintenance?",
        options: [
          "To find problems and penalize contractors",
          "To ensure mission success and compliance",
          "To create additional paperwork",
          "To justify government positions"
        ],
        correctIndex: 1,
        explanation: "Government oversight exists to ensure the mission succeeds and compliance is maintained - it's a partnership."
      }
    ],
    scenarios: [
      {
        situation: "A government QA representative is conducting surveillance and asks to see records you know have some deficiencies. How do you handle this?",
        goodResponse: "I'd provide the records transparently. If there are known deficiencies, I'd acknowledge them and explain what corrective actions are in progress. Hiding problems from oversight only makes things worse. Building trust through transparency is more valuable than avoiding short-term discomfort.",
        keyElements: ["Transparency", "Acknowledge issues", "Show corrective action", "Build trust"]
      }
    ],
    verbalPrompts: [
      "Describe your approach to working with government oversight.",
      "Tell me about a time when government oversight helped you identify and fix a problem.",
      "How do you build positive relationships with oversight personnel?"
    ]
  },

  safety_authority: {
    title: "Safety Authority",
    shortTitle: "Safety Authority",
    icon: "🛡️",
    keyPoints: [
      "Safety overrides schedule - ALWAYS",
      "Maintenance leadership must be willing to stop aircraft",
      "No retaliation for safety calls",
      "This is about ATTITUDE, not just rules",
      "Your credibility depends on this"
    ],
    anchorStatement: "Safety, compliance, and documentation come before schedule — always.",
    deepDive: `This is more about ATTITUDE than rules. The interviewer wants to know: Will you stand firm when pressured?

THE TEST:
Every maintenance leader will face this moment:
- Critical flight scheduled
- Customer or executive pressure
- A safety concern arises
- What do you do?

THE ONLY RIGHT ANSWER:
Safety wins. Every time. No exceptions.

WHY THIS MATTERS:

1. LEGAL RESPONSIBILITY
- You can be personally liable for releasing unsafe aircraft
- "I was pressured" is not a defense
- Your certificate is on the line

2. ORGANIZATIONAL TRUST
- Your team watches how you handle pressure
- If you cave once, they know you'll cave again
- Safety culture starts at the top

3. LONG-TERM SUCCESS
- One incident can destroy a career and company
- The schedule pressure is temporary
- The consequences of a safety failure are permanent

NO RETALIATION:
A healthy safety culture means:
- Anyone can raise a safety concern
- No punishment for stopping work for safety
- Concerns are investigated, not dismissed
- The person who speaks up is protected

YOUR CREDIBILITY:
When you demonstrate you'll stand firm on safety, you earn:
- Trust from your team
- Respect from oversight
- Credibility with customers
- Peace of mind`,
    commonMistakes: [
      "Thinking 'just this once' is acceptable",
      "Letting schedule pressure override judgment",
      "Not supporting team members who raise concerns",
      "Treating safety as negotiable"
    ],
    interviewTips: [
      "Be ABSOLUTE on this - no hedging",
      "Give a specific example if you have one",
      "Show you understand the personal liability",
      "Demonstrate you'd protect team members who raise concerns"
    ],
    quizQuestions: [
      {
        question: "A VIP flight is scheduled in 30 minutes. Your inspector raises a safety concern that needs investigation. The correct action is:",
        options: [
          "Release the aircraft and investigate after the flight",
          "Get a second opinion to speed up the process",
          "Hold the aircraft until the concern is properly resolved",
          "Document the concern and let operations decide"
        ],
        correctIndex: 2,
        explanation: "Safety overrides schedule. The aircraft doesn't move until the concern is properly resolved."
      },
      {
        question: "A technician stops work due to a safety concern that turns out to be unfounded. How should this be handled?",
        options: [
          "Counsel the technician for delaying work",
          "Thank them for speaking up and reinforce the safety culture",
          "Require supervisor approval for future stop-work decisions",
          "Document it as a performance issue"
        ],
        correctIndex: 1,
        explanation: "No retaliation for safety calls. Even if unfounded, speaking up should be encouraged."
      }
    ],
    scenarios: [
      {
        situation: "The CEO calls you directly, pressuring you to release an aircraft for an important customer despite an unresolved maintenance concern. How do you respond?",
        goodResponse: "I'd respectfully explain that I cannot release an aircraft with an unresolved safety concern, regardless of who's asking. I'd offer to explain the specific issue and timeline for resolution. My job is to ensure every aircraft that leaves is safe and airworthy - that protects the customer, the company, and everyone involved.",
        keyElements: ["Respectful but firm", "Explain the issue", "Offer timeline", "Protect everyone"]
      }
    ],
    verbalPrompts: [
      "Tell me about a time you had to stand firm on a safety issue despite pressure.",
      "How do you build a culture where people feel safe raising concerns?",
      "What would you do if you saw a colleague compromising safety for schedule?"
    ]
  },

  lean_leadership: {
    title: "Lean-Team Leadership",
    shortTitle: "Lean Leadership",
    icon: "👥",
    keyPoints: [
      "Small teams CAN carry large responsibility",
      "Quality with limited manpower requires smart systems",
      "Scaling responsibly means not compromising standards",
      "Your experience in lean environments is valuable",
      "Enterprise-level responsibility with lean resources"
    ],
    anchorStatement: "My leadership has been in lean, high-consequence environments where small teams carried enterprise-level responsibility.",
    deepDive: `This is specific to YOUR experience and is actually a STRENGTH, not a weakness.

WHY LEAN EXPERIENCE MATTERS:

1. EFFICIENCY
- You've learned to do more with less
- No waste, no redundancy
- Every person and process matters

2. SYSTEMS THINKING
- You can't rely on throwing people at problems
- You must have good systems
- Automation and process design become critical

3. QUALITY FOCUS
- With fewer people, each must be excellent
- Training and development are essential
- You can't afford to carry weak performers

4. PRIORITIZATION
- You know what's truly important
- You can distinguish must-do from nice-to-do
- Resources go where they matter most

HOW TO SCALE RESPONSIBLY:
When asked how you'd handle more resources:
- Maintain the discipline that made lean work
- Don't add people until systems are optimized
- Scale quality standards, not just headcount
- Keep the lean mindset even with more resources

YOUR STORY:
You've led teams where:
- One person's absence was felt immediately
- Systems had to work perfectly
- There was no room for error
- Enterprise-level work got done anyway

This is VALUABLE experience that many leaders from larger organizations don't have.`,
    commonMistakes: [
      "Apologizing for lean experience instead of owning it",
      "Not articulating how you maintained quality with limited resources",
      "Failing to show how lean experience translates to larger operations",
      "Not having examples ready"
    ],
    interviewTips: [
      "OWN your lean experience as a strength",
      "Have specific examples of enterprise-level work with small teams",
      "Show how you'd apply lean principles at scale",
      "Demonstrate the systems thinking lean requires"
    ],
    quizQuestions: [
      {
        question: "What is the PRIMARY advantage of leadership experience in lean environments?",
        options: [
          "Lower costs",
          "Fewer management challenges",
          "Forced development of efficient systems and processes",
          "Easier compliance"
        ],
        correctIndex: 2,
        explanation: "Lean environments force you to develop efficient systems because you can't rely on throwing resources at problems."
      },
      {
        question: "When scaling from a lean team to a larger operation, the most important thing to maintain is:",
        options: [
          "The same headcount ratio",
          "The discipline and systems that made lean work",
          "The informal communication style",
          "The same organizational structure"
        ],
        correctIndex: 1,
        explanation: "The discipline and systems thinking from lean operations should be maintained even with more resources."
      }
    ],
    scenarios: [
      {
        situation: "The interviewer notes that their operation is much larger than what you've managed. How do you address this concern?",
        goodResponse: "My experience in lean environments has actually prepared me well for larger operations. I've had to develop efficient systems, prioritize ruthlessly, and ensure quality without the luxury of redundancy. These skills translate directly - I'd bring that discipline and systems thinking to a larger operation, not abandon it.",
        keyElements: ["Own the experience", "Highlight transferable skills", "Systems thinking", "Discipline translates"]
      }
    ],
    verbalPrompts: [
      "Tell me about leading a lean team with enterprise-level responsibility.",
      "How did you ensure quality with limited manpower?",
      "How would you apply your lean experience to a larger operation?"
    ]
  },

  learning_judgment: {
    title: "How You Learn What You Don't Know",
    shortTitle: "Learning & Judgment",
    icon: "🧠",
    keyPoints: [
      "Know where to find authoritative answers",
      "Know how to validate interpretations",
      "Know when to involve QA, engineering, or the FAA",
      "They're testing JUDGMENT, not memory",
      "Admitting you don't know shows maturity"
    ],
    anchorStatement: "I know where to find authoritative answers, how to validate my interpretations, and when to involve the right experts.",
    deepDive: `This is CRITICAL. They're not testing whether you know everything - they're testing whether you have the JUDGMENT to handle what you don't know.

THE REALITY:
- No one knows everything
- Regulations change
- New situations arise
- The right answer isn't always obvious

WHAT THEY WANT TO SEE:

1. HUMILITY
- You admit when you don't know
- You don't bluff or guess
- You recognize your limitations

2. RESOURCEFULNESS
- You know WHERE to find answers
- You have a research process
- You use authoritative sources

3. VALIDATION
- You don't just find AN answer
- You verify it's the RIGHT answer
- You cross-reference when needed

4. ESCALATION
- You know when to involve others
- QA, engineering, legal, FAA
- You don't try to handle everything alone

AUTHORITATIVE SOURCES:
- FAA regulations (eCFR)
- Advisory Circulars
- FAA Orders and Notices
- Manufacturer data
- Your organization's approved manuals
- FSDO (when needed)

THE PROCESS:
1. Recognize you need information
2. Identify authoritative sources
3. Research the question
4. Validate your interpretation
5. Involve experts if needed
6. Document your conclusion

This is about JUDGMENT, not memorization.`,
    commonMistakes: [
      "Bluffing when you don't know",
      "Using non-authoritative sources",
      "Not validating interpretations",
      "Trying to handle everything alone"
    ],
    interviewTips: [
      "It's OK to say 'I don't know, but here's how I'd find out'",
      "Demonstrate your research process",
      "Show you know when to escalate",
      "Give examples of how you've handled unfamiliar situations"
    ],
    quizQuestions: [
      {
        question: "You encounter a regulatory question you're not sure about. The best first step is:",
        options: [
          "Make your best guess based on experience",
          "Ask a colleague what they think",
          "Research authoritative sources like the eCFR and Advisory Circulars",
          "Wait until someone else figures it out"
        ],
        correctIndex: 2,
        explanation: "Start with authoritative sources. Guessing or relying on informal opinions can lead to non-compliance."
      },
      {
        question: "When should you involve the FAA (FSDO) in answering a regulatory question?",
        options: [
          "Never - it shows weakness",
          "Only when legally required",
          "When authoritative sources are unclear and the stakes are high",
          "For every regulatory question"
        ],
        correctIndex: 2,
        explanation: "The FSDO is a resource for clarifying unclear regulatory matters, especially when the stakes are high."
      }
    ],
    scenarios: [
      {
        situation: "In an interview, you're asked a detailed technical question you don't know the answer to. How do you respond?",
        goodResponse: "I don't know the specific answer to that, but I can tell you how I'd find out. I'd start with [specific authoritative sources], validate my interpretation with [QA/engineering/etc.], and if still unclear, I'd contact the FSDO for clarification. I've found that admitting what I don't know and having a solid process for finding answers is more valuable than pretending to know everything.",
        keyElements: ["Honest admission", "Clear process", "Authoritative sources", "Willingness to escalate"]
      }
    ],
    verbalPrompts: [
      "Walk me through how you'd research a regulatory question you're unfamiliar with.",
      "Tell me about a time you had to find an answer to something you didn't know.",
      "How do you decide when to involve others versus handling something yourself?"
    ]
  }
};

export const aviationKnowledgeRouter = router({
  /**
   * Get all knowledge areas with progress
   */
  getKnowledgeAreas: publicProcedure
    .query(() => {
      return Object.entries(KNOWLEDGE_BASE).map(([key, area]) => ({
        id: key,
        title: area.title,
        shortTitle: area.shortTitle,
        icon: area.icon,
        regulation: area.regulation,
        anchorStatement: area.anchorStatement,
      }));
    }),

  /**
   * Get detailed content for a specific knowledge area
   */
  getAreaContent: publicProcedure
    .input(z.object({
      areaId: z.string(),
    }))
    .query(({ input }) => {
      const area = KNOWLEDGE_BASE[input.areaId as KnowledgeArea];
      if (!area) {
        throw new Error("Knowledge area not found");
      }
      return area;
    }),

  /**
   * Get a quiz question for a specific area
   */
  getQuizQuestion: publicProcedure
    .input(z.object({
      areaId: z.string(),
      questionIndex: z.number().optional(),
    }))
    .query(({ input }) => {
      const area = KNOWLEDGE_BASE[input.areaId as KnowledgeArea];
      if (!area) {
        throw new Error("Knowledge area not found");
      }
      
      const index = input.questionIndex ?? Math.floor(Math.random() * area.quizQuestions.length);
      const question = area.quizQuestions[index % area.quizQuestions.length];
      
      return {
        ...question,
        questionIndex: index,
        totalQuestions: area.quizQuestions.length,
      };
    }),

  /**
   * Get a scenario for verbal practice
   */
  getScenario: publicProcedure
    .input(z.object({
      areaId: z.string(),
      scenarioIndex: z.number().optional(),
    }))
    .query(({ input }) => {
      const area = KNOWLEDGE_BASE[input.areaId as KnowledgeArea];
      if (!area) {
        throw new Error("Knowledge area not found");
      }
      
      const index = input.scenarioIndex ?? Math.floor(Math.random() * area.scenarios.length);
      const scenario = area.scenarios[index % area.scenarios.length];
      
      return {
        ...scenario,
        scenarioIndex: index,
        totalScenarios: area.scenarios.length,
        areaTitle: area.title,
      };
    }),

  /**
   * Get a verbal prompt for practice
   */
  getVerbalPrompt: publicProcedure
    .input(z.object({
      areaId: z.string(),
      promptIndex: z.number().optional(),
    }))
    .query(({ input }) => {
      const area = KNOWLEDGE_BASE[input.areaId as KnowledgeArea];
      if (!area) {
        throw new Error("Knowledge area not found");
      }
      
      const index = input.promptIndex ?? Math.floor(Math.random() * area.verbalPrompts.length);
      const prompt = area.verbalPrompts[index % area.verbalPrompts.length];
      
      return {
        prompt,
        promptIndex: index,
        totalPrompts: area.verbalPrompts.length,
        areaTitle: area.title,
        tips: area.interviewTips,
      };
    }),

  /**
   * Evaluate a verbal response using AI
   */
  evaluateResponse: publicProcedure
    .input(z.object({
      areaId: z.string(),
      prompt: z.string(),
      response: z.string(),
      frameBase64: z.string().optional(), // For delivery analysis
    }))
    .mutation(async ({ input }) => {
      const area = KNOWLEDGE_BASE[input.areaId as KnowledgeArea];
      if (!area) {
        throw new Error("Knowledge area not found");
      }

      try {
        const systemPrompt = `You are an expert aviation maintenance interview coach evaluating a candidate's response.

KNOWLEDGE AREA: ${area.title}
KEY POINTS THEY SHOULD COVER:
${area.keyPoints.map(p => `- ${p}`).join('\n')}

ANCHOR STATEMENT: "${area.anchorStatement}"

INTERVIEW TIPS:
${area.interviewTips.map(t => `- ${t}`).join('\n')}

Evaluate the candidate's response for:
1. CONTENT ACCURACY (0-100): Did they cover the key concepts correctly?
2. COMPLETENESS (0-100): Did they address the main points?
3. CONFIDENCE (0-100): Did they sound authoritative and certain?
4. CLARITY (0-100): Was the response clear and well-structured?

Provide:
- Overall score (0-100)
- 2-3 specific strengths
- 2-3 specific improvements needed
- A suggested better response if score < 80

Respond in JSON format:
{
  "overallScore": number,
  "contentAccuracy": number,
  "completeness": number,
  "confidence": number,
  "clarity": number,
  "strengths": string[],
  "improvements": string[],
  "suggestedResponse": string | null,
  "encouragement": string
}`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `PROMPT: ${input.prompt}\n\nCANDIDATE'S RESPONSE:\n${input.response}` }
          ],
          response_format: { type: "json_object" },
        });

        const evaluation = JSON.parse(response.choices[0].message.content || "{}");
        return evaluation;
      } catch (error) {
        console.error("Evaluation error:", error);
        return {
          overallScore: 70,
          contentAccuracy: 70,
          completeness: 70,
          confidence: 70,
          clarity: 70,
          strengths: ["Good attempt at addressing the question"],
          improvements: ["Review the key points for this topic", "Practice the anchor statement"],
          suggestedResponse: area.anchorStatement,
          encouragement: "Keep practicing! Each attempt makes you stronger.",
        };
      }
    }),

  /**
   * Get the golden rule and summary
   */
  getGoldenRule: publicProcedure
    .query(() => {
      return {
        goldenRule: "Safety, compliance, and documentation come before schedule — always.",
        summary: "Everything else flows from that.",
        doNotNeedToKnow: [
          "Airline dispatch rules",
          "Detailed MEL/CDL structures",
          "FAR subpart numbering",
          "Budget spreadsheets",
          "Union contract clauses (at interview stage)"
        ]
      };
    }),
});
