import HeaderBar from "./header-bar";
import "./help.css";
import Close from "./icons/close";
import "./setup.css";

interface HelpProps {
  onShouldExit: () => void;
}

export default function Help({ onShouldExit }: HelpProps) {
  return (
    <div className="setup-container">
      <div className="setup-content">
        <HeaderBar
          start={<div className="control"></div>}
          center={<div className="title">Help</div>}
          end={
            <div className="control" onClick={onShouldExit}>
              <Close />
            </div>
          }
        />
        <div className="help-content">
          <h3>What is Character‑Mux?</h3>
          <p>
            Character‑Mux is a single‑page writing companion you open in any
            modern browser. It displays <strong>six text panes</strong> side by
            side. Type in one pane and the other five instantly rewrite your
            words with different styles or corrections, so you can compare
            polished, informal, or playful versions at a glance.
          </p>

          <h3>How do I use it?</h3>
          <p>
            Open <code>character‑mux.html</code>, click into any pane, and start
            writing. As you type, the remaining panes refresh with their own
            takes on your text. When you spot a version you like, press{" "}
            <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>1–6</kbd>—matching the pane’s
            position—to copy that text to your clipboard.
          </p>

          <h3>FAQ</h3>
          <dl>
            <dt>How do I install it?</dt>
            <dd>
              Download <code>character‑mux.html</code>, keep it in one folder,
              and open it by dragging the file into a browser tab (or using{" "}
              <em>File → Open</em>). Your prompts and API key are stored in
              browser storage linked to the file’s location, so moving the file
              later clears those settings.
            </dd>

            <dt>How do I set it up?</dt>
            <dd>
              On first launch, click <strong>Setup</strong> at the bottom‑right,
              paste your Gemini API key, and save. Then open the{" "}
              <strong>≡</strong> menu on each pane and enter the prompt
              (instruction) you want that pane to follow, e.g. “Fix grammar” or
              “Add emojis and keep it casual.”
            </dd>

            <dt>What does “Delay between requests” do?</dt>
            <dd>
              This number controls how often each pane sends your text to
              Gemini. A <em>smaller number</em> means it asks more often—updates
              feel faster but cost more and may hit Gemini’s speed limits. A{" "}
              <em>larger number</em> means it asks less often—updates arrive a
              bit slower but are cheaper and less likely to be blocked. Pick a
              balance that suits your pace and budget.
            </dd>
          </dl>
          <p>
            <span className="button-like" onClick={onShouldExit}>
              close
            </span>{" "}
          </p>
        </div>
        <div className="form">
          <div className="actions"></div>
        </div>
      </div>
    </div>
  );
}
