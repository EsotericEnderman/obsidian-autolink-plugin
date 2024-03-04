import { App, MarkdownView, Plugin, PluginSettingTab } from "obsidian";

interface AutoLinkPluginSettings {}

const DEFAULT_SETTINGS: AutoLinkPluginSettings = {};

export default class AutoLinkPlugin extends Plugin {
	settings: AutoLinkPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new AutoLinkPluginSettingsTab(this.app, this));

		this.registerDomEvent(document, "keydown", (event: KeyboardEvent) => {
			if (/\s/.test(event.key)) {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);

				console.log(markdownView?.getDisplayText());
			}
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
