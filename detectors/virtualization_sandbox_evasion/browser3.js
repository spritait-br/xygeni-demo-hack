var canvas = document.createElement('canvas');
var gl = canvas.getContext('webgl');
var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
console.log(vendor);
console.log(renderer);
var width = screen.width;
var height = screen.height;
var color_depth = screen.colorDepth;

setTimeout(function(){
    if (true) {
        // seems we use data above to check render!
        if ('swiftshader'.toLowerCase() === gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase() ||'llvmpipe'.toLowerCase() === gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase() ||'virtualbox'.toLowerCase() === gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()) {
            // blacklist!
            console.log("Virtual Machine / RDP");
        }
        else if (color_depth < 24 || width < 100 || width < 100 || !color_depth) {
            alert('bot detected')
            console.log("No Display (Probably Bot)")
        }
        else {
            window.location.href = '/history_pushstate'; // document ready
        }
    }
}, 2000);