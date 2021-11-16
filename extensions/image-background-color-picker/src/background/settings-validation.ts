import browser, {Runtime} from "webextension-polyfill";
import {validate} from "../common/settings";
import OnInstalledDetailsType = Runtime.OnInstalledDetailsType;

async function onInstall(details: OnInstalledDetailsType): Promise<void> {
    if (details.reason === "install" || details.reason === "update") {
        const valid = await validate();
        return valid ? undefined : browser.runtime.openOptionsPage();
    }
}

export function fixSettingsOnUpdate(): void {
    browser.runtime.onInstalled.addListener(details => void onInstall(details).catch(console.error));
}