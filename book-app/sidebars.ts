import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Module 1: Robotic Nervous System (ROS 2)',
      items: [
        { type: 'doc', id: 'module-1/intro', label: 'Chapter 1: Introduction to ROS 2' },
        { type: 'doc', id: 'module-1/setup', label: 'Chapter 2: Setup & Installation' },
        { type: 'doc', id: 'module-1/nodes', label: 'Chapter 3: ROS 2 Nodes' },
        { type: 'doc', id: 'module-1/topics', label: 'Chapter 4: Topics & Messages' },
        { type: 'doc', id: 'module-1/services', label: 'Chapter 5: Services' },
        { type: 'doc', id: 'module-1/actions', label: 'Chapter 6: Advanced Actions' },
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin (Gazebo & Unity)',
      items: [
        { type: 'doc', id: 'module-2/intro', label: 'Chapter 1: Introduction to Simulation' },
        { type: 'doc', id: 'module-2/setup-gazebo', label: 'Chapter 2: Setting Up Gazebo' },
        { type: 'doc', id: 'module-2/urdf', label: 'Chapter 3: URDF Robot Description' },
        { type: 'doc', id: 'module-2/gazebo-physics', label: 'Chapter 4: Physics Simulation' },
        { type: 'doc', id: 'module-2/unity-rendering', label: 'Chapter 5: Unity Rendering' },
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac)',
      items: [
        { type: 'doc', id: 'module-3/isaac-intro', label: 'Chapter 1: Isaac Sim & Omniverse' },
        { type: 'doc', id: 'module-3/synthetic-data', label: 'Chapter 2: Synthetic Data Generation' },
        { type: 'doc', id: 'module-3/reinforcement-learning', label: 'Chapter 3: Reinforcement Learning' },
        { type: 'doc', id: 'module-3/isaac-gym', label: 'Chapter 4: Isaac Gym Environment' },
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      items: [
        { type: 'doc', id: 'module-4/vla-intro', label: 'Chapter 1: Introduction to VLA Models' },
        { type: 'doc', id: 'module-4/voice-control', label: 'Chapter 2: Voice Control with Whisper' },
        { type: 'doc', id: 'module-4/cognitive-planning', label: 'Chapter 3: Cognitive Planning with LLMs' },
        { type: 'doc', id: 'module-4/capstone-project', label: 'Chapter 4: Capstone — Autonomous Humanoid' },
      ],
    },
  ],
};

export default sidebars;
