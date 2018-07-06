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

  constructor(private _contentService: contentService) { }
  ngOnInit() {
    this._contentService.getContent()
      .subscribe(resContent => {
        this.contents = resContent;
        this.numberOfQuestionsInCurrentRound = this.contents.rounds[this.currentRound].questions.length;
      });
  }
  OnDestroy(){
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
    let starVal = 1,
      curVal = 1,
      lastVal = 46;
    this.rotateImage(curVal, lastVal);
  }
  rotateImage(curVal, lastVal) {
    this.currImageName = `/assets/img/lock${this.padDigits(curVal,4)}.png`;
    if (curVal !== lastVal) {
      this.setintervalHolder = setTimeout(() => {
        this.rotateImage(parseInt(curVal) + 1, lastVal);
      }, 100);
    } else {
      clearTimeout(this.setintervalHolder);
         if (this.numberOfQuestionsInCurrentRound === (this.selectedAnswerIndex + 1)) {
        let currentRoundCalculation = this.currentRound.replace("round", '');
        this.currentRound = (Object.keys(this.contents.rounds).length == parseInt(currentRoundCalculation)) ? "round1" : "round" + (parseInt(currentRoundCalculation) + 1);
        this.currentQuestion = 0;
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
