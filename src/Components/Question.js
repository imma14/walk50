import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faBook, faMusic, faHistory, faGamepad, faGlobe, faFootballBall, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import fastDiff from 'fast-diff'

class Question extends Component {
    constructor(props){
        super(props)
        this.state = ({
            questionBox : 'choice',
            answerBg : "#f5f5cf",
            answerColor : "#464a48",
            disable : false,
            hardAnswer : '',
            hardAnswerResult : false,
            hardAnswerResultText : ''
        })
    }

    displayQuestion(){
        if(this.state.questionBox === 'choice') {
            return(
                <div>
                    <div>Choisissez votre question :</div>
                    <div id="choices-container">
                        <div className="choice" onClick={()=>this.questionChoice('easy')}>
                            <p>Facile <span class="mobile-only">(1 pas)</span></p>
                            <img src="/images/easy.png" alt="facile"/>
                            <p class="no-mobile">Avance/Recul de <span className="bold">1</span> pas</p>
                        </div>
                        <div className="choice" onClick={()=>this.questionChoice('medium')}>
                            <p>Moyen <span class="mobile-only">(3 pas)</span></p>
                            <img src="/images/medium.png" alt="moyen"/>
                            <p class="no-mobile">Avance/Recul de <span className="bold">3</span> pas</p>
                        </div>
                        <div className="choice" onClick={()=>this.questionChoice('hard')}>
                            <p>Difficile <span class="mobile-only">(5 pas)</span></p>
                            <img src="/images/hard.png" alt="facile"/>
                            <p class="no-mobile">Avance/Recul de <span className="bold">5</span> pas</p>
                        </div>
                    </div>
                </div>
            )
        }
        else if(this.state.questionBox === 'medium' || this.state.questionBox === 'easy') {
            let difficulty = ''
            if(this.state.questionBox === 'medium'){
                difficulty = this.props.currentQuestion.medium
            } else {
                difficulty = this.props.currentQuestion.easy
            }
            let answerBg = this.state.answerBg
            let answerColor = this.state.answerColor
            return(
                <div>
                <div className="questionTitle">{difficulty.title}</div>
                <div className="multiple-choices">
                    <div 
                    className="choice" 
                    onClick={(ev)=>{!this.state.disable && this.getAnswer(ev, this.state.questionBox, difficulty.propositions.text1)}}
                    style={ { background: difficulty.propositions.text1 === difficulty.answer ? answerBg : '#f5f5cf', color : difficulty.propositions.text1 === difficulty.answer ? answerColor : '#464a48' } }
                    >
                        {difficulty.propositions.text1}
                    </div>
                    <div 
                    className="choice" 
                    onClick={(ev)=>{!this.state.disable && this.getAnswer(ev, this.state.questionBox, difficulty.propositions.text2)}}
                    style={ { background: difficulty.propositions.text2 === difficulty.answer ? answerBg : '#f5f5cf', color : difficulty.propositions.text2 === difficulty.answer ? answerColor : '#464a48' } }
                    >
                        {difficulty.propositions.text2}
                    </div>
                    <div 
                    className="choice" 
                    onClick={(ev)=>{!this.state.disable && this.getAnswer(ev, this.state.questionBox, difficulty.propositions.text3)}}
                    style={ { background: difficulty.propositions.text3 === difficulty.answer ? answerBg : '#f5f5cf', color : difficulty.propositions.text3 === difficulty.answer ? answerColor : '#464a48' } }
                    >
                        {difficulty.propositions.text3}
                    </div>
                    <div 
                    className="choice" 
                    onClick={(ev)=>{!this.state.disable && this.getAnswer(ev, this.state.questionBox, difficulty.propositions.text4)}}
                    style={ { background: difficulty.propositions.text4 === difficulty.answer ? answerBg : '#f5f5cf', color : difficulty.propositions.text4 === difficulty.answer ? answerColor : '#464a48' } }
                    >
                        {difficulty.propositions.text4}
                    </div>
                </div>
                </div>
            )
        }
        else if(this.state.questionBox === 'hard') {
            return(
                <div>
                    <div className="questionTitle">{this.props.currentQuestion.hard.title}</div>
                    <div className="format">{this.props.currentQuestion.hard.format ? this.props.currentQuestion.hard.format : ''}</div>
                    <form onSubmit={(event) => this.getAnswerHard(event, 5)}> 
                        <input type="text" autoFocus value={this.state.hardAnswer} onChange={this.handleChange}/>
                        <input type="submit" id="validation" value="valider" />
                        <div className="result">{this.state.hardAnswerResultText}</div>
                    </form>
                </div>
            )
        }
    }

    handleChange = (event) => {
        this.setState({hardAnswer: event.target.value});
    }

