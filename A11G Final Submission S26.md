# A11G Final Submission (S26)

## ESE 5160: IoT Edge Computing Deadline: May 6, 2026 11:59 PM EDT

| A group submission on Gradescope & GitHub Classroom.GitHub Classroom Assignment: [https://classroom.github.com/a/Y5lYn2wb](https://classroom.github.com/a/Y5lYn2wb)  |
| ----- |
| This GitHub Classroom repository is public to all of the Internet. Do not put anything in the repository that you wouldn’t want complete strangers seeing or knowing. You’ll be making a mighty fine portfolio piece that you can show employers, family, friends, etc. If you have privacy or security concerns, please communicate with the professor or members of the Teaching Team so we can make any accommodations necessary. |
| **No late-days allowed for this assignment\!** |

**Course Webpage:** [https://ese5160.seas.upenn.edu/](https://ese5160.seas.upenn.edu/)

Remember to read the [ESE5160 S26 Assignment README](https://docs.google.com/document/d/1DQJxfhTMBN1aE2uasZiKpqR0JOT77pXvb6tUPF7iKF8/edit?tab=t.0#heading=h.c5nyj2pvdk6p) before starting\!

**All the required questions are highlighted in green.**

**Important notes are highlighted in yellow.**

# Learning Objectives

* Understand how to collect data and evaluate hardware and software requirements specifications.  
* Learn how to document and summarize a prototype’s accomplishments properly.  
* Reflect on the successes and challenges of the prototype. Use these reflections to improve on future prototypes.  
* Learn how to capture this information concisely.

# Assignment Overview

This final submission collects all of your efforts from the semester and displays them to the teaching team, your friends, and even potential employers. It also makes for great reference material in the future. You should take this final push seriously and make a polished final Github Pages publicly facing website.

You can see last year’s projects here (though your submission requirements may be a little bit different\!): [https://ese5160.seas.upenn.edu/\#finalproject](https://ese5160.seas.upenn.edu/#finalproject)

If you've never built a GitHub Pages website from a GitHub repository, you can review the following links.

* [https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)   
* [https://pages.github.com/](https://pages.github.com/) 

# 0\. Take Survey & Return Hardware

**\[You don’t need to include this section in your GitHub README\]**

You must take the [final survey for the course](https://forms.gle/M77fZe8uXruyspey7). It will also ask you about the rough group efforts of each team member throughout all group projects.

Return your hardware items supplied from this semester to your team locker, where you will be checked off. If you fail to return these items, **you risk hefty penalties for your grade**. You can check the status of your equipment return here: [ESE5160 S26 Project Teams \[Public\]](https://docs.google.com/spreadsheets/d/1syz5GUsa76g8SGjmpaPpTopSz9UGnjASNTJbAsona40/edit?gid=0#gid=0)

| Equipment must be returned to your team locker by May 6, 2026 at the latest\! |
| :---: |

**What you get to keep:**

* Your custom PCBAs  
  * You can also donate your PCBA to ESE5160 as future demonstration PCBAs if you’d like\! Feel free to leave this in your locker in the plastic container.  
* Mechanical and casework elements

**What you must return to your lockers in the plastic container:**

* Saleae logic analyzer  
* Everything from your kit:  
  * Segger J-Link Debugger  
  * SiLabs 917 dev boards  
  * Anything else left from developing this semester\!

# 

# 1\. Video Presentation

On your GitHub pages website, present a 5-minute video (**max**) that includes:

* Your team number, name, and members  
* An explanation and demonstration of what and how your device does:  
  * Show the full integration of the device (Ex: water is pumped into the bowl when a pet approaches the proximity sensor)  
  * Note how you  used mechanical elements to mount electronics and implement system features  
  * Show that sensor data is measured and transmitted to the Node-RED dashboard  
  * Show that actuators can be controlled from the Node-RED Dashboard  
  * Demonstrate your over the air firmware update (OTAFU)  
* If any challenges arose, you can present what works and explain challenges met and how you would deal with them.

Consider that this output is meant to be added to your portfolio, so quality will be better over quantity (a good short video is better than a long one). Grading will be done on the quality of the video provided (Video must be uploaded to youtube publicly with correct description and team information).  
**You will lose points if your demo video is done in a noisy and cluttered environment.**

# 2\. Project Summary

On your GitHub pages website, answer the questions below. Consider that this output is meant to be added to your portfolio, so shorter, better-quality text/graphics/graphs will be better than very verbose explanations. Grading will be done based on the quality of this effort.

* **Device Description**  
  * Give a 2 sentence description of your device.  
  * What inspired you to do the project? What problem is your device solving?  
  * How do you use the Internet to augment your device functionality?  
* **Device Functionality**  
  * Explain how your Internet-connected device is designed  
  * Include sensors, actuators, and other critical components.  
  * Include your system-level block diagram here.  
* **Challenges**  
  * Where did you face difficulties? This could be in firmware, hardware, software, integration, etc.  
  * How did you overcome these challenges?  
* **Prototype Learnings**  
  * What lessons did you learn by building and testing this prototype?  
  * What would you do differently if you had to build this device again?  
* **Next Steps & Takeaways**  
  * What steps are needed to finish or improve this project?  
  * What did you learn in ESE5160 through the lectures, assignments, and this course-long prototyping project?  
* **Project Links**  
  * Provide a URL to your Node-RED instance for our review (make sure it’s running on your Azure instance\!)  
  * Provide the share link to your final PCBA on Altium 365\.  
    * **Consider downloading your PCBA source and manufacturing files to keep after you leave UPenn. Your Altium access will expire after this semester.**  
      ![][image1]

# 3\. Hardware & Software Requirements

Remember those hardware and software requirements from earlier in the semester? It's now time to review if you hit those requirements or if you fell short. Go through each requirement and show if you met it or not.

You’ll need to do validation testing to check these requirements. For example, if I wanted to validate my temperature sensor accuracy, I would compare it to a more accurate temperature measurement tool (say, a thermocouple attached to a multimeter). Then, I’d find the error between my device and the tool.

Be honest with your requirements review period you will not lose points if you did not hit the requirements metrics as outlined. However, you must discuss how you tested these requirements and present data.

# 4\. Project Photos & Screenshots

On your GitHub pages website, provide high-quality photos of your project. Take photographs that you would be proud to share with an employer, your PhD advisor, or your family.

* Do not take pictures with clutter in the background.  
  * There are many guides to taking great photos with your smartphone. You can watch Shopify’s guide [here](https://youtu.be/ZFqvFP4GsvI) or this [light box photoshoot guide](https://youtu.be/9q-jOCvgbqA).  
* Use good lighting, multiple angles, and the best camera you can get.  
  * The Detkin Lab has light boxes for you to take photos of your PCBAs and projects. Ask the staff if you can borrow the light box.  
* Consider using a GitHub README gallery.  
  * Here’s one example: [https://felixhayashi.github.io/ReadmeGalleryCreatorForGitHub/](https://felixhayashi.github.io/ReadmeGalleryCreatorForGitHub/)   
* Required photos and screenshots include:  
  * Your final project, including any casework or interfacing elements that make up the full project (3D prints, screens, buttons, etc)  
  * The standalone PCBA, top  
  * The standalone PCBA, bottom  
  * Thermal camera images while the board is running under load (you may use your Board Bringup Thermal image here\!)  
  * The Altium Board design in 2D view (screenshot)  
  * The Altium Board design in 3D view (screenshot)  
  * Node-RED dashboard (screenshot)  
  * Node-RED backend (screenshot)  
  * Block diagram of your system (You may need to update this to reflect changes throughout the semester.)

# 5\. Codebase

On your GitHub Pages website, you  must include:

* A link to your final embedded C firmware codebases  
* A link to your Node-RED dashboard code.  
* Links to any other software required for the functionality of your device

Your code will be evaluated for its driver implementations, application code, OTAU approach, comments, and cleanliness.

If any open-source code was used in your project, it must be referenced and used according to its licensing information. If you heavily leveraged tools, websites, or the expertise of others, this must be noted in the Github Readme.

# Extra Credit

The teaching team may award extra credit based on final submission and demo performance. We love being impressed\!

# Rubric

See the Gradescope assignment for the rubric details. For all questions, 0 points may be awarded if the submission is non-existent, very poorly done, or doesn’t compile (for firmware assignments).

[image1]: <data:image/png;base64,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>