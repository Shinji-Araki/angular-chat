import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/compat/database';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Comment } from '../class/comment';
import { User } from '../class/user';

@Component({
  selector: 'ac-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  comment$:Observable<Comment[]>;
  commentRef: AngularFireList<Comment>;
  currentUser$: Observable<User>
  currentUser: User;
  comment = "";

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
    ) {
    this.commentRef = db.list('/comments');
  }

  ngOnInit(): void {
    this.currentUser$ = this.afAuth.authState.pipe(
      map((user: firebase.User | null) => {
      if(user){
        this.currentUser = new User(user);
        return this.currentUser;
      }
      return null;
    })
    );

    this.comment$ = this.commentRef.snapshotChanges()
    .pipe(
      map((snapshots: SnapshotAction<Comment>[]) => {
        return snapshots.map(snapshot => {
          const value = snapshot.payload.val();
          return new Comment({ key: snapshot.payload.key, ...value });
        });
      })
    )
  }

  addComment(comment: string): void {
    if(comment){
      this.commentRef.push(new Comment({ user: this.currentUser, message: comment}));
      this.comment = '';
    }
  }

  updateComment(comment: Comment): void {
    const { key, message } = comment;

    this.commentRef.update(key, { message });
  }

  deleteComment(comment: Comment): void {
    this.commentRef.remove(comment.key);
  }

}
