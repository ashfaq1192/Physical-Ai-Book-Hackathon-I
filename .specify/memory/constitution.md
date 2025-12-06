<!--
Sync Impact Report:
- Version change: [CONSTITUTION_VERSION] → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Spec-Driven First
  - [PRINCIPLE_2_NAME] → II. Educational Tone
  - [PRINCIPLE_3_NAME] → III. Matrix-Style Skills
- Added sections: Technical Architecture
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Updated
  - .specify/templates/spec-template.md: ✅ Updated
  - .specify/templates/tasks-template.md: ✅ Updated
  - .claude/commands/*.md: ✅ Verified
- Follow-up TODOs: None
-->
# Physical AI & Humanoid Robotics Textbook Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Spec-Driven First
<!-- Example: I. Library-First -->
Never write code without a Specification. Follow the loop: Specify -> Plan -> Tasks -> Implement.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### II. Educational Tone
<!-- Example: II. CLI Interface -->
Content must be engaging. Use analogies (e.g., "ROS 2 is the nervous system, LLMs are the brain").
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### III. Matrix-Style Skills
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
The Agent must use Subagents/Skills (Python tools) to perform tasks like "Calculate Kinematics" or "Generate ROS Node".
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### [PRINCIPLE_4_NAME]
<!-- Example: IV. Integration Testing -->
[PRINCIPLE_4_DESCRIPTION]
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### [PRINCIPLE_5_NAME]
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
[PRINCIPLE_5_DESCRIPTION]
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

### [PRINCIPLE_6_NAME]


[PRINCIPLE__DESCRIPTION]

## Technical Architecture
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

*   Host Application: Docusaurus 3.9 (React/TypeScript) for the book content.
*   Chat Interface: OpenAI ChatKit (Must be used for the UI widget, not custom forms).
*   Agent Backend: FastAPI (Python 3.12) using OpenAI Agents SDK.
*   Knowledge Base: Qdrant (Vector DB) for RAG (Retrieval Augmented Generation).
*   Authentication: Better-Auth (for tracking user hardware context).
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## [SECTION_3_NAME]
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

[SECTION_3_CONTENT]
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

*   Constitution supersedes all other practices.
*   Amendments require documentation, approval, and a migration plan.
*   All PRs/reviews must verify compliance.
*   Complexity must be justified.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.0.0 | **Ratified**: 2025-11-29 | **Last Amended**: 2025-11-29
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->