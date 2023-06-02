---
title: the Birth of a Component
---

### Introduction

TDesign maintains multiple tech stacks and ensures consistency in UI/API functionality across different tech stacks is one of the top priorities for the team. In the past, TDesign has come up with a set of processes and tools to address this issue and this experience has been accumulated through the process of recruiting component developers.

<img width="100%" alt="Component Process" src="https://user-images.githubusercontent.com/7600149/150783157-d4947506-e68a-4d08-915f-85dea1df8080.png">

### Requirement Collection and Assessment

- Core team collects new component requirements from issues, forums or business use groups, and proposes them for discussion. Consensus is reached on whether the new component meets the requirements of "generality" and "necessity".
- To synchronize the new component design requirements with the designer, it is necessary to provide a description of the necessary component functionality, as well as screenshots of sample business usage or links to similar components in other component libraries.
- The designer schedules the production of the component design drafts and determines the designer responsible for subsequent design drafts.
- In the main repository, a new component will be added to the [Recruitment of new components](https://github.com/Tencent/tdesign/issues/220) section, marked as "pending".

Therefore, if you need a new component or a new component feature, please create an issue first and provide relevant interactive demonstrations which links to similar components. You can find the entrance to create an issue in the main repository and select the appropriate issue template.

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/233825362-243fc802-062c-46fa-8608-164fdeb0ad49.png">

## Preparation

- TDesign continuously recruits contributors for various roles through channels such as weekly newsletters, internal forums, issues, internal and external groups. The roles TDesign is looking for include UI developers, API designer, and developers with various UI framework.
- After recruiting UI developers, API designer, and developers with specific UI framework, we can introduce component-related information in our enterprise WeChat group, including but not limited to: explaining the responsibilities of all participants, providing interaction design document links, and related development and design guidance documents. The API designer needs to create a preliminary API draft based on existing design documents and similar industry component implementations. We will then arrange an online meeting for relevant component participants to review the API draft.

- Online Review Discussion

  - Roles required to participate: technical stack owner, interaction designer, visual designer, UI developer, API designer, and developers with various UI framework.
  - Discussion Content: The discussion will focus on whether the API settings meet the needs of the business scenarios, whether there is room for extensibility, whether the API description is framework-independent, and can be implemented in multiple technical stacks, and whether the interaction design meets the requirements and provides demonstration for all scenarios
  - After the discussion, we need to clarify the deadline for finalizing the interaction design adjustment need to be clarified

- The interaction designer will write the design guidelines for the component(example: https://tdesign.tencent.com/vue-next/components/button?tab=design)
- The visual designer will produce the design drafts based on the adjusted design, which will be timely synchronized in the group.
- The PMC in charge of the component progress will enter the API management platform: https://github.com/Tdesignoteam/tdesign-api

tdesign-api has provided an API management platform with UI:

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/233825592-ed541243-8937-4b03-a31d-ac583bcb5d5a.png">

During the API development stage, everyone will follow some proven principles, such as using the `TNode` concept to describe specific syntax in the Vue/React technical stacks. Please see the [Component API Development Guidelines](https://github.com/Tencent/tdesign/wiki/component-api-guide). After the API description is entered into the platform, relevant files required for component development will be generated. As a component developer, you need to use the cli tool or GitHub Action in tdesign-api project to automatically trigger the submission of corresponding technical stack branches. If you have any questions about how to generate these files, please contact the PMC responsible for this component.

<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/233825825-a0a87de3-ce7a-4be5-ad57-f8d08ab3d12d.png">

## Development Stage

- The UI developer is responsible for developing the component UI (LESS) independently in the [common repository](https://github.com/Tencent/tdesign-common) based on the design drafts. The UI demo needs to include static styles of all types of use scenarios provided in the interaction design document. After submitting the PR, sync the information in the group. If other developers with different technical skills need to CR the UI implementation with the PMC, the PR will be merged after it is reviewed and approved by all parties.
- Component development: developers from each technical stack use the CLI tool to pull the API definition-related files for the technical stack in question (example: https://github.com/Tencent/tdesign-vue/blob/develop/src/button/props.ts). Based on the definition files and UI implementation, these developers will complete the component logic development. After development is completed, submit the corresponding PR.
- After all CI processes are completed, invite the PMC to participate in CR. If you have any problems during the PR submission process, please refer to https://tdesign.tencent.com/about/contributing

### Why Git submodule？

You may have noticed that there is a submodule pointing to the [common](https://github.com/Tencent/tdesign-common) in each component repository. This is to ensure that the UI implementation and DOM structure of the same component in each technical stack are consistent. No repository will maintain any component style code independently. When the UI needs to be adjusted, modifications are made uniformly in the common repository and then synced to each repository.
<img width="100%" alt="image" src="https://user-images.githubusercontent.com/7600149/233826152-e0ea729a-2073-42a9-a801-d2f37bd1994f.png">

Git submodule is a good solution for synchronizing code between multiple repositories. In the future, TDesign may also switch to importing UI production CSS in each repository through npm packages. However, before that, you need to be familiar with the daily operations of submodules.

## Acceptance Stage

- After CR issues are fixed designers will be invited to participate in the review and acceptance process. They will cross-check the component demo implementation against the preview website address on the PR.
- The visual designer needs to design a thumbnail of the component to display on the [component overview page](https://tdesign.tencent.com/vue-next/overview). - The PMC will upload the thumbnail to the TDesign public COS service, generate an image link and provide it to the component developer. They will then add the component preview entry to the [common overview](https://github.com/Tencent/tdesign-common/blob/develop/docs/web/overview.md) and update the number of components in the corresponding category.
- After merging the PR into `develop` branch, it is ready for release a new component.
- The PMC collects the GitHub account information of all participating contributors and updates them in the contributor maintenance system.

Only when all these steps are completed will a component undergo the entire process from requirement to release. We have also tried simpler and "faster" processes before, but ultimately, we found that there were problems with component quality, supporting design resources, etc., which required rework. If you have better suggestions, feel free to start a discussion in the repository.
