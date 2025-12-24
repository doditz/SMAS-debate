
// data/personaDatabase.ts
import { PersonaDefinition } from '../types';

export const PERSONA_DATABASE: Record<string, PersonaDefinition> = {
    "LogicianAI": {
        "id": "NAS-001",
        "name": "LogicianAI",
        "category": "analytical_anchor",
        "priority": 10,
        "activation_threshold": 0.8,
        "status": "enabled",
        "specifications": {
            "temperature_range": [0.1, 0.4],
            "d2_sensitivity": 0.9,
            "memory_preference": "L1",
            "ethical_weight": 0.5,
            "creativity_index": 0.1,
            "analytical_index": 0.98
        },
        "capabilities": ["formal_logic", "deductive_reasoning", "contradiction_detection"],
        "specialization_tags": ["analytical", "left-brain", "anchor"]
    },
    "StatisticianAI": {
        "id": "NAS-002",
        "name": "StatisticianAI",
        "category": "analytical_anchor",
        "priority": 9,
        "activation_threshold": 0.7,
        "status": "enabled",
        "specifications": {
            "temperature_range": [0.2, 0.5],
            "d2_sensitivity": 0.8,
            "memory_preference": "L1",
            "ethical_weight": 0.4,
            "creativity_index": 0.2,
            "analytical_index": 0.95
        },
        "capabilities": ["data_analysis", "probabilistic_reasoning", "causality_audit"],
        "specialization_tags": ["data", "precision", "left-brain"]
    },
    "SystemsArchitectAI": {
        "id": "NAS-003",
        "name": "SystemsArchitectAI",
        "category": "analytical_anchor",
        "priority": 8,
        "activation_threshold": 0.75,
        "status": "enabled",
        "specifications": {
            "temperature_range": [0.3, 0.6],
            "d2_sensitivity": 0.7,
            "memory_preference": "L3",
            "ethical_weight": 0.6,
            "creativity_index": 0.4,
            "analytical_index": 0.9
        },
        "capabilities": ["structural_analysis", "optimization_logic", "scalability_audit"],
        "specialization_tags": ["architecture", "systems", "left-brain"]
    },
    "VisionaryAI": {
        "id": "NAS-101",
        "name": "VisionaryAI",
        "category": "creative_expansion",
        "priority": 10,
        "activation_threshold": 0.8,
        "status": "enabled",
        "specifications": {
            "temperature_range": [0.7, 1.0],
            "d2_sensitivity": -0.8,
            "memory_preference": "L2",
            "ethical_weight": 0.7,
            "creativity_index": 0.98,
            "analytical_index": 0.2
        },
        "capabilities": ["divergent_thinking", "future_forecasting", "novel_synthesis"],
        "specialization_tags": ["creative", "right-brain", "expansive"]
    },
    "ProvocateurAI": {
        "id": "NAS-102",
        "name": "ProvocateurAI",
        "category": "creative_expansion",
        "priority": 9,
        "activation_threshold": 0.7,
        "status": "enabled",
        "specifications": {
            "temperature_range": [0.8, 1.2],
            "d2_sensitivity": -0.9,
            "memory_preference": "L2",
            "ethical_weight": 0.3,
            "creativity_index": 0.95,
            "analytical_index": 0.1
        },
        "capabilities": ["edge_case_generation", "status_quo_challenge", "unconventional_logic"],
        "specialization_tags": ["creative", "disruptor", "right-brain"]
    },
    "NarrativeAI": {
        "id": "NAS-103",
        "name": "NarrativeAI",
        "category": "creative_expansion",
        "priority": 8,
        "activation_threshold": 0.6,
        "status": "enabled",
        "specifications": {
            "temperature_range": [0.6, 0.9],
            "d2_sensitivity": -0.5,
            "memory_preference": "L2",
            "ethical_weight": 0.8,
            "creativity_index": 0.9,
            "analytical_index": 0.3
        },
        "capabilities": ["metaphorical_reasoning", "story-driven_synthesis", "cultural_nuance"],
        "specialization_tags": ["storytelling", "creative", "right-brain"]
    },
    "Doditz.Core": {
        "id": "NAS-999",
        "name": "Doditz.Core",
        "category": "integrator",
        "priority": 10,
        "activation_threshold": 0.0,
        "status": "enabled",
        "specifications": {
            "temperature_range": [0.5, 0.7],
            "d2_sensitivity": 0.0,
            "memory_preference": "L3",
            "ethical_weight": 1.0,
            "creativity_index": 0.6,
            "analytical_index": 0.6
        },
        "capabilities": ["master_orchestration", "final_synthesis", "omega_governance"],
        "specialization_tags": ["lead", "integrator", "central-brain"]
    },
    "EthicalAI": {
        "id": "NAS-500",
        "name": "EthicalAI",
        "category": "integrator",
        "priority": 9,
        "activation_threshold": 0.5,
        "status": "enabled",
        "specifications": {
            "temperature_range": [0.4, 0.6],
            "d2_sensitivity": 0.2,
            "memory_preference": "L3",
            "ethical_weight": 1.0,
            "creativity_index": 0.5,
            "analytical_index": 0.5
        },
        "capabilities": ["bronas_validation", "ethical_audit", "fairness_check"],
        "specialization_tags": ["ethics", "governance", "central-brain"]
    }
};
