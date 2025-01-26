import { delimiter } from 'path';
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
    newText = newText.replaceAll("< ", "XXX");
    newText = newText.replaceAll(" >", "YYY");
    newText = newText.replaceAll("<", "\n<");
    newText = newText.replaceAll("\n</", "</");
    newText = newText.replaceAll("><", ">\n<");
    newText = newText.replaceAll("> <", ">\n<");
    newText = newText.replaceAll("> ", ">");
    newText = newText.replaceAll("XXX", "< ");
    newText = newText.replaceAll("YYY", " >");

    await replaceDocumentContent(editor, newText);
}

export function addTab(text: string, tabNumber: number) {
    if (tabNumber < 0)
        return text;
    text = text.replaceAll("\t", "");
    let newText = ""
    for (let i = 0; i < tabNumber; i++)
        newText += "\t"
    newText += text;
    return newText;
}

export async function tabulate(editor: vscode.TextEditor) {
    console.log("tabulate");

    const text = editor.document.getText()
    let newText = text.replace(/\n/, "");
    let lines = newText.split("\n");
    let tabCounter = 0;
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\r/, "");
    }

    for (let i = 0; i < lines.length; i++) {
        let tmp = lines[i]
        if (tmp.startsWith("<?xml"))
            continue;
        lines[i] = addTab(lines[i], tabCounter);
        if (tmp.startsWith("</")) {
            tabCounter--;
            lines[i] = addTab(lines[i], tabCounter);
            continue;
        }
        if (tmp.startsWith("<") && !tmp.startsWith("</") && !tmp.startsWith("< ") &&
            !tmp.endsWith("/>") && !tmp.includes("</")) {
            tabCounter++;
        }
        if (i == lines.length - 1) {
            lines[i] = addTab(tmp, tabCounter);
        }
    }

    newText = lines.join("\n");
    await replaceDocumentContent(editor, newText);
}

export async function prettyPrint(editor: vscode.TextEditor) {
    await replaceLTGT(editor);
    await deleteWhiteSigns(editor);
    await lineSplit(editor);
    await tabulate(editor);
}
