import * as vscode from 'vscode';
import * as replace from './formatters/replace'

export function activate(context: vscode.ExtensionContext) {

	//console.log('Congratulations, your extension "prettyprint" is now active!');

	const disposable = vscode.commands.registerCommand('PrettyPrintXML', () => {
		const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found.');
            return;
        }

        const document = editor.document;

        // Ensure it's an XML document
        if (document.languageId !== 'xml') {
            vscode.window.showInformationMessage('This formatter only supports XML files.');
            return;
        }
		replace.prettyPrint(editor)
		vscode.window.showInformationMessage('Succesfully formatted');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
