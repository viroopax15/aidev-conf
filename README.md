# OpenAI Realtime Workshop

This is an example application showing how to use the [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime) with [WebRTC](https://platform.openai.com/docs/guides/realtime-webrtc). You can view this application at different stages of completeness in the git branches shown below.

## Using this application

This tutorial repository is designed to allow you to check out different branches of the code at different starting points, and work on implementing features as directed.

The `main` branch of this application contains a final working version of the application, which you can try out first to get a sense of how the end product is supposed to work (and to test your OpenAI API credentials). This application is a lightly mofieid version of the [Realtime console application](https://github.com/openai/openai-realtime-console), rebuilt as a frontend web design assistant.

You will be asked to complete a series of four tutorial exercises in this repository that introduce important concepts of working with the Realtime API. Each tutorial's beginning and end states are checked into git branches. You can move to any point along the way by using `git checkout tutorial_2_start` etc.

The final iteration of this application can be found on the `main` branch with `git checkout main`.

### Step 0: Kicking the tires

To get things started, begin by just configuring and launching the apoplicationm so you can play with it in the browser.

Before you do that however, you'll need an OpenAI API key - [create one in the dashboard here](https://platform.openai.com/settings/api-keys). Create a `.env` file from the `.env.example` file in thise repository, and set your API key in there:

```bash
cp .env.example .env
```

Running this application locally requires [Node.js](https://nodejs.org/) to be installed. Install dependencies for the application with:

```bash
npm install
```

Start the application server with:

```bash
npm run dev
```

This should start the console application on [http://localhost:3000](http://localhost:3000).

This application is a minimal template that uses [express](https://expressjs.com/) to serve the React frontend contained in the [`/client`](./client) folder. The server is configured to use [vite](https://vitejs.dev/) to build the React frontend. It uses [Tailwind CSS](https://tailwindcss.com/) for styling.

- **Objective:** Configure a working development environment for the Realtime API.
- **Starting branch:** `git checkout main`

### Step 1: Prompting and configuration

The base application contains a very basic voice prompt for the application, but we can do better. The initial session configuration happens when an [ephemeral token is fetched from the server](https://platform.openai.com/docs/guides/realtime-webrtc#creating-an-ephemeral-token). Update this configuration with a more detailed voice prompt (see the example below under `Example voice prompt`), and try a different voice from the [supported list](https://platform.openai.com/docs/api-reference/realtime-sessions/create). It is often desirable to have the model start the conversation after a connection is established - modify to code to send a mostly empty [`response.create`](https://platform.openai.com/docs/api-reference/realtime-client-events/response/create) client message to kick off this process.

- **Objective:**
  - Initialize a Realtime session with a more expressive voice prompt
  - Use a voice other than the default one currently used.
  - Have the model start the conversation by speaking a greeting aloud.
- **Starting branch:** `git checkout tutorial_1_start`
- **Solution branch:** `git checkout tutorial_1_solution`
- [Diff the starting code and solution](https://github.com/kwhinnery-openai/aidev-conf/compare/tutorial_1_start...tutorial_1_solution)

**Hints:**

- The request to configure the Realtime session is found in `server.js`
- The chunk of code required to have the model start talking first is in `RealtimeContext.jsx` in the `startSession` function.

### Step 2: Function calling

One of the most important techniques to master when building LLM apps (with Realtime or no) is extending the capabilities of the model with [function calling](https://platform.openai.com/docs/guides/realtime-model-capabilities#function-calling). At this phase, you can attempt building and configuring a function that will be called when the user asks a question about using a color palette in their web designs.

- **Objective:** Configure a function that will be called whenever the user asks for a suggestion about a color palette. Display their requested color palette and theme in the UI.
- **Starting branch:** `git checkout tutorial_2_start`
- **Solution branch:** `git checkout tutorial_2_solution`
- [Diff the starting code and solution](https://github.com/kwhinnery-openai/aidev-conf/compare/tutorial_2_start...tutorial_2_solution)

**Hints:**

- The function call code lives in `ToolPanel.jsx`
- You will need to define both a function description (which the model will use to decide when to call your function), and the parameters that the function accepts using [JSON Schema](https://json-schema.org).

### Step 3: Guardrails

When dealing with model responses, you will often need to implement **guardrails** to ensure that what the model is saying is accurate and in keeping with your intended tone and behavior. At this step, we will listen for audio transcription events, and cut off the model if it starts to talk about subjects that we don't want it to talk about.

- **Objective:** On the client, listen for realtime audio transcription events, and moderate the content generated from the model. If the model starts to talk about the TypeScript programming language (or another one you choose!), cut off the model's response.
- **Starting branch:** `git checkout tutorial_3_start`
- **Solution branch:** `git checkout tutorial_3_solution`
- [Diff the starting code and solution](https://github.com/kwhinnery-openai/aidev-conf/compare/tutorial_3_start...tutorial_3_solution)

**Hints:**

- The guardrails code lives in `RealtimeContext.jsx` in the `responseGuardrails` function.
- `responseGuardrails` will be called continuously as the model is streaming its transcription response, with the input being a steadily growing string of what the model is speaking aloud.
- This implementation is a little tricky since it uses new events just for WebRTC, but basically:
  - If during the audio output you detect content you don't want (like the word "TypeScript" in our case) in the transcription, you can elect to cut off the model before saying any more.
  - To do this, you must sent two client events in order (neither require any additional data in their payloads except the event type):
    - `response.cancel`
    - `output_audio_buffer.clear`

## License

MIT
