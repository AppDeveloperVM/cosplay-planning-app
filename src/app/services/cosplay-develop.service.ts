import { Injectable } from '@angular/core';
import { CosElementToBuy } from '../models/cosElementToBuy.model';
import { CosElementToDo } from '../models/cosElementToDo.model';
import { CosTask } from '../models/cosTask.model';

//Firebase 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cosplay } from '../models/cosplay.model';
import { CosplaysService } from './cosplays.service';


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
  cosplay: any;
  cosplayObsv$ = new Subject<Cosplay>();
  //Collections
  elementsToBuyObsv$: Observable<CosElementToBuy[]>;
  elementsToDoObsv: Observable<CosElementToDo[]>;
  tasksObsv: Observable<CosTask[]>;
  cosplaysCollection: AngularFirestoreCollection<Cosplay>;
  elToBuyCollection: AngularFirestoreCollection<CosElementToBuy>;
  elToDoCollection: AngularFirestoreCollection<CosElementToDo>;
  tasksCollection: AngularFirestoreCollection<CosTask>;

  constructor(
    private readonly afs: AngularFirestore,
    private cosService: CosplaysService
  ) {

    this.cosplaysCollection = afs.collection<Cosplay>('cosplays');
    this.cosService.getCosplays();
  }


  public getElementsToBuy(): void {
    this.elementsToBuyObsv$ = this.elToBuyCollection.snapshotChanges().pipe(
      map( elements => elements.map( 
        el => {
          const data = el.payload.doc.data() as CosElementToBuy;
          const elId = el.payload.doc.id;
          return { elId, ...data };
        }
      ))
    )
  }

  public getElementsToDo(): void {
    this.elementsToDoObsv = this.elToDoCollection.snapshotChanges().pipe(
      map( elements => elements.map( el => 
        {
          const data = el.payload.doc.data() as CosElementToDo;
          const elId = el.payload.doc.id;
          return { elId, ...data };
        }
      ))
    )
  }

  public getTasks(): void {
    this.tasksObsv = this.tasksCollection.snapshotChanges().pipe(
      map( elements => elements.map( el => 
        {
          const data = el.payload.doc.data() as CosTask;
          const elId = el.payload.doc.id;
          return { elId, ...data };
        }
      ))
    )
  }

  getElToBuyById(elementId: string) {
    return this.afs
    .collection('cosElementsToBuy')
    .doc(elementId)
    .valueChanges()
  }

  getElToMakeById(elementId: string) {
    return this.afs
    .collection('cosElementsToMake')
    .doc(elementId)
    .valueChanges()
  }

  getTaskById(elementId: string) {
    return this.afs
    .collection('cosTasks')
    .doc(elementId)
    .valueChanges()
  }

  onSaveElToBuy(element: CosElementToBuy, cosplayId: string): Promise<void> {
    return new Promise( async (resolve, reject) => {
      try {
        const id = cosplayId || this.afs.createId();
        const data = {id, ... element};
        const result = await this.cosplaysCollection.doc(id).collection('cosElementsToBuy').doc().set(data);
        resolve(result)
      } catch(err) {
        reject(err.message)
      }
    })
  }

  onDeleteElementToBuy(elementId: string, cosplayId: string): Promise<void> {
    return new Promise (async (resolve, reject) => {
        try {
            const result = this.cosplaysCollection.doc(cosplayId).collection('cosElementsToBuy').doc(elementId).delete();
            resolve(result);
        } catch(err){
            reject(err.message)
        }
    })
  }

  onSaveElToMake(element: CosElementToDo, cosplayId: string): Promise<void> {
    return new Promise( async (resolve, reject) => {
      try {
        const id = cosplayId || this.afs.createId();
        const data = {id, ... element};
        const result = await this.cosplaysCollection.doc(id).collection('cosElementsToMake').doc().set(data);
        resolve(result)
      } catch(err) {
        reject(err.message)
      }
    })
  }

  onDeleteElementToMake(elementId: string, cosplayId: string): Promise<void> {
    return new Promise (async (resolve, reject) => {
        try {
            const result = this.cosplaysCollection.doc(cosplayId).collection('cosElementsToMake').doc(elementId).delete();
            resolve(result);
        } catch(err){
            reject(err.message)
        }
    })
  }


}
