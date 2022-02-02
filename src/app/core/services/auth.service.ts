import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth ) {}

  login(email: string, password: string): Promise<firebase.auth.UserCredential | void>{
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => console.error(error));
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
