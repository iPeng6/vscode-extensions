// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const fs = require('fs');

const openFile = (uri: string) => {
  // var openPath = vscode.Uri.file(uri);
  // vscode.workspace.openTextDocument(openPath).then((doc) => {
  //   vscode.window.showTextDocument(doc);
  // });
  const cmd = `open ${uri}`;
  const cp = require('child_process');
  cp.exec(cmd, (err: any, stdout: any, stderr: any) => {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (err) {
      console.log('error: ' + err);
      // return;
    }
  });
};

const openDist = (dist: string) => {
  if (!fs.existsSync(dist)) {
    return;
  }

  fs.readdir(dist, (err: any, files: any) => {
    if (err) {
      return console.log(err);
    }
    files.forEach((file: any) => {
      console.log(file);
      openFile(dist + file);
    });
  });
};

function getRelativePath(uri: vscode.Uri) {
  const workspace = vscode.workspace;
  const workspaceFolder = workspace.getWorkspaceFolder(uri);
  if (workspaceFolder) {
    return uri.path.replace(workspaceFolder.uri.path + '/', '');
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  let disposable = vscode.commands.registerCommand(
    'file-impact.file-impact',
    (file) => {
      // The code you place here will be executed every time your command is executed
      const workspace = vscode.workspace;
      if (!workspace) {
        return;
      }

      const curUri = file || vscode.window.activeTextEditor?.document.uri;
      if (!curUri) {
        return;
      }

      const workspaceFolder = workspace.getWorkspaceFolder(curUri);
      if (!workspaceFolder) {
        return;
      }

      const filename = curUri.path.replace(workspaceFolder.uri.path + '/', '');

      const distDir =
        workspaceFolder.uri.path + '/scripts/changes-impact/dist/';

      const cmd = `cd ${workspaceFolder.uri.path} && yarn changes --files=${filename}`;
      const cp = require('child_process');
      cp.exec(cmd, (err: any, stdout: any, stderr: any) => {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (err) {
          console.log('error: ' + err);
        }
        openDist(distDir);
        vscode.window.showInformationMessage('file impact analysis done!');
      });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
