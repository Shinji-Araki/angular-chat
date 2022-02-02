import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/class/user';

@Component({
  selector: 'ac-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  usersRef: AngularFireList<User>;
  users$: Observable<User[]>;

  constructor(private db: AngularFireDatabase) {
    this.usersRef = db.list('/users');
   }

  ngOnInit(): void {
    this.users$ = this.usersRef.snapshotChanges().pipe(
      map((snapshots: SnapshotAction<User>[]) => {
        return snapshots.map(snapshot => {
          const values = snapshot.payload.val();
          return new User(values);
        });
      })
    );
  }

}
