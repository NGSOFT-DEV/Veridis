const styles = { 
    transform: `rotate(${-this.state.heading}rad)` 
};
@return (
    <div id="orientationIndicator" className="orientation-indicator">
        <div>
            <img src={this.settings.indicatorBackImage}/>
        </div>
        <div id="orientationIndicationNeedle" className="orientation-indicator-needle" style={styles}>
            <img src={this.settings.indicatorForeImage}/>
        </div>
    </div>)