import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Navbar, Sidebar } from './shared/components/navigation';
import { UserDispatchService } from './features/users/services/user-dispatch.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'VSS-Client';

  // Initializing here so it loads user always
  constructor(private userDispatchService: UserDispatchService) { }
}
