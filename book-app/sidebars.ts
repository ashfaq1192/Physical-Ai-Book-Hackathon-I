import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Module 1: Robotic Nervous System',
      items: [
        { type: 'doc', id: 'module-1/intro', label: 'Chapter No.1: Intro' },
        { type: 'doc', id: 'module-1/setup', label: 'Chapter No.2: Setup' },
        { type: 'doc', id: 'module-1/nodes', label: 'Chapter No.3: Nodes' },
        { type: 'doc', id: 'module-1/topics', label: 'Chapter No.4: Topics' },
        { type: 'doc', id: 'module-1/services', label: 'Chapter No.5: Services' },
        { type: 'doc', id: 'module-1/actions', label: 'Chapter No.6: Actions' },
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin',
      items: [
        { type: 'doc', id: 'module-2/intro', label: 'Chapter No.1: Intro' },
        { type: 'doc', id: 'module-2/setup-gazebo', label: 'Chapter No.2: Setup Gazebo' },
        { type: 'doc', id: 'module-2/urdf', label: 'Chapter No.3: URDF' },
        { type: 'doc', id: 'module-2/gazebo-physics', label: 'Chapter No.4: Gazebo Physics' },
        { type: 'doc', id: 'module-2/unity-rendering', label: 'Chapter No.5: Unity Rendering' },
      ],
    },
    {
      type: 'category',
      label: 'Module 3: AI-Robot Brain',
      items: [
        { type: 'doc', id: 'module-3/isaac-intro', label: 'Chapter No.1: Isaac Sim Architecture and Omniverse' },
        { type: 'doc', id: 'module-3/synthetic-data', label: 'Chapter No.2: Synthetic Data Generation' },
        { type: 'doc', id: 'module-3/reinforcement-learning', label: 'Chapter No.3: Reinforcement Learning' },
        { type: 'doc', id: 'module-3/isaac-gym', label: 'Chapter No.4: Setting up an RL Environment in Isaac Gym' },
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: [
        { type: 'doc', id: 'module-4/vla-intro', label: 'Chapter No.1: VLA Models Introduction' },
        { type: 'doc', id: 'module-4/voice-control', label: 'Chapter No.2: Voice Control' },
        { type: 'doc', id: 'module-4/cognitive-planning', label: 'Chapter No.3: Cognitive Planning' },
        { type: 'doc', id: 'module-4/capstone-project', label: 'Chapter No.4: Capstone Project' },
      ],
    },
  ],
};

export default sidebars;