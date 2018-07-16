import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { contentService } from '../services/content.services'

// interface ContentsType {s
//   title: string,
//   sfxPool: {'@value':string}
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [contentService]
})

export class AppComponent implements OnInit {
  contents: any = {};
  currentRound: string = "round1";
  currentQuestion: number = 0;
  selectedAnswerIndex: number = -1;
  okButtonDisabled: boolean = true;
  numberOfQuestionsInCurrentRound: number;
  currImageName: string = "/assets/img/lock0001.png";
  setintervalHolder: any;
  changeDivColor: number = 0;
  clickedCounter: number = 0;
  cameFrom: number;
  imageSet: any = {
    "round1": [
      { 'start': 1, 'end': 46 },
      { 'start': 47, 'end': 138 }
    ],
    "round2": [
      { 'start': 139, 'end': 184 },
      { 'start': 185, 'end': 230 },
      { 'start': 231, 'end': 276 }
    ],
    "round3": [
      { 'start': 277, 'end': 322 },
      { 'start': 323, 'end': 368 },
      { 'start': 369, 'end': 456 }
    ]
  }

  @ViewChildren('options') optionBtnElement: QueryList<ElementRef>
  constructor(private _contentService: contentService) { }
  ngOnInit() {
    this._contentService.getContent()
      .subscribe(resContent => {
        this.contents = resContent;
        this.numberOfQuestionsInCurrentRound = this.contents.rounds[this.currentRound].questions.length;
      });
  }
  OnDestroy() {
    clearTimeout(this.setintervalHolder);
  }
  optionSelected(index) {
    this.okButtonDisabled = false;
    this.selectedAnswerIndex = index;
  }
  okClicked() {
    if (this.contents.rounds[this.currentRound].questions[this.currentQuestion].status === 2) {   
      this.contents.rounds[this.currentRound].questions[this.currentQuestion]['status'] = 3;   
      this.changeQuestion();
    } else {
      if (this.contents.rounds[this.currentRound].questions[this.currentQuestion].correctAnswer - 1 == this.selectedAnswerIndex) {
        this.clickedCounter = 0;
        this.changeImage();
      } else {
        this.playTestPassed("Incorrect");
        this.okButtonDisabled = true;

        if (this.clickedCounter == 1) {
          this.showCorrectAnswer();
        } else {
          this.clickedCounter += 1;
        }
      }
    }
  }

  playTestPassed(textPassed) {
    let msg = new SpeechSynthesisUtterance();
    msg.text = textPassed;
    speechSynthesis.speak(msg);

  }

  

  getCurrentRoundNextQuestion(): any {
    // this.contents.rounds[this.currentRound].questions.find((row, index) => {
    //   console.log(row.status)
    //   if (row.status !== 1) {
    //     return index;
    //   }
    // });

    let result;
    this.contents.rounds[this.currentRound].questions.sort((prevRow,nextRow)=>{
      return prevRow.status > 0;
    });
    
    for (let i = 0; i < this.contents.rounds[this.currentRound].questions.length; i++) {
      if (this.contents.rounds[this.currentRound].questions[i].status !== 1) {
        result = i;
        break;
      }
    }
    return result;


  }


  changeQuestion() {
     clearTimeout(this.setintervalHolder);
    // cases if all are  
    let getNextQuestion = this.getCurrentRoundNextQuestion();
    if (typeof getNextQuestion !== 'undefined') {
      this.okButtonDisabled = true;
      this.currentQuestion = getNextQuestion;
    } else {
      // change round   
      let currentRoundCalculation = this.currentRound.replace("round", '');
      if (Object.keys(this.contents.rounds).length != parseInt(currentRoundCalculation)) {
        this.currentRound = "round" + (parseInt(currentRoundCalculation) + 1);
        this.currentQuestion = 0;
      } else {
        this.okButtonDisabled = true;
      }
    }


    /*
    
    
    
        let shiftQuestionTo = this.checkCurrentRoundFailedQuestions();
        if (shiftQuestionTo !== 'undefined') {
          this.okButtonDisabled = true;
          this.currentQuestion = shiftQuestionTo;
        } else {
          let completedQuestionsInRound = this.getCompletedQuestions();
          if (this.numberOfQuestionsInCurrentRound === (this.currentQuestion + 1)) {
    
            let currentRoundCalculation = this.currentRound.replace("round", '');
            if (Object.keys(this.contents.rounds).length != parseInt(currentRoundCalculation)) {
              this.currentRound = (Object.keys(this.contents.rounds).length == parseInt(currentRoundCalculation)) ? "finished" : "round" + (parseInt(currentRoundCalculation) + 1);
              this.numberOfQuestionsInCurrentRound = this.contents.rounds[this.currentRound].questions.length;
              this.currentQuestion = 0;
            } else {
              this.okButtonDisabled = true;
            }
          } else {
            this.okButtonDisabled = true;
            this.currentQuestion += 1;
          }
        }*/
        this.resetOption();
  }

  changeImage() {
    let totalQuestions = this.contents.rounds[this.currentRound].questions.length;  
    let alreadyAnswered = this.contents.rounds[this.currentRound].questions.filter((row,index)=>{
      if(row.status === 1){
        return row;
      }
    });
    let indexOfImage = (typeof alreadyAnswered === 'undefined')?0:alreadyAnswered.length;
    let curVal =  this.imageSet[this.currentRound][indexOfImage].start,
      lastVal = this.imageSet[this.currentRound][indexOfImage].end;
      this.contents.rounds[this.currentRound].questions[this.currentQuestion]['status'] = 1;      
    this.rotateImage(curVal, lastVal);
  }


  rotateImage(curVal, lastVal) {
    this.currImageName = `/assets/img/lock${this.padDigits(curVal, 4)}.png`;
    if (curVal != lastVal) {
      this.setintervalHolder = setTimeout(() => {
        this.rotateImage(parseInt(curVal) + 1, lastVal);
      }, 50);
    } else {
      this.selectedAnswerIndex = -1;
      this.playTestPassed("Correct");
      this.changeQuestion();
    }
  }

  resetOption() {
    this.okButtonDisabled = true;
    this.selectedAnswerIndex = -1;
  }
  padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number;
  }

  playSwf() {
    let newWin = window.open("", "_blank");
    newWin.document.getElementsByTagName('body')[0].innerHTML = `<object width="400" height="50" data="localhost:4201/assets/img/hlp.swf"></object>`;
  }

  showCorrectAnswer() {
    this.clickedCounter = 0;
    this.contents.rounds[this.currentRound].questions[this.currentQuestion]['status'] = 2;
    let el = this.optionBtnElement["_results"][this.contents.rounds[this.currentRound].questions[this.currentQuestion].correctAnswer - 1].nativeElement as HTMLElement;
    el.click();
    this.okButtonDisabled = true;
    setTimeout(()=>this.okClicked(),3000);
  }
}
