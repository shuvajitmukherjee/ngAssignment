import { Component, OnInit, OnDestroy } from '@angular/core';
import { contentService } from '../services/content.services'

// interface ContentsType {
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
    if (this.contents.rounds[this.currentRound].questions[this.currentQuestion].correctAnswer - 1 == this.selectedAnswerIndex) {
      this.changeImage();
    } else {
      this.playTestPassed("Incorrect");
    }
  }

  playTestPassed(textPassed) {
    let msg = new SpeechSynthesisUtterance();
    msg.text = textPassed;
    speechSynthesis.speak(msg);

  }

  changeImage() {
    let curVal = this.contents.rounds[this.currentRound].questions[this.currentQuestion].currentValue,
      lastVal = this.contents.rounds[this.currentRound].questions[this.currentQuestion].LastValue;
    this.rotateImage(curVal, lastVal);
  }
  rotateImage(curVal, lastVal) {
    this.currImageName = `/assets/img/lock${this.padDigits(curVal, 4)}.png`;
    if (curVal != lastVal) {
      this.setintervalHolder = setTimeout(() => {
        this.rotateImage(parseInt(curVal) + 1, lastVal);
      }, 100);
    } else {
      clearTimeout(this.setintervalHolder);
      if (this.numberOfQuestionsInCurrentRound === (this.currentQuestion + 1)) {
        let currentRoundCalculation = this.currentRound.replace("round", '');

        if (Object.keys(this.contents.rounds).length != parseInt(currentRoundCalculation)) {
          this.currentRound = (Object.keys(this.contents.rounds).length == parseInt(currentRoundCalculation)) ? "finished" : "round" + (parseInt(currentRoundCalculation) + 1);
          this.numberOfQuestionsInCurrentRound = this.contents.rounds[this.currentRound].questions.length;
          if (this.currentRound === 'round2') {
            this.changeDivColor = 1;
          } else if (this.currentRound === 'round3') {
            this.changeDivColor = 2;
          }
          this.currentQuestion = 0;
        } else {
          this.changeDivColor = 3;
          this.okButtonDisabled = true;
        }
      } else {
        this.okButtonDisabled = true;
        this.currentQuestion += 1;
      }
      this.selectedAnswerIndex = -1;
      this.playTestPassed("Correct");
    }
  }

  resetOption() {
    this.okButtonDisabled = true;
    this.selectedAnswerIndex = -1;
  }
  padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number;
  }
  
}
