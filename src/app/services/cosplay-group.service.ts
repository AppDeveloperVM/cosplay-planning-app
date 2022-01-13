import { Injectable } from '@angular/core';
import { CosplayGroup } from '../main/cosplays/cosplay-groups/cosplay-group.model';
import { Cosplay } from '../main/cosplays/cosplay.model';
import { CharacterMember } from 'src/app/models/characterMember.model';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from '../main/cosplays/cosplay-groups/location.model';
import { stringify } from 'querystring';
import { User } from 'src/app/models/user.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';


interface CosplayGroupData {
    title: string;
    place: string;
    availableFrom: Date;
    availableTo: Date;
    imageUrl: string;
    series: string;
    userId: string;
    location: PlaceLocation;
    characters: any;
}

interface CosplayGroupMembersData {
    member: CharacterMember;
    cosplayGroupId: string;
}

interface CosplayGroupMemberData {
    name: string;
    cosplayerId: string;
    asistanceConfirmed: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CosplayGroupService {
    private _cosplaygroups = new BehaviorSubject<CosplayGroup[]>(
        []
    );
    private _cosplaygroupsmembers = new BehaviorSubject<CharacterMember[]>(
        []
    );

    get cosplaygroups() {
        return this._cosplaygroups.asObservable();
    }

    get cosplaygroupsmembers() {
        return this._cosplaygroupsmembers.asObservable();
    }

    public cosplayGroup = CosplayGroup;
    cosplayGroupMembers:any[]=[];

    //Collections
    cosGroups: Observable<CosplayGroupData[]>;
    private cosgroupsCollection: AngularFirestoreCollection<CosplayGroupData>;
    private cosgroupCollection: AngularFirestoreCollection<CosplayGroupData>;

    constructor( 
        private authService: AuthService,
        private http: HttpClient,
        private readonly afs: AngularFirestore
    ) {
        this.cosgroupsCollection = afs.collection<CosplayGroupData>('cosplay-groups');
        this.getcosGroups();
        console.log("cosGroups: "+this.cosGroups);
    }

    private getcosGroups(): void {
        this.cosGroups = this.cosgroupsCollection.snapshotChanges().pipe(
            map( actions => actions.map( a => a.payload.doc.data() as CosplayGroupData))
        )
    }

    getcosGroupById(): void {
        this.cosGroups = this.cosgroupsCollection.snapshotChanges().pipe(
            map( actions => actions.map( a => a.payload.doc.data() as CosplayGroupData))
        )
    }

    onSaveCosGroup(cosGroup: CosplayGroupData, cosGroupId: string): Promise<void> {
        return new Promise( async (resolve, reject) => {
            try {
                const id = cosGroupId || this.afs.createId();
                const data = {id, ... cosGroup};
                const result = await this.cosgroupsCollection.doc(id).set(data);
                resolve(result);
            } catch (err) {
                reject(err.message)
            }
        })
    }

    onDeleteCosGroup(cosGroupId: string): Promise<void> {
        return new Promise (async (resolve, reject) => {
            try {
                const result = this.cosgroupsCollection.doc(cosGroupId).delete();
                resolve(result);
            } catch(err){
                reject(err.message)
            }
        })
    }

    getCosplayGroup(id: string) {
        return this.http.get<CosplayGroupData>(
            `https://cosplay-planning-app.firebaseio.com/cosplay-groups/${id}.json`
          ).pipe(
            map(cosplayGroupData => {
                //cosplaygroupmembers for
                const characters = cosplayGroupData.characters;
                this.cosplayGroupMembers = characters;
                console.log("characters data: "+ characters[0].name );

                return new CosplayGroup(
                    id,
                    cosplayGroupData.title,
                    cosplayGroupData.series,
                    cosplayGroupData.imageUrl,
                    cosplayGroupData.place,
                    cosplayGroupData.availableFrom,
                    cosplayGroupData.availableTo,
                    this.authService.userId,
                    cosplayGroupData.location
                );
                
            })
        );
    }

    getCosplayGroupMembers(id: string){
        
        return this.http.get<CosplayGroupData>(
            `https://cosplay-planning-app.firebaseio.com/cosplay-groups/${id}.json`
          ).pipe(
            map(cosplayGroupData => {
                //cosplaygroupmembers for
                const characters = cosplayGroupData.characters;
                this.cosplayGroupMembers = characters;
                console.log("characters data: "+ characters[0].name );

                return this.cosplayGroupMembers;
                
            })
        ); 
    }

    fetchCosplayGroupMembers(){
        return this.http
        .get<{ [key: string]: CosplayGroupMemberData}>(
            `https://cosplay-planning-app.firebaseio.com/cosplay-groups.json?orderBy="userId"&equalTo="${
            this.authService.userId
            }"`
        )
        .pipe(
            map(CosplayGroupMemberData => {
                const cosplayGroupMembers = [];
                for (const key in CosplayGroupMemberData) {
                    if (CosplayGroupMemberData.hasOwnProperty(key)) {
                        cosplayGroupMembers.push(
                            new CharacterMember(
                                CosplayGroupMemberData[key].name,
                                CosplayGroupMemberData[key].cosplayerId,
                                CosplayGroupMemberData[key].asistanceConfirmed
                            )
                        );
                    }
                }
                return cosplayGroupMembers;
            }), tap(cosplaygroupmembers => {
                //this._cosplaygroupmembers.next(cosplaygroupmembers);
            })
        );
    }

    fetchCosplayGroups(userId: String) {
        return this.http
        .get<{ [key: string]: CosplayGroupData}>(
            `https://cosplay-planning-app.firebaseio.com/cosplay-groups.json?orderBy="userId"&equalTo="${
            this.authService.userId
            }"`
        )
        .pipe(
            map(CosplayGroupData => {
                const cosplayGroups = [];
                
                for (const key in CosplayGroupData) {
                    if (CosplayGroupData.hasOwnProperty(key)) {
                        cosplayGroups.push(new CosplayGroup(
                            key,
                            CosplayGroupData[key].title,
                            CosplayGroupData[key].series,
                            CosplayGroupData[key].imageUrl,
                            CosplayGroupData[key].place,
                            new Date(CosplayGroupData[key].availableFrom),
                            new Date(CosplayGroupData[key].availableTo),
                            CosplayGroupData[key].userId,
                            CosplayGroupData[key].location
                            )
                        );
                    }
                }
                return cosplayGroups;
            }), tap(cosplaygroups => {
                this._cosplaygroups.next(cosplaygroups);
            })
        );
    }

    addCosplayGroup(
        title: string,
        series: string,
        imageUrl: string,
        place: string,
        dateFrom: Date,
        dateTo: Date,
        location: PlaceLocation,
    ) {
        let generatedId: string;
        const newCosplayGroup = new CosplayGroup(
            Math.random().toString(),
            title,
            series,
            imageUrl,
            place,
            dateFrom,
            dateTo,
            this.authService.userId,
            location
        );
        return this.http
        .post<{title: string}>(
            'https://cosplay-planning-app.firebaseio.com/cosplay-groups.json',
            { ...newCosplayGroup, id: null}
        ).pipe(
            switchMap(resData => {
                generatedId = resData.title;
                return this.cosplaygroups;
            }),
            take(1),
            tap(cosplaygroups => {
                newCosplayGroup.id = generatedId;
                this._cosplaygroups.next(cosplaygroups.concat(newCosplayGroup));
            }));

    }

    addCosplayGroupMember(
        name: string,
        cosplayerId: string,
        asistanceConfirmed: boolean,
        cosplayGroupId: string
    ){
        let generatedId: string;
        const newCosplayGroupMember = new CharacterMember(
            name,
            cosplayerId,
            asistanceConfirmed
        );

        return this.http
        .post<{title: string}>(
            'https://cosplay-planning-app.firebaseio.com/cosplay-groups.json',
            { ...newCosplayGroupMember, id: null}
        ).pipe(
            switchMap(resData => {
                //generatedId = resData.title;
                return this.cosplayGroupMembers;
            }),
            take(1),
            tap(cosplaygroupmembers => {
                //newCosplayGroupMember.id = generatedId;
                this._cosplaygroupsmembers.next(cosplaygroupmembers.concat(newCosplayGroupMember));
            }));
            

    }

    updateCosplayGroup(
        cosplayGroupId: string,
        title: string,
        series: string,
        imageUrl: string,
        place: string,
        availableFrom: Date,
        availableTo: Date,
        userId: string,
        location: PlaceLocation
    ) {
        let updatedCosplayGroups: CosplayGroup[];
        return this.cosplaygroups.pipe(
        take(1),
        switchMap( cosplays => {
            if (!cosplays || cosplays.length <= 0) {
            return this.fetchCosplayGroups(userId);
            } else {
            return of(cosplays);
            }

        }),
        switchMap(cosplaygroups => {
            const updatedCosplayGroupIndex = cosplaygroups.findIndex(cos => cos.id === cosplayGroupId);
            updatedCosplayGroups = [...cosplaygroups];
            const oldCosplay = updatedCosplayGroups[updatedCosplayGroupIndex];

            updatedCosplayGroups[updatedCosplayGroupIndex] = new CosplayGroup(
            oldCosplay.id,
            title,
            series,
            imageUrl,
            place,
            availableFrom,
            availableTo,
            userId,
            location
            );
            return this.http.put(
                `https://cosplay-planning-app.firebaseio.com/cosplay-groups/${cosplayGroupId}.json`,
                { ...updatedCosplayGroups[updatedCosplayGroupIndex], id: null}
            );
        })
        , tap(cosplaygroups  => {
            this._cosplaygroups.next(updatedCosplayGroups);
        }));

    }

    updateCosplayGroupMembers(
        name: string,
        cosplayerId: string,
        asistanceConfirmed: boolean,
        cosplayGroupId: string
    ){  
        /*
        let updatedCosplayGroupMembers: CharacterMember[];

        return this.cosplaygroupmembers.pipe(
            take(1),
            switchMap( cosplaygroupmembers => {
                if (!cosplaygroupmembers || cosplaygroupmembers.length <= 0) {
                return this.fetchCosplayGroupMembers();
                } else {
                return of(cosplaygroupmembers);
                }
    
            }),
            switchMap(cosplayGroupMembers => {
                const updatedCosplayGroupMembersIndex = cosplayGroupMembers.findIndex(cosGroup => cosGroup.id === cosplayGroupId);
                updatedCosplayGroupMembers = [...cosplayGroupMembers];
                const oldCosplay = updatedCosplayGroupMembers[updatedCosplayGroupMembersIndex];
    
                updatedCosplayGroupMembers[updatedCosplayGroupMembersIndex] = new CharacterMember(
                name,
                cosplayerId,
                asistanceConfirmed
                );
                return this.http.put(
                    `https://cosplay-planning-app.firebaseio.com/cosplay-groups/${cosplayGroupId}.json`,
                    { ...updatedCosplayGroupMembers[updatedCosplayGroupMembersIndex], id: null}
                );
            })
            , tap(cosplayGroupMembers  => {
                this._cosplaygroupmembers.next(updatedCosplayGroupMembers);
            }));
            */
    }

    uploadImage(image: File) {
        const uploadData = new FormData();
        uploadData.append('image', image);

        return this.http.post<{imageUrl: string, imagePath: string}>(
            'https://us-central1-cosplay-planning-app.cloudfunctions.net/storeImage',
            uploadData
        );
    }


}
