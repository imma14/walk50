import React, { Component } from 'react';
import '../Css/Stage.scss'
import Spritesheet from 'react-responsive-spritesheet'
import Levels from './Levels'
import { connect } from 'react-redux'

class Stage extends Component {

    constructor(props){
        super(props);
        this.state = {
            scrollLeft : 0,
            rewind : false,
            moving : false,
            attempts : 0,
            level :0,
            movingValue : 0
        }
    }

    goForward = (value, steps) => {
        // redux store
        const action = {type : 'ADD_SCORE', value : steps}
        this.props.dispatch(action)

        this.setState({
            scrollLeft : this.state.scrollLeft + value,
            moving : true,
            attempts : this.state.attempts + 1,
            level : this.state.level + steps,
            movingValue : steps
        })
        setTimeout(() => {
            this.setState({moving: false, rewind : false, movingValue : 0});
          }, 3000)
    }

    goBackward = (value, steps) => {
        // redux store
        const action = {type : 'SUBSTRACT_SCORE', value : steps}
        this.props.dispatch(action)

        this.setState({
            level : this.state.level - steps < 0 ? 0 : this.state.level - steps,
        })

        // bloquer les retours à zéro minimum
        if(this.state.level !== 0){
            if(this.state.scrollLeft + value >= 0) {
                this.setState({
                    rewind : true,
                    scrollLeft : 0,
                    moving : true,
                    attempts : this.state.attempts + 1,
                    movingValue : steps
                })
                setTimeout(() => {
                    this.setState({moving: false, rewind : false, movingValue : 0});
                  }, 3000)
            } else {
                this.setState({
                    rewind : true,
                    scrollLeft : this.state.scrollLeft + value,
                    moving : true,
                    attempts : this.state.attempts + 1,
                    movingValue : steps
                })
                setTimeout(() => {
                    this.setState({moving: false, rewind : false, movingValue : 0});
                  }, 3000)
            }
        } else {
            this.setState({
                attempts : this.state.attempts + 1
            })
        }
    }

    movingCharacter = (steps)=>{
        switch(steps){
            case(0) :
                return "./images/idle-sheet.png";
            case(1) :
                return "./images/walk-sheet.png";
            case(3) :
                return "./images/walk-sheet.png";
            case(5) :
                return "./images/run-sheet.png";
            default :
                return "./images/idle-sheet.png";
        }
    }

    CharacterDirection = () => {
        if(this.state.rewind){
            return {transform : "scaleX(-1)"}
        } else {
            return {transform : "none"}
        }
    }

    render(){
        return(
            <div id="stage" style={{ backgroundPositionX: this.state.scrollLeft}}>
                <div id="scorebox">Score<br/>{this.state.attempts}</div>
                <Levels scrollLevels={this.state.scrollLeft}/>
                <Spritesheet
                    image={this.movingCharacter(this.state.movingValue)}
                    widthFrame={363}
                    heightFrame={483}
                    steps={15}
                    fps={12}
                    loop={true}
                    style={this.CharacterDirection()}
                />
                <button id="go1" onClick={()=> this.goForward(-445, 1)}>avance 1</button>
                <button id="go3" onClick={()=> this.goForward(-1335, 3)}>avance 3</button>
                <button id="go5" onClick={()=> this.goForward(-2225, 5)}>avance 5</button>
                <button id="go1" onClick={()=> this.goBackward(445, 1)}>recul 1</button>
                <button id="go3" onClick={()=> this.goBackward(1335, 3)}>recul 3</button>
                <button id="go5" onClick={()=> this.goBackward(2225, 5)}>recul 5</button>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        score : state.score
    }
  }
export default connect(mapStateToProps)(Stage); 