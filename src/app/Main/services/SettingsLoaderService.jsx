(function (){
    'use strict';
    app.service('SettingsLoaderService', ['ObjectInstantiatorService',
        function (ObjectInstantiatorService){

        var that = this;

        this.loadSettings = function(options){
            var responesRecieved = function(response){
                var responseFromServer = response;
                var recursivelyInstantiateObjectIfNeeded = ObjectInstantiatorService.instantiateObject(responseFromServer);
                var settingsPropertyName = options.settingsPropertyName;
                if(!settingsPropertyName){
                    settingsPropertyName = "settings";
                }
                options.caller[settingsPropertyName] = recursivelyInstantiateObjectIfNeeded;
                if(options.callback){
                    options.callback.call();
                }
            };
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(xmlhttp) {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    responesRecieved(JSON.parse(xmlhttp.target.responseText));
                }
            };
            xhttp.open("GET", options.jsonUrl, true);
            xhttp.send();

        };

        }]);
})();