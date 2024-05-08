# GPTZero Fullstack Assessment 2024

Please read the instructions in their entirety before proceeding to the code.

## Background

GPTZero is interested in providing a ChatGPT-like interface wrapper for an LLM called RichieRich. RichieRich outputs rich text in a custom HTML-like, tag based markup language called RRML. RichieRich exposes a text generation API similar to that of OpenAI.

RRML defines the following tags:
- <header></header>
- <subheader></subheader>
- <body></body>
- <card></card>
- <link href="https://example.com"></link>

## Project Structure

The provided mono-repo contains the following projects:

1. `frontend`
   - A React Next.js project owned by GPTZero that provides the RichieRich chat interface.
   - The `frontend` is styled with tailwind CSS.
2. `backend`
   - An Express.js backend owned by GPTZero that acts as a layer between GPTZero's UI and RichieRich.
   - It is responsible for calling the RichieRich API, mapping the response from RRML to HTML, and returning the response to the frontend.
3. `richieRich`
   _ This project simulates RichieRich's API. You shouldn't need to make any changes in this directory.
   _ It contains a `README.md` that contains all developer documentation necessary for any type of integration.
   
Each project contains its own README.md detailing how it may be run.

## The Problem

- As of now, the product is too slow. Responses take ~4s to load on the frontend, the bottleneck being the RichRich API. Luckily, RichieRich provides a WebSocket server that serves the LLM responses one word at a time.
- The primary goal of this assessment is to optimize response times from the RichieRich API by integrating WebSocket streaming into the system. Integrate the `backend` with the `RichieRich` WebSocket server, and the `frontend` with the updated `backend` in any manner you choose. The resulting interface should resemble ChatGPT's word-streaming UX.
- Feel free to document code as you wish.

## Constraints

- You may use any 3rd party dependencies.
- You may use AI assistance, but ensure you understand your solution as you may be asked to walkthrough your design decisions in subsequent interview rounds.

## Evaluation Criteria

The submission will be evaluated according to the following criteria:

1. **Requirements:** Did your submission meet the requirements outlined in [The Problem](#the-problem)?
2. **Code Quality:** Is your code readable, and does it adhere to best-practices?

## Submission

- Push all your changes to a new GitHub repository 90 minutes after downloading the assessment and invite `jacob@gptzero.me`, `alex@gptzero.me`, and `edmond@gptzero.me` as contributors. You may continue working on the solution thereafter, but you must indicate your progress by committing before the 90 minute mark out of fairness.
- After pushing the code changes, create a file called `NOTES.md` in the project root and answer the following questions:
  1. If you were given 2 weeks time, what changes would you make to the project to enhance code quality, UX, performance, or scalability. This should not take more than ~15 minutes.
  2. Anything you'd like us to know about your submission? If any instructions were unclear or you encountered problems in the provided code please let us know.

We understand your time is valuable and we wish to thank you for taking the time to interview at GPTZero!
