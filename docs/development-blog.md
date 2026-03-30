# Development Blog

This section contains the Development Blog entries for Team 26.

### Week 1-2

This week, we were first introduced to our project after getting in touch with our client NTTDATA! (As well as our teammates!) Our brief was simple enough to understand, build a chatbot with RAG for farmers to help on their day-to-day, ideally with some satellite image analysis integrated. 

After the first meet, we briefly discussed our expectations for the project as well as performing a literature review of existing solutions. 

### Week 3-4

Up to now, we’ve been working on researching requirements for the user. In our HCI (Human Computer Interaction) coursework, we made a sketch and wireframe mockup of our solution, as well personas to get an idea of what we are making for the user. 

We’ve done basic surveys from folks around school to help facilitate this, and were lucky enough to be able to talk to a proper farmer through a family contact! 

We also learnt more about our target demographic of specifically small-scale farmers. 

### Week 5-6

This week was all about experimentation. We started digging into different ways to extract text from PDFs, which posed a significant challenge, especially in maintaining the legibility of words even in text-based docs, and began building out the core RAG system. We had conversations with the client about where to source data for the knowledge base, and started scouting a few. We also had a discussion about the satellite analysis side of things, and decided to scale back that feature for now due to the granularity of data. It was imply far too coarse and while we COULD still hypothetically do analysis on this, it wasn’t meaningful enough. 

The compromise we settled on is that we’d show the functionality and that it was possible, but not invest too much time in trying to get something actionable out of the feature. 

### Week 7-8

Making sure our requirements docs is polished!

We’ve been dealing with some issues in embedding, such as tables not being embedded properly and cutting off at unnatural instances in the paragraph. We addressed this by implementing smarter chunking strategies to better preserve the structure and context of the source material. With that sorted, it was full steam ahead!

### Week 9-10

Big milestone! We integrated the separate components each of us had been working on and presented our first demo to the client. The RAG system is now live, established, and the satellite side now lets users select their farm as an irregular polygon on a map. The two halves aren't talking to each other yet, but seeing everything side by side for the first time felt good. Client feedback was helpful and gave us a clear direction heading into the winter break.

### Week 11-12

Back from the break, we were discussing with the client about expanding the project's scope. We researched a few directions such as IoT integration, plant disease detection, and drone imagery, and settled on drone imagery. It had the clearest path forward, the most defined use case and datasets. Finding one was difficult, and when we finally did, it was 34GB. Wonderful! 

We also added the ability to pull weather info based on the user’s farm location.

### Week 13-14

Development on the drone imagery system kicked off this week, starting with basic NDVI computation from uploaded multispectral images. We also extended our file upload system beyond PDFs to support additional file types. The chatbot can now generate graphs inline from data as well. Briefly implemented a separate tab to only show graphs, but it was removed after client feedback. CI/CD was also set up this week.

### Week 15-16

A lot of small feature updates, as well as a big one! Added search feature, ability to extract graphs from processed drone images, adbility to delete messages and images, ability to sort and change dates of uploaded images, a dashboard to show consolidated info, ability to generate and store tasks, added sources to llm output annnd… for the big one, we changed a lot of how the backend works to make it more secure and organised. We migrated from SQLite → PostgreSQL after professor feedback.

Testing is now in full swing.

### Week 17-18

We presented Cresco to NTT DATA this week, which was a great experience as we also met our client in person for the first time and gained valuable pitching experience, which should be useful in the final showcase.

On the development side, we added basic user authentication for demonstration purposes and expanded our vegetation index support to include SAVI and EVI alongside NDVI. We looked into adding NDMI as well, but hit a familiar wall of not enough accessible data with the right spectral bands. Most of the work has been done. Communicating with the client to continue to iron out small issues with stability here and there. 

### Week 19 - 20

We presented our project for the final time at the student showcase! All our presentations are now done. Therefore, it’s full steam ahead on the report and setting up deployment. A lot of headaches were caused setting up the docker image and azure VM, but we got it!

### Week 21 - 22

Handover to the client, they were happy, we were happy, and in general, a good final meeting :)

The bulk of our energy now goes into the report, some minor UI bug fixes and updating documentation. Overall, it was a great experience throughout.