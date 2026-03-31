# UI Design

This section covers the design of the user interface, including wireframes, mockups, and design principles. Initially, we created several wireframes to explore different layouts and user flows. Based on feedback and iteration, we developed multiple UI mockups, refining the visual style and usability. Finally, we arrived at a polished design that emphasizes simplicity, consistency, and accessibility.

Our initial plan was to create Cresco as a mobile application with a focus on simplicity and ease of use. However, after several iterations and user feedback, we refined the design to better meet user needs by creating a web application that could be accessed on many devices.

### Wireframes

Early in the process, sketches and wireframes were used to visualize the app's structure and user flow, to get a starting point for how it would ultimately look.

<div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center;">
  <div style="max-width: 400px;">
    <img src="/docs/images/wireframe1.png" alt="Wireframe 1" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Wireframe 1: Mobile app concept</p>
  </div>
  <div style="max-width: 400px;">
    <img src="/docs/images/wireframe2.png" alt="Wireframe 2" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Wireframe 2: Task and map features</p>
  </div>
</div>

### Initial Mockups

Following the wireframes, we created an initial set of mockups to refine the visual design and user experience, that covered the entirety of the application.

<div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center;">
  <div style="max-width: 15vw;">
    <img src="/docs/images/chat_mockup.png" alt="Mockup 1" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Mockup: Initial design concept: chat screen</p>
  </div>
  <div style="max-width: 15vw;">
    <img src="/docs/images/chat_mockup2.png" alt="Mockup 2" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Mockup: Initial design concept: Home screen/ dashboard</p>
  </div>
</div>

These mockups show the initial design for the chat screen and home screen/ dashboard. The chat screen would follow a messenger-style layout, using a clean and intuitive interface, alongside graphical elements. The home screen would contain general at a glance information about the farm, such as weather information, as well as a menu to access the different features of the application.

<br>

<div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center;">
  <div style="max-width: 15vw;">
    <img src="/docs/images/mockup_3.png" alt="Mockup 3" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Mockup: Initial design concept: Sources</p>
  </div>
  <div style="max-width: 15vw;">
    <img src="/docs/images/mockup_4.png" alt="Mockup 4" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Mockup: Initial design concept: Farm selection</p>
  </div>
  <div style="max-width: 15vw;">
    <img src="/docs/images/mockup_5.png" alt="Mockup 5" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Mockup: Initial design concept: Menu</p>
  </div>
</div>

<br>

These screens show the initial design for the sources screen, farm selection screen, and menu screen. These mockups were used to gather feedback from potential users and stakeholders, which informed the next iterations of the design.

### Heuristic Evaluation

As part of the UI design process, we conducted a heuristic evaluation to identify usability issues and propose solutions. The table below summarizes the main findings and recommendations. We found a few recurring themes in the feedback, which heavily influenced our design decisions for the final design.

<br>

<div style="overflow-x: auto;">
  <table style="border-collapse: collapse; width: 100%; min-width: 700px;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="border: 1px solid #ccc; padding: 8px;">Heuristic</th>
        <th style="border: 1px solid #ccc; padding: 8px;">Problem</th>
        <th style="border: 1px solid #ccc; padding: 8px;">Solution</th>
        <th style="border: 1px solid #ccc; padding: 8px;">Severity</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Error prevention</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Users may attempt to upload unsupported file types as data sources, leading to confusion when uploads fail</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Clearly display supported extensions in the Sources panel and enforce validation when unsupported files are selected</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">2</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Flexibility and efficiency of use</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Unclear whether previous conversations are persisted</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Have a single conversation that keeps context to give most informed responses</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">2</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">User control and freedom</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Unclear to users whether they can delete their previous messages</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Add small icon next to previous user messages for delete option, to reset the conversation to a previous state</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">2</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Ease of Use</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Users may prefer to use Application on other devices than mobile</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Change to web application for ability to use on any device</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">3</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Help and documentation</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Users may be unsure where to find guidance on key flows</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Add concise inline instructions to the farm selection flow and ensure there is a clear link from the UI to the user manual</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">1</td>
      </tr>
    </tbody>
  </table>
</div>

### Prototypes

With this new feedback, we refined our design to create a web application UI. We went through several iterations, using user feedback to guide our decisions.

<div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center;">
  <div style="max-width: 400px;">
    <img src="/docs/images/design2.png" alt="Design 2" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Design 2: Early web layout</p>
    <p>This design used the same colour scheme as the original mobile design, stretched across a wider screen, with the menu on the right sidebar.</p>
  </div>
  <div style="max-width: 400px;">
    <img src="/docs/images/design3.png" alt="Design 3" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Design 3: Dark mode concept</p>
    <p>After user feedback to use dark mode instead, we revamped our design and decided on our logo, as well as our iconic colour scheme. We also decided to merge the separate screens into a more cohesive one-page layout, with each menu opening a floating panel instead.</p>
  </div>
  <div style="max-width: 400px;">
    <img src="/docs/images/design4.png" alt="Design 4" style="width: 100%; border: 1px solid #ccc; border-radius: 8px;" />
    <p style="text-align: center; margin-top: 0.5rem;">Design 4: Changing sidebar content</p>
    <p>We then went through several iterations of the design, changing the content of the sidebar, and the layout of the panels, to arrive at our final design.</p>
  </div>
</div>

### Final Design

Showcase of the final UI design.

<div style="max-width: 600px; margin: 0 auto;">
  <img src="/docs/images/designfinal.png" alt="Final Design" style="width: 100%; border: 2px solid #4caf50; border-radius: 10px;" />
  <p style="text-align: center; margin-top: 0.5rem;">Final Prototype</p>
</div>

The final design incorporates all the feedback received and provides a seamless user experience across different devices. This was the final design we decided on. It contains 2 collapsible sidebars, and a dashboard that can be accessed via the header. The left sidebar contains currently active sources, and the right sidebar contains the menu, with options to access the different features of the application, while still being able to see the chat screen or dashboard in the middle.

### Implemented UI

<div style="max-width: 50vw; margin: 0 auto;">
  <img src="/docs/images/full_page.png" alt="Final Design" style="width: 100%;" />
  <p style="text-align: center; margin-top: 0.5rem;">Final UI Design</p>
</div>

For a full overview of the implemented user interface, and how to use it, please refer to the user manual.
