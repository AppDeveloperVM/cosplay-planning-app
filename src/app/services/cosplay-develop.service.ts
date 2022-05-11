import { Injectable } from '@angular/core';
import { CosElementToBuy } from '../models/cosElementToBuy.model';
import { CosElementToDo } from '../models/cosElementToDo.model';
import { CosTask } from '../models/cosTask.model';

//Firebase 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CosplayDevelopService {

  private _cosElementsToBuy = new BehaviorSubject<CosElementToBuy[]>([]);
  private _cosElementsToDo = new BehaviorSubject<CosElementToDo[]>([]);
  private _cosTasks = new BehaviorSubject<CosTask[]>([]);

  get elementsToBuy() {
    return this._cosElementsToBuy.asObservable();
  }

  get elementsToDo() {
    return this._cosElementsToDo.asObservable();
  }

  get tasks() {
    return this._cosTasks.asObservable();
  }

  //Collections
  elementsToBuyObsv: Observable<CosElementToBuy[]>;
  elementsToDoObsv: Observable<CosElementToDo[]>;
  tasksObsv: Observable<CosTask[]>;
  private elToBuyCollection: AngularFirestoreCollection<CosElementToBuy>;
  private elToDoCollection: AngularFirestoreCollection<CosElementToDo>;
  private tasksCollection: AngularFirestoreCollection<CosTask>;

  constructor(
    private readonly afs: AngularFirestore
  ) {
    this.elToBuyCollection = afs.collection<CosElementToBuy>('cosElementsToBuy');
    this.elToDoCollection = afs.collection<CosElementToDo>('cosElementsToDo');
    this.tasksCollection = afs.collection<CosTask>('cosTasks');

    this.getElementsToBuy();
    this.getElementsToDo();
    this.getTasks();
  }


  private getElementsToBuy(): void {
    this.elementsToBuyObsv = this.elToBuyCollection.snapshotChanges().pipe(
      map( elements => elements.map( el => el.payload.doc.data() as CosElementToBuy))
    )
  }

  private getElementsToDo(): void {
    this.elementsToDoObsv = this.elToDoCollection.snapshotChanges().pipe(
      map( elements => elements.map( el => el.payload.doc.data() as CosElementToDo))
    )
  }

  private getTasks(): void {
    this.tasksObsv = this.tasksCollection.snapshotChanges().pipe(
      map( elements => elements.map( el => el.payload.doc.data() as CosTask))
    )
  }


  onSaveElToBuy(element: CosElementToBuy, elementId: string): Promise<void> {
    return new Promise( async (resolve, reject) => {
      try {
        const id = elementId || this.afs.createId();
        const data = {id, ... element};
        const result = await this.elToBuyCollection.doc(id).set(data);
        resolve(result)
      } catch(err) {
        reject(err.message)
      }
    })
  }


}
