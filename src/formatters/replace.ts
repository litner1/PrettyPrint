import * as vscode from 'vscode';

export async function replaceDocumentContent(editor: vscode.TextEditor, newText: string): Promise<boolean> {
    const document = editor.document;
    const fullRange = new vscode.Range(
        document.positionAt(0), // Start of the document
        document.positionAt(document.getText().length) // End of the document
    );

    const editSucceeded = await editor.edit(editBuilder => {
        editBuilder.replace(fullRange, newText); // Replace the content
    });

    if (!editSucceeded) {
        console.error("Edit operation failed.");
        return false;
    }

    // Log the updated document content for debugging
    console.log("Updated document content:\n", editor.document.getText());
    return true;
}

export async function replaceLTGT(editor: vscode.TextEditor) {
    console.log("replaceLTGT")

    const text = editor.document.getText()
    const newText = text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")

    await replaceDocumentContent(editor, newText);
}

export async function deleteWhiteSigns(editor: vscode.TextEditor) {
    console.log("deleteWhiteSigns")

    const text = editor.document.getText()
    let newText = text;
    newText = newText.replace(/[\n\r\t]/gm, "");
    newText = newText.replace(/\s\s+/g, ' ');
    await replaceDocumentContent(editor, newText);
}

export async function lineSplit(editor: vscode.TextEditor) {
    console.log("lineSplit");

    const text = editor.document.getText()
    let newText = text
    newText = newText.replaceAll("<", "\n<");
    newText = newText.replaceAll("\n</", "</");
    newText = newText.replaceAll("><", ">\n<");
    newText = newText.replaceAll("> <", ">\n<");

    await replaceDocumentContent(editor, newText);
}

export function addTab(text: string, tabNumber: number) {
    if (tabNumber <= 0)
        return text;
    let newText = ""
    for (let i = 0; i < tabNumber; i++)
        newText += "\t"
    newText+=text;
    return newText;
}

export async function tabulate(editor: vscode.TextEditor) {
    console.log("tabulate");

    const text = editor.document.getText()
    let newText = text;
    let lines = newText.split("\n")
    let tabCounter = 0;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("</"))
            tabCounter--;
        if (lines[i].startsWith("<") && !lines[i].startsWith("</") &&
            !lines[i].endsWith("/>") && !lines[i].includes("</")) {
            tabCounter++;
        }
        lines[i] = addTab(lines[i], tabCounter);
    }
    newText=lines.join("")
    await replaceDocumentContent(editor, newText);
}

export async function doAll(editor: vscode.TextEditor) {
    await replaceLTGT(editor);
    await deleteWhiteSigns(editor);
    await lineSplit(editor);
    await tabulate(editor);
}
