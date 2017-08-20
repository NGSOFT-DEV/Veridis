var app = app || {};

(function () {
	'use strict';
	
	//  ReactDOM.render(
	//  	<OrientationIndicator/>,
	//  	document.getElementById('root')
	//  );


	app.servicesDefinitions = {};
	app.pendingServices = [];

	app.instantiateService = function(serviceName){
		
		var serviceAlreadyInstantiated = app[serviceName];
		if(serviceAlreadyInstantiated){
			return serviceAlreadyInstantiated;
		}

		var serviceDefinitions = app.servicesDefinitions[serviceName];
		if(serviceDefinitions === undefined){
			throw 'No service with the given name :'+serviceName;
		}

		var arrayOfDependenciesEndingWithImpl = serviceDefinitions;

		var argumentsArray = []
		app[serviceName] = {};
		for(var i=0;i<arrayOfDependenciesEndingWithImpl.length;i++){
			var currentDependency = arrayOfDependenciesEndingWithImpl[i];
			if(i==arrayOfDependenciesEndingWithImpl.length-1){
				var implementation = currentDependency;
				implementation.apply(app[serviceName], argumentsArray);
			}
			else{
				argumentsArray.push(app.instantiateService(currentDependency));
			}
		}

		Hermes.fireEvent("_pending_"+serviceName);
		return app[serviceName];
	};

	app.tryInstantiating = function(serviceName){

		var arrayOfDependenciesEndingWithImpl = app.servicesDefinitions[serviceName];
		for(var i=0;i<arrayOfDependenciesEndingWithImpl.length-1;i++){
			var currentDependency = arrayOfDependenciesEndingWithImpl[i];

			var serviceDefinitions = app.servicesDefinitions[currentDependency];
			if(serviceDefinitions === undefined){
				if(app.pendingServices.indexOf(currentDependency)<0){
					app.pendingServices.push(currentDependency);
				}
				
				Hermes.registerEvent("_pending_"+currentDependency, function(){app.tryInstantiating(serviceName);});
				return;
			}
		}

		app.instantiateService(serviceName);
		
	};


	app.service = function(serviceName, arrayOfDependenciesEndingWithImpl, eagerLoading){
		
		app.servicesDefinitions[serviceName] = arrayOfDependenciesEndingWithImpl;

		var indexOfPending = app.pendingServices.indexOf(serviceName);
		if(indexOfPending>-1){
			eagerLoading = true;
			app.pendingServices.splice(indexOfPending, 1);
		}

		if(eagerLoading){
			app.tryInstantiating(serviceName);
		}
	};

	app.dependencyLoaded = function(context, serviceName, callback){
		var serviceAlreadyInstantiated = app[serviceName];
		if(serviceAlreadyInstantiated){
			callback.call(context, serviceAlreadyInstantiated);
			return;
		}

		if(app.pendingServices.indexOf(serviceName)<0){
			app.pendingServices.push(serviceName);
		}
		
		Hermes.registerEvent("_pending_"+serviceName, function(){callback.call(context, app[serviceName]);});

	}

	

})();
