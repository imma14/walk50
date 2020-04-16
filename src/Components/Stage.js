import React, { Component } from 'react';
import '../Css/Stage.scss'
import Spritesheet from 'react-responsive-spritesheet'
import Levels from './Levels'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import Question from './Question'
import Data from '../data/data.json'


class Stage extends Component {

    constructor(props){
        super(props);
        this.state = {
            scrollLeft : 0,
            rewind : false,
            moving : false,
            attempts : 0,
            level :0,
            movingValue : 0,
            showModal : false,
            showIntroModal : true,
            questions : questionsList,
            currentQuestion : {}
        }
    }

    // Open modal and send question
    openModal = (e) => {
        e.preventDefault()
        this.setState({showModal : true})

        let maxNumber = this.state.questions.length
        let randomQuestion = Math.floor(Math.random() * maxNumber) + 1
        this.state.questions.map((question, index)=>{
            if((index+1) === randomQuestion){
                this.setState({currentQuestion : question})
                this.removeCurrentQuestion(index)
            }            
        })
        //If no question left, reload questions list
        if(this.state.questions.length === 1) {
            this.setState({questions : [...questionsList]})
        }
    }

    // remove asked question from list
    removeCurrentQuestion = (index) => {
        const arr = this.state.questions.slice();
        arr.splice(index, 1)
        this.setState({ questions : arr });
    };

    closeModal = () => {
        this.setState({showModal : false})
    }

    closeIntroModal = (e) => {
        this.setState({showIntroModal : false})
        setTimeout(()=>{
            this.openModal(e)
        }, 1000)
    }

    moveCharacter = (e, forward, steps) => {
        if(forward) {
            //en avant
            let value = 0;
            switch(steps){
                case 1 :
                    value = -445
                    break
                case 3 :
                    value = -1335
                    break
                case 5 :
                    value = -2225
                    break
                default :
                    value = 0
            }
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

        } else {
            //en arrière
            let value = 0;
            switch(steps){
                case 1 :
                    value = 445
                    break
                case 3 :
                    value = 1335
                    break
                case 5 :
                    value = 2225
                    break
                default :
                    value = 0
            }
            
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
            // redux store
            const action = {type : 'SUBSTRACT_SCORE', value : steps}
            this.props.dispatch(action)

            this.setState({
                level : this.state.level - steps < 0 ? 0 : this.state.level - steps,
            })

        }
        setTimeout(()=> {
            this.openModal(e)
        }, 4000)
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
                <ReactModal 
                isOpen={this.state.showIntroModal}
                ariaHideApp={false}
                contentLabel="Minimal Modal Example"
                className="modal"
                >
                    <h1>Bienvenue !</h1>
                    <h2>Règles du jeu</h2>
                    <p>Chaque question appartient à un thème. En fonction du thème, vous pouvez choisir de répondre à une question facile, 
                        moyenne ou difficile.</p>
                    <p>Une bonne réponse à une question facile vous fera avancer d'une case, mais une mauvaise réponse vous fera reculer d'une case.</p>
                    <p>Pour les questions moyennes, vous avancerez ou reculerez de trois cases, et de cinq cases pour les questions difficles.</p>
                    <p>Le but est d'atteindre l'arrivée (case 50) avec le moins d'essais possibles.</p>
                    <p>Bonne chance !</p>
                    <button id="start-game" onClick={(e)=> this.closeIntroModal(e)}>Commencer</button> 
                </ReactModal>
                <ReactModal 
                isOpen={this.state.showModal}
                ariaHideApp={false}
                contentLabel="Minimal Modal Example"
                className="modal"
                >
                    <Question currentQuestion={this.state.currentQuestion} modalCallback={this.closeModal} scrollCallback={this.moveCharacter}/>
                </ReactModal>
                <div id="scorebox">Essais<br/>{this.state.attempts}</div>
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
                <button onClick={(e)=> this.openModal(e)}>Ouvrir modale</button>
            </div>
        )
    }
}
const questionsList = Data.map((data) => {
    return data
})

const mapStateToProps = (state) => {
    return {
        score : state.scoreReducer.score,
        step : state.stepReducer.step
    }
  }
export default connect(mapStateToProps)(Stage); 