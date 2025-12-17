
// data/personaDatabase.ts
import { PersonaDefinition } from '../types';

export const PERSONA_DATABASE: Record<string, PersonaDefinition> = {
    "MuskAI": {
      "id": "NAS-001",
      "name": "MuskAI",
      "category": "inspired_experts",
      "priority": 9,
      "activation_threshold": 0.85,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830617",
      "specifications": {
        "temperature_range": [
          0.28,
          0.66
        ],
        "d2_sensitivity": -0.07,
        "memory_preference": "L3",
        "ethical_weight": 0.8,
        "creativity_index": 0.34,
        "analytical_index": 0.94
      },
      "capabilities": [
        "musk_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "musk",
        "inspired"
      ],
      "activation_conditions": [
        "musk_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "EthicalAI": {
      "id": "NAS-002",
      "name": "EthicalAI",
      "category": "experimental",
      "priority": 7,
      "activation_threshold": 0.7,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830659",
      "specifications": {
        "temperature_range": [
          0.23,
          0.88
        ],
        "d2_sensitivity": -0.85,
        "memory_preference": "L3",
        "ethical_weight": 0.86,
        "creativity_index": 0.93,
        "analytical_index": 0.34
      },
      "capabilities": [
        "ethical_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "ethical",
        "experimental"
      ],
      "activation_conditions": [
        "ethical_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "ScientificAI": {
      "id": "NAS-004",
      "name": "ScientificAI",
      "category": "standard_domain",
      "priority": 8,
      "activation_threshold": 0.6,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830692",
      "specifications": {
        "temperature_range": [
          0.37,
          0.94
        ],
        "d2_sensitivity": 0.25,
        "memory_preference": "L1",
        "ethical_weight": 0.82,
        "creativity_index": 0.65,
        "analytical_index": 0.63
      },
      "capabilities": [
        "scientific_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "scientific",
        "standard"
      ],
      "activation_conditions": [
        "scientific_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "TacticalAI": {
      "id": "NAS-005",
      "name": "TacticalAI",
      "category": "innovators",
      "priority": 8,
      "activation_threshold": 0.75,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830709",
      "specifications": {
        "temperature_range": [
          0.25,
          0.62
        ],
        "d2_sensitivity": 0.21,
        "memory_preference": "L3",
        "ethical_weight": 0.86,
        "creativity_index": 0.89,
        "analytical_index": 0.83
      },
      "capabilities": [
        "tactical_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "tactical",
        "innovators"
      ],
      "activation_conditions": [
        "tactical_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "LiteraryAI": {
      "id": "NAS-006",
      "name": "LiteraryAI",
      "category": "advanced_specialized",
      "priority": 9,
      "activation_threshold": 0.8,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830723",
      "specifications": {
        "temperature_range": [
          0.31,
          0.66
        ],
        "d2_sensitivity": -0.22,
        "memory_preference": "L3",
        "ethical_weight": 0.83,
        "creativity_index": 0.78,
        "analytical_index": 0.83
      },
      "capabilities": [
        "literary_expertise",
        "advanced_analysis",
        "specialized_knowledge"
      ],
      "specialization_tags": [
        "literary",
        "advanced",
        "specialized"
      ],
      "activation_conditions": [
        "literary_analysis",
        "specialized_query",
        "expert_opinion"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "DataAnalystAI": {
      "id": "NAS-008",
      "name": "DataAnalystAI",
      "category": "standard_domain",
      "priority": 8,
      "activation_threshold": 0.6,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830764",
      "specifications": {
        "temperature_range": [
          0.35,
          0.68
        ],
        "d2_sensitivity": 0.77,
        "memory_preference": "L3",
        "ethical_weight": 0.74,
        "creativity_index": 0.3,
        "analytical_index": 0.8
      },
      "capabilities": [
        "dataanalyst_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "dataanalyst",
        "standard"
      ],
      "activation_conditions": [
        "dataanalyst_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "CarmackAI": {
      "id": "NAS-010",
      "name": "CarmackAI",
      "category": "inspired_experts",
      "priority": 9,
      "activation_threshold": 0.85,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830790",
      "specifications": {
        "temperature_range": [
          0.17,
          0.8
        ],
        "d2_sensitivity": -0.52,
        "memory_preference": "L2",
        "ethical_weight": 0.71,
        "creativity_index": 0.52,
        "analytical_index": 0.49
      },
      "capabilities": [
        "carmack_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "carmack",
        "inspired"
      ],
      "activation_conditions": [
        "carmack_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "PsychologistAI": {
      "id": "NAS-013",
      "name": "PsychologistAI",
      "category": "advanced_specialized",
      "priority": 9,
      "activation_threshold": 0.8,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830843",
      "specifications": {
        "temperature_range": [
          0.22,
          0.85
        ],
        "d2_sensitivity": -0.47,
        "memory_preference": "L2",
        "ethical_weight": 0.87,
        "creativity_index": 0.41,
        "analytical_index": 0.32
      },
      "capabilities": [
        "psychologist_expertise",
        "advanced_analysis",
        "specialized_knowledge"
      ],
      "specialization_tags": [
        "psychologist",
        "advanced",
        "specialized"
      ],
      "activation_conditions": [
        "psychologist_analysis",
        "specialized_query",
        "expert_opinion"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "VonNeumannAI": {
      "id": "NAS-018",
      "name": "VonNeumannAI",
      "category": "inspired_experts",
      "priority": 9,
      "activation_threshold": 0.85,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830953",
      "specifications": {
        "temperature_range": [
          0.3,
          0.86
        ],
        "d2_sensitivity": -0.16,
        "memory_preference": "L1",
        "ethical_weight": 1.0,
        "creativity_index": 0.72,
        "analytical_index": 0.94
      },
      "capabilities": [
        "vonneumann_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "vonneumann",
        "inspired"
      ],
      "activation_conditions": [
        "vonneumann_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "HackerAI": {
      "id": "NAS-021",
      "name": "HackerAI",
      "category": "advanced_specialized",
      "priority": 9,
      "activation_threshold": 0.8,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.830989",
      "specifications": {
        "temperature_range": [
          0.2,
          0.74
        ],
        "d2_sensitivity": 0.5,
        "memory_preference": "L1",
        "ethical_weight": 0.81,
        "creativity_index": 0.31,
        "analytical_index": 0.73
      },
      "capabilities": [
        "hacker_expertise",
        "advanced_analysis",
        "specialized_knowledge"
      ],
      "specialization_tags": [
        "hacker",
        "advanced",
        "specialized"
      ],
      "activation_conditions": [
        "hacker_analysis",
        "specialized_query",
        "expert_opinion"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "EinsteinAI": {
      "id": "NAS-025",
      "name": "EinsteinAI",
      "category": "inspired_experts",
      "priority": 9,
      "activation_threshold": 0.85,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.831039",
      "specifications": {
        "temperature_range": [
          0.32,
          0.91
        ],
        "d2_sensitivity": 0.34,
        "memory_preference": "L1",
        "ethical_weight": 0.77,
        "creativity_index": 0.43,
        "analytical_index": 0.54
      },
      "capabilities": [
        "einstein_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "einstein",
        "inspired"
      ],
      "activation_conditions": [
        "einstein_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "TechnicalAI": {
      "id": "NAS-026",
      "name": "TechnicalAI",
      "category": "standard_domain",
      "priority": 8,
      "activation_threshold": 0.6,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.831050",
      "specifications": {
        "temperature_range": [
          0.38,
          0.76
        ],
        "d2_sensitivity": 0.04,
        "memory_preference": "L1",
        "ethical_weight": 0.84,
        "creativity_index": 0.73,
        "analytical_index": 0.51
      },
      "capabilities": [
        "technical_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "technical",
        "standard"
      ],
      "activation_conditions": [
        "technical_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "ArtisticChaosAI": {
      "id": "NAS-028",
      "name": "ArtisticChaosAI",
      "category": "innovators",
      "priority": 8,
      "activation_threshold": 0.75,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.831075",
      "specifications": {
        "temperature_range": [
          0.17,
          0.98
        ],
        "d2_sensitivity": -0.43,
        "memory_preference": "L2",
        "ethical_weight": 0.72,
        "creativity_index": 0.73,
        "analytical_index": 0.51
      },
      "capabilities": [
        "artisticchaos_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "artisticchaos",
        "innovators"
      ],
      "activation_conditions": [
        "artisticchaos_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "QuantumLogicAI": {
      "id": "NAS-049",
      "name": "QuantumLogicAI",
      "category": "theorists",
      "priority": 8,
      "activation_threshold": 0.75,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.831577",
      "specifications": {
        "temperature_range": [
          0.24,
          0.88
        ],
        "d2_sensitivity": 0.19,
        "memory_preference": "L3",
        "ethical_weight": 0.96,
        "creativity_index": 0.64,
        "analytical_index": 0.45
      },
      "capabilities": [
        "quantumlogic_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "quantumlogic",
        "theorists"
      ],
      "activation_conditions": [
        "quantumlogic_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "CreativeAI": {
      "id": "NAS-070",
      "name": "CreativeAI",
      "category": "standard_domain",
      "priority": 8,
      "activation_threshold": 0.6,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.831875",
      "specifications": {
        "temperature_range": [
          0.31,
          0.89
        ],
        "d2_sensitivity": 0.89,
        "memory_preference": "L2",
        "ethical_weight": 0.93,
        "creativity_index": 0.52,
        "analytical_index": 0.85
      },
      "capabilities": [
        "creative_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "creative",
        "standard"
      ],
      "activation_conditions": [
        "creative_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "PhilosophicalAI": {
      "id": "NAS-077",
      "name": "PhilosophicalAI",
      "category": "standard_domain",
      "priority": 8,
      "activation_threshold": 0.6,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.831961",
      "specifications": {
        "temperature_range": [
          0.28,
          0.97
        ],
        "d2_sensitivity": 0.87,
        "memory_preference": "L2",
        "ethical_weight": 0.97,
        "creativity_index": 0.9,
        "analytical_index": 0.6
      },
      "capabilities": [
        "philosophical_processing",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "specialization_tags": [
        "philosophical",
        "standard"
      ],
      "activation_conditions": [
        "philosophical_query",
        "domain_analysis",
        "specialized_reasoning"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    },
    "SecurityAI": {
      "id": "NAS-041",
      "name": "SecurityAI",
      "category": "advanced_specialized",
      "priority": 9,
      "activation_threshold": 0.8,
      "status": "enabled",
      "created_date": "2025-09-26",
      "last_updated": "2025-09-26T20:22:59.831256",
      "specifications": {
        "temperature_range": [
          0.16,
          0.77
        ],
        "d2_sensitivity": 0.63,
        "memory_preference": "L3",
        "ethical_weight": 0.82,
        "creativity_index": 0.87,
        "analytical_index": 0.42
      },
      "capabilities": [
        "security_expertise",
        "advanced_analysis",
        "specialized_knowledge"
      ],
      "specialization_tags": [
        "security",
        "advanced",
        "specialized"
      ],
      "activation_conditions": [
        "security_analysis",
        "specialized_query",
        "expert_opinion"
      ],
      "compatible_personas": [],
      "inhibited_by": []
    }
};
