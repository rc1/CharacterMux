# CharacterMux

A browser-based text transformation tool that displays your writing in multiple styles simultaneously.

## What is CharacterMux?

CharacterMux is a single-page application that displays **six text panes** side by side. Type in one pane, and the other five instantly rewrite your words based on different prompts using Google's Gemini AI. The default configuration includes:

- Grammar and spelling correction
- Adding expressiveness with emojis
- Fixing text that might have been typed without looking
- Making text more succinct
- Following the New York Times style guide
- Improving readability and conciseness

Each pane can be customized with your own prompts to transform text in ways that suit your needs.

## How to Use CharacterMux

### Installation

1. Download the single HTML file (`character-mux.html`) from the [releases page](https://github.com/rc1/CharacterMux/releases)
2. Keep the file in a dedicated folder (your settings are stored in browser storage linked to the file's location)
3. Open the file by dragging it into a browser tab or using File → Open in your browser

### Setup

1. On first launch, click **Setup** in the bottom-right corner
2. Paste your [Google Gemini API key](https://aistudio.google.com/app/apikey)
3. Adjust the "Delay between requests" setting if needed (smaller = faster updates but more API calls)
4. Save your settings

### Customizing Prompts

1. Click the ≡ (menu) icon in the top-right corner of any pane
2. Enter the prompt you want that pane to follow (e.g., "Fix grammar," "Add emojis and keep it casual," "Make more concise")
3. Use `%TEXT%` in your prompt to indicate where your typed text should be inserted

### Writing and Copying

1. Click into any pane and start writing
2. As you type, the remaining panes will refresh with their own versions of your text
3. When you see a version you like, press **⌘/Ctrl + [1-6]** (matching the pane's position) to copy that text to your clipboard

### Importing/Exporting Settings

You can export your prompt settings to share with others or back them up by using the export functionality in the setup menu.

## Technical Details

CharacterMux is built as a single, self-contained HTML file using:

- React for the UI
- Zustand for state management
- Google's Gemini AI API for text transformations
- Vite with the single-file plugin for bundling

The application runs entirely in your browser and stores settings locally. No data is sent to any server except the necessary API calls to Google's Gemini service.

## License

MIT
