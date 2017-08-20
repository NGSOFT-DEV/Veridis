class OrientationIndicator extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            heading: 3,
        };

        this.settings = {indicatorBackImage:"",indicatorForeImage:""};

        app.dependencyLoaded(this, "SettingsLoaderService", this.SettingsLoaderServiceLoaded);
        app.dependencyLoaded(this, "CesiumWrapperService", this.CesiumWrapperServiceLoaded);

    }

    componentDidMount() {
        this.Mounted = true;
    }

    componentWillUnmount () {
        this.Mounted = false;
    }

    SettingsLoaderServiceLoaded(SettingsLoaderService){
        SettingsLoaderService.loadSettings({jsonUrl: "assets/OrientationIndicatorSettings.json", caller: this, callback: this.settingsLoaded});
    }

    CesiumWrapperServiceLoaded(CesiumWrapperService){
        CesiumWrapperService.subscribeToHeadingChanged(this.refreshOrientationFunction, this);
    }

    refreshOrientationFunction(newHeading, oldHeading){
        if (this.Mounted) {
            this.setState({heading: newHeading});
        }
        
    }

    settingsLoaded(){
    }

    
}

// ReactDOM.render(
//     <OrientationIndicator/>,
//     document.getElementById('root')
// );