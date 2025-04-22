var _locator = new ActiveXObject("WbemScripting.SWbemLocator");
var service = _locator.ConnectServer(computer, "root\\cimv2");


service.ExecQuery("Select * from Win32_CacheMemory" + type, null, 48);
