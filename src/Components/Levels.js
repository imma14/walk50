import React, { Component }  from 'react'
import '../Css/Levels.scss'
import ClassNames from 'classnames'
import { connect } from 'react-redux'

class Levels extends Component {
    constructor(props){
        super(props)
        this.state = {active : true}
    }

    render() {
        let steps = [];
        for (var i = 1; i <= 50; i++) {
            steps.push(i);
        }
        let score = this.props.score
        return (
            <div id="steps" style={{left : this.props.scrollLevels+"px"}}>
                <div className="step shape-outer octagon lighted">
                    <div className="shape-inner octagon">START</div>
                </div>
                {steps.map(function(step, index){
                    return (
                        <div 
                        className={ClassNames({
                            'step shape-outer chevron-right': true,
                            'lighted': score > index  
                          })}
                        
                        key={ index } id={step}>
                            <div className="shape-inner chevron-right">{step}</div>
                        </div>
                    )
                  })}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        score : state.scoreReducer.score,
        step : state.stepReducer.step
    }
  }
export default connect(mapStateToProps)(Levels); 