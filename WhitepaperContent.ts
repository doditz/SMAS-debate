// WhitepaperContent.ts
import { projectPhilosophy } from './ProjectPhilosophy';
import { coreProtocols } from './CoreProtocols';
import { neuronasTeam } from './NeuronasTeam';
import { ethicalFramework } from './EthicalFramework';
import { acknowledgements } from './Acknowledgements';
import { Transparency } from './types';

const transparencyContent: Transparency = {
    title: "Transparency in Execution",
    introduction: "To provide clarity on how this application operates, we use three distinct labels to describe the state of each component. This emulation uses a mix of these states to demonstrate the full architecture's logic without requiring the complete, resource-intensive backend.",
    definitions: [
        {
            state: 'EXECUTED',
            title: 'Executed',
            analogy: 'Driving a real car. The actions are direct, and the outcomes are real.',
            implementation: 'This component\'s logic is running natively within this web application. User inputs, settings, and UI interactions are examples of executed processes.'
        },
        {
            state: 'EMULATED',
            title: 'Emulated',
            analogy: 'Using a high-fidelity driving simulator. The car, physics, and environment are not real, but they behave according to the same complex rules, producing a realistic and valid experience.',
            implementation: 'This component represents the core logic of the NEURONAS backend. Instead of running on a complex, multi-model infrastructure, its behavior is emulated using calls to the Gemini API. The debate, synthesis, and analysis follow the prescribed architecture, providing a functionally accurate representation of the system\'s output.'
        },
        {
            state: 'SIMULATED',
            title: 'Simulated',
            analogy: 'Watching a video of a car driving. The visuals are representative, but there is no underlying model of physics or control. The data is for illustration only.',
            implementation: 'This component is a placeholder for a data stream from the backend. The data (e.g., real-time metrics, memory state) is generated locally to demonstrate how the UI would respond. It is not connected to the emulated debate process.'
        }
    ]
};

export const whitepaperContent = {
  title: "NEURONAS AI: Project Whitepaper",
  sections: [
     {
        id: 'transparency',
        title: 'Execution Transparency',
        content: transparencyContent,
    },
    {
      id: 'philosophy',
      title: 'Core Philosophy',
      content: projectPhilosophy,
    },
    {
      id: 'protocols',
      title: 'Core Protocols',
      content: coreProtocols,
    },
    {
      id: 'ethics',
      title: 'Ethical Framework',
      content: ethicalFramework,
    },
    {
      id: 'team',
      title: 'Project Team & Credits',
      content: neuronasTeam,
    },
    {
       id: 'acknowledgements',
       title: 'Foundations',
       content: acknowledgements,
    }
  ],
};
