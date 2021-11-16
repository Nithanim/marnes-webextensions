import {Settings} from "../../common/settings/io";
import {triggerable} from "../../common/triggerable";
import {HTML_BUTTON_ID, insertCss, SKIN_CLASSES} from "./skinning";

const button = document.createElement("div");
button.id = HTML_BUTTON_ID;
button.title = "Download image";

const {hide: dropEvent, expose: drop} = triggerable();
export {drop};

const {hide: clickEvent, expose: click} = triggerable();
export {click};

button.addEventListener("dragover", event => {
    if (dropEvent.hasSubscribers()) {
        // make it droppable
        event.preventDefault();
    }
});
button.addEventListener("drop", event => {
    // prevent weird browser behavior like navigating to the image
    event.preventDefault();
    dropEvent.trigger(undefined);
});
button.addEventListener(
    "click",
    event => {
        event.stopPropagation();
        clickEvent.trigger(undefined);
    },
    true
);

export function isButton(element: Element): boolean {
    return button === element;
}

export function isInserted(): boolean {
    return button.parentNode != null;
}

let everInserted = false;
export function insert(): void {
    if (!everInserted) {
        insertCss();
        everInserted = true;
    }
    document.body.appendChild(button);
}

export function unsert(): void {
    document.body.removeChild(button);
}

export function setSkin(settings: Settings): void {
    button.classList.remove(...Object.values(SKIN_CLASSES));
    button.classList.add(SKIN_CLASSES[settings.oneClickStyle]);
}

export function setOpacity(settings: Settings): void {
    button.style.opacity = String(settings.buttonOpacity);
}

export function setSize(size: number): void {
    button.style.height = `${size}px`;
    button.style.width = `${size}px`;
}

export function setCoordinates(left: number, top: number): void {
    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
}
