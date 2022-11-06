import { Component, OnInit } from '@angular/core';
import { Convention } from './conventions.model';
import { ConventionsService } from '../../../services/conventions.service';

@Component({
  selector: 'app-conventions',
  templateUrl: './conventions.page.html',
  styleUrls: ['./conventions.page.scss'],
})
export class ConventionsPage implements OnInit {
  loadedCons: Convention[];

  constructor(private consService: ConventionsService) { }

  ngOnInit() {
    this.loadedCons = this.consService.cons;
  }

}
