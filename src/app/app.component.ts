import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  selectedAnswerIndex: number = 0;
  okButtonDisabled: boolean = true;
  numberOfQuestionsInCurrentRound: number;
  constructor(private _contentService: contentService) { }
  ngOnInit() {
    this._contentService.getContent()
      .subscribe(resContent => {
        this.contents = resContent;
        this.numberOfQuestionsInCurrentRound = this.contents.rounds[this.currentRound].questions.length;        
      });
  }
  optionSelected(index) {
    this.okButtonDisabled = false;
    this.selectedAnswerIndex = index;
  }
  okClicked() {
    if (this.contents.rounds[this.currentRound].questions[this.currentQuestion].correctAnswer - 1 == this.selectedAnswerIndex) {
      if(this.numberOfQuestionsInCurrentRound === (this.selectedAnswerIndex + 1)){ 
        let currentRoundCalculation = this.currentRound.replace("round",'');
        this.currentRound = (Object.keys(this.contents.rounds).length == parseInt(currentRoundCalculation))?"round1":"round"+(parseInt(currentRoundCalculation)+1);
        this.currentQuestion = 0;         
      }else{
        this.currentQuestion += 1; 
      }
      this.selectedAnswerIndex = 0;
      console.log("correct");
    } else {
      console.log("Wrong");
    }       
  }
}
