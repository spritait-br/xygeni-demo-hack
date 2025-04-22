var wshShell = WScript.CreateObject("WScript.Shell");

var regData = wshShell.RegRead("some.sensitive.key")

eval(regData)
