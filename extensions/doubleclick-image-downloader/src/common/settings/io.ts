import { DOMAIN_NAME_FILTER_PATTERN } from "../filtering";
import {
    ClickType,
    ConflictAction,
    FilenameVariables,
    HoverButtonPosition,
    HoverButtonSkin,
} from "./enums";
import {
    SettingsOf,
    bool,
    gt,
    gte,
    lte,
    matching,
    notBlank,
    num,
    roundedTo,
    sanitize,
    str,
    stringArray,
    stringEnum,
} from "@webextensions/common";
import type { JsonValue } from "type-fest";
import browser from "webextension-polyfill";

const spec = {
    aggressiveCursorTracking: bool(false),
    buttonOpacity: num(1, gte(0.1), lte(1), roundedTo(2)),
    buttonPosition: stringEnum(
        HoverButtonPosition,
        HoverButtonPosition.topRightSW
    ),
    buttonSize: num(48, Number.isInteger, gte(8), lte(512)),
    counterPadding: num(1, Number.isInteger, gte(0)),
    counterStart: num(1, Number.isInteger, gte(0)),
    counterStep: num(1, Number.isInteger, gte(0)),
    doubleRightClickMillis: num(250, Number.isInteger, gt(0)),
    enableImageContextMenu: bool(true),
    enableRename: bool(false),
    enableSelectionContextMenu: bool(true),
    excludedPageDomains: stringArray([], matching(DOMAIN_NAME_FILTER_PATTERN)),
    excludedSourceDomains: stringArray(
        [],
        matching(DOMAIN_NAME_FILTER_PATTERN)
    ),
    fileNamePattern: str(FilenameVariables.inferred, notBlank),
    greyOut: bool(true),
    minimumImageSize: num(100, Number.isInteger, gte(1)),
    notify: bool(false),
    onFilenameConflict: stringEnum(ConflictAction, ConflictAction.autoUnique),
    oneClickStyle: stringEnum(HoverButtonSkin, HoverButtonSkin.alt1),
    pageDomainsAreWhitelist: bool(false),
    persist: bool(false),
    requireShift: bool(false),
    singleClickEnabled: bool(false),
    sourceDomainsAreWhitelist: bool(false),
    supportDragDrop: bool(true),
    triggerByClickType: stringEnum(ClickType, ClickType.doubleLeft),
};

export type Settings = SettingsOf<typeof spec>;

export function isSetting(key: string): key is keyof Settings {
    return key in spec;
}

export async function read(): Promise<Record<keyof Settings, JsonValue>> {
    const json = await browser.storage.sync.get(Object.keys(spec));
    return json as Record<keyof Settings, JsonValue>;
}

export async function write(dto: Partial<Settings>): Promise<void> {
    return browser.storage.sync.set(dto);
}

export function correct(raw: Record<keyof Settings, JsonValue>): Settings {
    return sanitize<Settings>(raw, spec);
}
