import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-toggle',
  imports: [],
  templateUrl: './button-toggle.html',
  styleUrl: './button-toggle.scss'
})
export class ButtonToggle {
  @Input() text: string = "";
  @Input() isSelected: boolean = false;
}
