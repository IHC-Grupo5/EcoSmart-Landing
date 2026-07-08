(function () {
    "use strict";

    var scripts = document.getElementsByTagName('script');
    var basePath = '';
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src');
        if (src && src.indexOf('main.js') !== -1) {
            basePath = src.replace('main.js', '');
            break;
        }
    }

    var modules = [
        'navigation.js',
        'faq.js',
        'contact.js',
        'auth.js',
        'scanner.js',
        'counters.js',
        'map.js',
        'usuarios.js'
    ];

    modules.forEach(function (moduleName) {
        var script = document.createElement('script');
        script.src = basePath + moduleName;
        script.async = false;
        (document.body || document.head || document.documentElement).appendChild(script);
    });
})();