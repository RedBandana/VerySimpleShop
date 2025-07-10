import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Navbar, Sidebar } from './shared/components/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'VSS-Client';
}
