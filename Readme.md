# Project : Physical AI & Humanoid Robotics TextBook

## Introduction
This project is an open-source educational resource designed to introduce users to the exciting field of Physical AI. It covers fundamental concepts, practical applications, and advanced topics related to robotics, digital twins, and vision-language-action (VLA) models. The book is structured into modules, each focusing on a specific aspect of Physical AI, from foundational robotics concepts to cutting-edge AI integration. This entire project was accomplished using Spec-Driven Development (SDD), leveraging the Speck-kit Plus framework and the Claude Code CLI tool, powered by the Gemini API.

## Scope
The scope of this project is to provide a comprehensive and accessible learning experience for individuals interested in Physical AI. It includes:
- **Module 1: Robotics Nervous System:** Covers foundational robotics concepts, including ROS 2, URDF, and Gazebo.
- **Module 2: Digital Twin Simulation:** Explores digital twin concepts, advanced simulation with Gazebo, and high-fidelity rendering with Unity.
- **Module 3: AI Robot Brain (NVIDIA Isaac Sim):** Dives into NVIDIA Isaac Sim, synthetic data generation, and reinforcement learning for robotics.
- **Module 4: Vision-Language-Action (VLA) Models:** Introduces VLA models, voice control, and cognitive planning for autonomous systems.

## Learning Outcomes
Upon completing this project, users will be able to:
- Understand the core principles of Physical AI and its applications.
- Develop basic to advanced robotic simulations using ROS 2, Gazebo, and Unity.
- Utilize NVIDIA Isaac Sim for synthetic data generation and reinforcement learning in robotics.
- Comprehend and implement Vision-Language-Action models for advanced robotic control.
- Gain hands-on experience with industry-standard tools and frameworks in Physical AI.
- Understand and apply Spec-Driven Development (SDD) methodologies.
- Effectively utilize AI-powered development tools like Claude Code.

## Skills and Tools Used and Learned
- **Claude Code (with Gemini API Key):** The interactive CLI tool used for project development and task execution.
- **Quadrant Vector Database:** The platform used for RAG purpose (Facilitates in live interaction with contents of the book
- **Speck-kit Plus:** The framework used for Spec-Driven Development.
- **Git/GitHub:** For version control and collaboration.
- **Markdown:** For documentation and content creation.

## Project Walkthrough: How to Run the Project Locally

This section will guide you through setting up and running the Physical AI Book project on your local machine.

### Prerequisites
Before you begin, ensure you have the following installed:
- Git
- Node.js and npm (for Docusaurus)
- Python 3.8+ and pip
- Docker (optional, for Qdrant)

### 1. Clone the Repository
First, clone the project repository from GitHub:

```bash
git clone https://github.com/ashfaq1192/hackathon-nov30.git
cd hackathon-nov30
```

### 2. Install Docusaurus Dependencies
The book content is built using Docusaurus. Navigate to the `book-app` directory and install the dependencies:

```bash
cd book-app
npm install
```

### 3. Run the Docusaurus Development Server
You can now start the Docusaurus development server to view the book content locally:

```bash
npm run start
```
Open your browser to `http://localhost:3000` to see the book.

### 4. Setting up the RAG Backend (Optional, for Chatbot Integration)
If you want to enable the chatbot functionality (RAG backend), follow these steps.

#### Create and Activate a Python Virtual Environment
```bash
# From the project root directory
mkdir rag-backend
cd rag-backend
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```
(Note: You will need to create `requirements.txt` with `fastapi`, `uvicorn`, `openai`, `qdrant-client`, `python-dotenv` if it doesn't exist.)

#### Create a `.env` file
In the `rag-backend` directory, create a `.env` file and add your Gemini API key:
```
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

#### Run the Ingestion Script
This script will index your documentation into Qdrant.
```bash
python ingest.py
```
(Note: You will need to create `ingest.py` to index `book-app/docs` into Qdrant if it doesn't exist.)

#### Run the FastAPI Backend
```bash
uvicorn main:app --reload
```
(Note: You will need to create `main.py` with the FastAPI app if it doesn't exist.)

### 5. Docker for Qdrant (Optional)
If you prefer to run Qdrant in Docker:

```bash
docker pull qdrant/qdrant
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

This `Readme.md` provides a comprehensive guide for anyone to understand, set up, and run the Physical AI & Humanoid Robotics Textbook Project.
