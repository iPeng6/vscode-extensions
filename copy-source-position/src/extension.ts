// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "copy-source-position" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'copy-source-position.copy',
    () => {
      // The code you place here will be executed every time your command is executed

      const activeEditor = vscode.window.activeTextEditor;
      const workspace = vscode.workspace;
      if (!activeEditor || !workspace) {
        return;
      }
      const uri = activeEditor.document.uri;
      const workspaceFolder = workspace.getWorkspaceFolder(uri);

      if (!workspaceFolder) {
        return;
      }
      const { line, character } = activeEditor.selection.start;
      const fileline =
        uri.path.replace(workspaceFolder.uri.path + '/', '') +
        ':' +
        (line + 1) +
        ',' +
        (character + 1);

      vscode.env.clipboard.writeText(fileline);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
