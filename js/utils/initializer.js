mp.events.add('initializeMessages', (language, functionName, ...parameters) => {
    // Get the language resource path
    let path = '../i18n/' + language + '.json';

    i18next.use(window.i18nextXHRBackend).init({
        backend: { loadPath: path }
    }, function(err, t) {
        // Initialize the i18n
        jqueryI18next.init(i18next, $, {
            optionsAttr: 'i18n-options',
            useOptionsAttr: true,
            parseDefaultValueFromContent: true
        });
        
        // Translate the HTML
        $(document).localize();
        
        
        if (functionName !== undefined && functionName.length > 0) {
            // Call the function
            window[functionName].apply(this, parameters);
        }
    });
});
