import { App, MarkdownView, Plugin, PluginSettingTab } from "obsidian";

interface AutoLinkPluginSettings {}

const DEFAULT_SETTINGS: AutoLinkPluginSettings = {};

export default class AutoLinkPlugin extends Plugin {
	settings: AutoLinkPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new AutoLinkPluginSettingsTab(this.app, this));

		this.registerDomEvent(document, "keydown", (event: KeyboardEvent) => {
			if (!/\s/.test(event.key)) {
				return;
			}

			const openFile = this.app.workspace.getActiveFile();

			if (!openFile) {
				return;
			}

			this.app.vault.read(openFile).then((content) => {
				console.log("content = ", content);

				const activeView =
					this.app.workspace.getActiveViewOfType(MarkdownView);

				if (!activeView || activeView.getMode() !== "source") {
					return;
				}

				const editor = activeView.editor;

				const cursor = editor.getCursor();

				console.log("cursor = ", cursor);

				const contentLines = content.split("\n");

				console.log("contentLines = ", contentLines);

				const currentLine = contentLines[cursor.line];

				console.log("currentLine = ", currentLine);

				let currentCharacterIndex = cursor.ch;
				let previousWord = "";

				while (currentCharacterIndex >= 2) {
					const currentCharacter = currentLine[currentCharacterIndex];

					if (/\s/.test(currentCharacter)) {
						break;
					}

					previousWord = currentCharacter + previousWord;
					currentCharacterIndex--;
				}

				console.log("previousWord = ", previousWord);

				this.app.vault.adapter.write(openFile.path, "new content");
			});
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class AutoLinkPluginSettingsTab extends PluginSettingTab {
	plugin: AutoLinkPlugin;

	constructor(app: App, plugin: AutoLinkPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
	}
}
