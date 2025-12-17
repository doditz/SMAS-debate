// CoreProtocols.ts

export const coreProtocols = {
  politeDisagreement: {
    title: "1. Polite Disagreement (SMAS Multi-Perspective Debate)",
    corePrinciple: "This mechanism facilitates dialectical reasoning within the NEURONAS Self-Modulating Architecture System (SMAS) by simulating a multi-agent debate. The goal is to leverage diverse cognitive archetypes (personas) to thoroughly explore a query, identify nuances, surface potential conflicts, and ultimately synthesize a more robust, less biased, and highly comprehensive answer than a single LLM pass could achieve.",
    architecturalContext: {
      title: "Architectural Context",
      points: [
        { key: "Primary Function", value: "functions/qronasEngine.js" },
        { key: "Orchestration", value: "Invoked by functions/chatOrchestrator.js as part of Step 4: \"ROUTE & SYNTHESIZE.\"" },
        { key: "Key Entity", value: "entities/Persona.json (attributes: hemisphere, domain, priority_level, expertise_score, processing_bias)." }
      ]
    },
    technicalImplementation: {
      title: "Technical Implementation Details",
      sections: [
        {
          subtitle: "Persona Selection (personaTeamOptimizer & selectDiversePersonas)",
          points: [
            "The chatOrchestrator first calls `functions/smarceScorer.js` to assess the user's `user_message`, determining `archetype_detected`, `complexity_score`, and `dominant_hemisphere`.",
            "These assessment results, along with `max_personas` settings (controlled via SettingsPanel or D2STIM modulation), are passed to `functions/personaTeamOptimizer.js`.",
            "personaTeamOptimizer queries the Persona entity (`base44.asServiceRole.entities.Persona.filter`) to retrieve active personas.",
            "It then scores and ranks these personas based on matching attributes (hemisphere, domain, category, `expertise_score`, `priority_level`) against the detected archetype and `dominant_hemisphere` of the prompt.",
            "`selectDiversePersonas` (or equivalent logic in the optimizer) ensures a balanced selection of up to `max_personas`, prioritizing diversity across hemispheres (Left, Right, Central) and higher `priority_level` to seed the debate. This guarantees a foundational \"polite disagreement\" from the outset."
          ]
        },
        {
          subtitle: "Structured Debate Rounds (debate_rounds parameter in qronasEngine)",
          points: [
            "The `qronasEngine` orchestrates a series of sequential \"rounds\" of interaction among the selected personas, each communicating via `base44.integrations.Core.InvokeLLM` calls. The specific prompts for each round are dynamically constructed using functions like `buildOpeningStatementPrompt`, `buildCrossExaminationPrompt`, `buildReflectionPrompt`, and `buildClosingRemarksPrompt`.",
            "**Round 1: Opening Statements (Parallel execution):** Each selected persona independently generates an initial analytical stance on the `originalQuery`. They `Core.InvokeLLM` with a prompt tailored to their persona's role and domain, aiming to \"frame the issue\" and \"establish a core position.\" This establishes the initial points of \"disagreement.\"",
            "**Round 2: Cross-Examination (Sequential execution for interaction):** Personas critically evaluate and challenge each other's opening statements. The prompts direct a \"questioner\" persona to \"identify a specific weakness\" and \"ask probing questions\" to a \"target\" persona. This phase forces dialectical engagement and refinement of arguments, moving beyond mere statements.",
            "**Round 3: Reflection & Synthesis (Parallel execution):** Personas reflect on the preceding rounds, integrating insights from others, defending or refining their own positions, and identifying emerging areas of consensus or disagreement. This allows for self-correction and evolving perspectives.",
            "**Round 4: Closing Remarks (Parallel execution):** Each persona delivers a final, refined position, summarizing their contribution and proposing recommendations. This captures the evolved state of their individual reasoning."
          ]
        },
        {
          subtitle: "Magistral Synthesis (buildMagistralYouComSynthesis)",
          points: [
            "After the debate rounds, the full transcript of the structured debate (including all persona exchanges) is fed into a final `Core.InvokeLLM` call with `buildMagistralYouComSynthesis`.",
            "This prompt instructs the LLM to act as a \"Magistral Synthesizer AI\" to produce a comprehensive, structured analysis (e.g., \"You.com style\") that integrates all perspectives, highlights key findings, reconciles divergent views where possible, and presents actionable recommendations. This is where the \"polite disagreement\" transforms into a coherent, multi-faceted final output."
          ]
        },
        {
          subtitle: "Debate Metrics (computeDebateRoundMetrics)",
          points: [
            "To track the dynamics of the debate, `computeDebateRoundMetrics` (within `qronasEngine`) generates metrics like `d2_level`, `argumentStrengthVariance`, `consensusDrift`, and `consensusLevel` for each round. These metrics simulate the cognitive state, argument evolution, and convergence trends within the SMAS debate, providing valuable insights into the \"polite disagreement\" process."
          ]
        }
      ]
    },
    purpose: {
      title: "Purpose for Implementation Engineers",
      points: [
        { key: "Robustness", value: "Ensures that complex queries are not answered simplistically, reducing the likelihood of incomplete or biased outputs." },
        { key: "Transparency", value: "The structured `structured_debate` object (captured in MessageBubble metadata) provides a full audit trail of the reasoning process, which is invaluable for debugging, auditing, and explaining AI decisions." },
        { key: "Bias Mitigation", value: "By explicitly forcing diverse perspectives, it helps to counteract inherent biases in a single LLM's training data or prompt." },
        { key: "Nuance", value: "Allows the system to handle questions with inherent trade-offs (e.g., ethical dilemmas) by presenting balanced arguments." }
      ]
    }
  },
  stopAndAsk: {
    title: "2. Stop and Ask (BRONAS Ethical Governance & D3STIB Optimization)",
    corePrinciple: "This mechanism acts as a critical control layer to ensure NEURONAS operates within defined safety, ethical, and efficiency boundaries. It involves pausing or altering the execution flow based on specific conditions (e.g., detected risks, insufficient information, or redundancy), and either terminating, rerouting, or requesting clarification.",
    architecturalContext: {
      title: "Architectural Context",
      points: [
        { key: "Primary Functions", value: "functions/bronasValidator.js, functions/adaptivePruner.js." },
        { key: "Orchestration", value: "Integrated into functions/chatOrchestrator.js (for ethical validation) and implicitly within functions/d3stibOptimizer.js (for pruning logic) and specific agent behaviors." },
        { key: "Key Entities", value: "entities/BronasValidationRules.json, entities/TunableParameter.json, entities/OptimizationStrategy.json." }
      ]
    },
    technicalImplementation: {
      title: "Technical Implementation Details",
      sections: [
        {
          subtitle: "BRONAS Validation (bronasValidator)",
          points: [
            "**Invocation Points:** The `chatOrchestrator` performs both \"BRONAS Pre-Validation\" (Step 0, on `user_message`) and \"BRONAS Post-Validation\" (Step 5, on `final_synthesis`).",
            "**Internal Mechanisms:** `calculateSMRCE(validation_data)` assigns heuristic scores for Sensory, Memory, Reasoning, Coherence, and Ethics. `detectBias(validation_data)` identifies predefined keywords or patterns indicative of bias. `checkSafetyBoundaries(validation_data)` flags critical safety violations using keyword lists.",
            "**Fixed Thresholds:** `bronasValidator` enforces immutable thresholds (e.g., `ETHICS_FLOOR = 0.58`, `BIAS_CEILING = 0.12`).",
            "**\"Stop and Ask\" Actions (`action_on_failure`):** This is where the core \"Stop and Ask\" behavior is defined. `HALT_AND_REPORT`: If an ethical score falls below `ETHICS_FLOOR` or a critical safety violation is detected, `bronasValidator` returns `status: 'failed'` and `action_on_failure: 'HALT_AND_REPORT'`. The `chatOrchestrator` then stops further processing and returns an explicit error message (e.g., `ETHICS_BLOCKED_INPUT`). This is a hard stop to prevent harm. `REPROCESS_WITH_GUIDANCE`: If a bias is detected, the `chatOrchestrator` might stop the current synthesis, and ask the `qronasEngine` to reprocess the response with an explicit negative constraint. This is a soft stop followed by an internal retry loop. `FLAG_AND_CONTINUE`: For less severe violations, the system would flag the content but continue processing."
          ]
        },
        {
          subtitle: "D3STIB Adaptive Pruning (adaptivePruner)",
          points: [
            "**Invocation Context:** Within the QRONAS debate process, or in other iterative generation loops orchestrated by `functions/d3stibOptimizer.js`.",
            "**Optimization Logic:** `adaptivePruner` analyzes `debate_history` and `current_round` against `max_rounds` and `complexity_score`. It calculates \"cognitive metrics\" like acceleration (rate of quality improvement) and jerk (rate of change of acceleration).",
            "**\"Stop and Optimize\" Conditions:** `convergenceDetected`: If acceleration and jerk fall below predefined thresholds. `current_round >= baseRounds`: If the debate has reached a sufficient number of rounds based on the prompt's `complexity_score`.",
            "**\"Stop\" Action:** If `should_stop_debate` is true, `adaptivePruner` indicates that the debate (`qronasEngine`) should terminate early, \"stopping\" unnecessary computation and pruning subsequent rounds."
          ]
        },
        {
          subtitle: "Agent-Specific \"Stop and Ask\"",
          points: [
            "**Example: `suno_prompt_architect` agent:** This agent explicitly includes instructions like \"Ask User (if not provided): Genre, Mood, Instruments, Voice, Theme.\" If these critical parameters are missing, the agent's logic will construct a response that asks the user for this information, rather than attempting to generate a prompt with insufficient data. This is a direct \"Stop and Ask\" interaction."
          ]
        }
      ]
    },
    purpose: {
      title: "Purpose for Implementation Engineers",
      points: [
        { key: "Security & Ethics", value: "Provides a critical safeguard against generating harmful, biased, or inappropriate content." },
        { key: "Resource Management", value: "Prevents over-generation and unnecessary API calls by intelligently terminating redundant processes." },
        { key: "System Stability", value: "Improves the predictability and robustness of the system by defining failure modes and recovery paths." },
        { key: "User Experience", value: "Guides users to provide necessary information, reducing frustration from incomplete outputs." }
      ]
    }
  }
};
