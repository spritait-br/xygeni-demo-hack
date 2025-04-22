let req = new XMLHttpRequest();
var array = [
    "p", "1", "odjlkjdklsa", "o", "lkjkjfjhklfdsf", "14.4", "r", "ActiveX", "pe", "21212", "", "", "op", "", "", "n"
]

req.open(); // safe

req['open'](); // safe

req[array[3] + array[8] + array[15]]();  // evidence