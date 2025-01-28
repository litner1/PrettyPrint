import * as vscode from 'vscode';
import * as replace from './formatters/replace'

export function activate(context: vscode.ExtensionContext) {

	//console.log('Congratulations, your extension "prettyprint" is now active!');

	const disposable = vscode.commands.registerCommand('PrettyPrintXML', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor! Open a file to use this command.');
			return;
		}
		replace.prettyPrint(editor)
		vscode.window.showInformationMessage('Succesfully formatted');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