    getAnswerHard = (event, steps) => {
        const {modalCallback, scrollCallback} = this.props
        event.preventDefault()
        let preparedProposition = this.prepareHardAnswer(this.state.hardAnswer)
        let preparedAnswer = this.prepareHardAnswer(this.props.currentQuestion.hard.answer)
        if(preparedProposition === preparedAnswer) {
            this.setState({hardAnswerResultText : 'Bonne réponse ! '})
            setTimeout(function(){
                scrollCallback(event, true, steps)
            }, 2000)
        } else {
            // 3 letters error accepted for answers > 8 letters
            if(preparedProposition.length > 8) {
                let differences = fastDiff(preparedAnswer, preparedProposition)
                let tolerance = 0
                differences.map((difference)=>{
                    if(difference[0] === 1 || difference[0] === -1){
                        tolerance = tolerance + difference[1].length
                    }        
                })
                if(tolerance <=3) {
                    this.setState({hardAnswerResultText : "On vous l'accorde... La réponse exacte était : "  + this.props.currentQuestion.hard.answer})
                    setTimeout(function(){
                        scrollCallback(event, true, steps)
                    }, 2000)
                } else {
                    this.setState({hardAnswerResultText : 'Mauvaise réponse. La réponse était : ' + this.props.currentQuestion.hard.answer})
                    setTimeout(function(){
                        scrollCallback(event, false, steps)
                    }, 2000)
                }
            } else {
                this.setState({hardAnswerResultText : 'Mauvaise réponse. La réponse était : ' + this.props.currentQuestion.hard.answer})
                setTimeout(function(){
                    scrollCallback(event, false, steps)
                }, 2000)
            }
        }
        setTimeout(function(){
            modalCallback()
        }, 2000)
    }

    prepareHardAnswer(answer) {
            if(typeof answer === 'string'){
                var str = answer ; 
                var tab_accent_brut = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ";
                var tab_sansAccent_brut = "aaaaaaaaaaaaooooooooooooeeeeeeeecciiiiiiiiuuuuuuuuynn";
                var tab_accent = tab_accent_brut.split('');
                var tab_sansAccent = tab_sansAccent_brut.split('');
                var tabCorrAcc = new Array();
                var i = -1;
                while (tab_accent[++i]) {
                tabCorrAcc[tab_accent[i]] = tab_sansAccent[i]
                }
                tabCorrAcc['Œ'] = 'OE';
                tabCorrAcc['œ'] = 'oe';
                str = str.replace(/./g, function($0) {
                return (tabCorrAcc[$0]) ? tabCorrAcc[$0] : $0
                })
                str = str.replace(/&amp;/g, '');
                str = str.replace(/_amp;/g, '');
                str = str.replace(/&lt;/g, '');
                str = str.replace(/_lt;/g, '');
                str = str.replace(/&gt;/g, '');
                str = str.replace(/_gt;/g, '');
                str = str.replace(/(-| |#|"|@|:|\.|,|;|'|%|!|²|=|÷|\+|\?|\/|\[|\]|\{|\}|\*|\^|\$|\\|`|"|'|¨|€|£|¤|µ|§|~|ƒ|„|©|°)/g, '')
            return str.toUpperCase();
            }
    }

    getAnswer = (ev, difficulty, answer) => {
        const {modalCallback, scrollCallback} = this.props
        this.setState({disable : true})
        let steps
        let answerByDifficulty

        if(difficulty === 'easy'){
            steps = 1
            answerByDifficulty = this.props.currentQuestion.easy.answer
        } else {
            steps = 3
            answerByDifficulty = this.props.currentQuestion.medium.answer
        }
       
        if(answer === answerByDifficulty) {
            ev.currentTarget.style.background = "#1e981e"
            ev.currentTarget.style.color = "#fff"
            ev.currentTarget.style.textShadow = "none"
            setTimeout(function(){
                scrollCallback(ev, true, steps)
            }, 1500)
        } else {
            ev.currentTarget.style.background = "#e23636"
            ev.currentTarget.style.color = "#fff"
            ev.currentTarget.style.textShadow = "none"
            this.setState({answerBg : "#1e981e" , answerColor : "white"})
            setTimeout(function(){
                scrollCallback(ev, false, steps)
            }, 1500)
        }
        setTimeout(function(){
            modalCallback()
        }, 1500)
    }

    selectIcon(categorie){
        switch(categorie){
            case 'Littérature':
                return <FontAwesomeIcon icon={faBook} />
            case 'Cinéma':
                return <FontAwesomeIcon icon={faFilm} />
            case 'Musique' :
                return <FontAwesomeIcon icon={faMusic} />
            case 'Histoire' :
                return <FontAwesomeIcon icon={faHistory} />
            case 'Pop Culture' :
                return <FontAwesomeIcon icon={faGamepad} />
            case 'Géographie' :
                return <FontAwesomeIcon icon={faGlobe} />
            case 'Sport' :
                return <FontAwesomeIcon icon={faFootballBall} />
            default :
                return <FontAwesomeIcon icon={faQuestionCircle} />
        }
    }

    questionChoice = (difficulty) => {
        this.setState({questionBox : difficulty}) 
    }

    render(){
        return(
            <div>
            <h2>{this.selectIcon(this.props.currentQuestion.categorie)} {this.props.currentQuestion.categorie}</h2>
            <h1>Thème : {this.props.currentQuestion.theme}</h1>
            <div>{this.displayQuestion()}</div>
            </div>
            
        )
        
    }
}
export default Question