import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

  constructor(
    public router : Router
  ) { }

  ngOnInit(): void {
  }

  public goToSignIn(): any {
    this.router.navigate(['/login']);
  }//end of goToSign function

}
