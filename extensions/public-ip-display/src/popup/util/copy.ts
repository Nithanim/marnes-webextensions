// https://github.com/mdn/webextensions-examples/blob/master/context-menu-copy-link-with-types/clipboard-helper.js
export async function copyToClipboard(
    text: string,
    doc: Document
): Promise<void> {
    await new Promise<void>((resolve) => {
        const oncopy = (event: ClipboardEvent): void => {
            doc.removeEventListener("copy", oncopy, true);
            event.stopImmediatePropagation();
            event.preventDefault();

            if (event.clipboardData == null) {
                throw new Error("missing clipboard context?");
            }
            event.clipboardData.setData("text/plain", text);
            resolve();
        };

        doc.addEventListener("copy", oncopy, true);
        doc.execCommand("copy");
    });
}
