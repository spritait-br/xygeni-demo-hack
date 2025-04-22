var WshShell = new ActiveXObject("WScript.Shell");

WshShell.CurrentDirectory = "..";
WshShell.RegWrite(
    "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
    ,"Open with &emacs in wsl-terminal", "REG_SZ"
);

WshShell.RegWrite(
    "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
    ,"Open with &emacs in wsl-terminal", "REG_SZ"
);