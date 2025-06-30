import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./components/navigation/sidebar/sidebar";
import { Navbar } from "./components/navigation/navbar/navbar";
import { Footer } from "./components/navigation/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'VSS-Client';
}
