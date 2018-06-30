import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController} from 'ionic-angular';
import leaflet from 'leaflet';
import { Slides } from 'ionic-angular';
import { FooterPage} from "../footer/footer";
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { timer } from 'rxjs/observable/timer'; // (for rxjs < 6) use 'rxjs/observable/timer'
import { take, map } from 'rxjs/operators';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {

  // FooterPage : FooterPage;
  @ViewChild('phone') phonenumber;
  @ViewChild('confirmationCode') confirmationCode;
  @ViewChild('password') password;
  @ViewChild('password1') password1;

  @ViewChild('firstname') firstname;
  @ViewChild('lastname') lastname;

  @ViewChild('map') mapContainer: ElementRef;
  @ViewChild(Slides) slides: Slides;
  firbaseuid:any;
  map: any;
  timeo:any;
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  conresult:any=null;
  countDown;
  countms:any=120000;
  count=120;
  private todo : FormGroup;
  private todo1 : FormGroup;



  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, private fire:AngularFireAuth, public geolocation : Geolocation,
              private formBuilder: FormBuilder ) {
    this.todo = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName:['', Validators.required],
      // lastName: [''],
    });
    this.todo1 = this.formBuilder.group({
      phoneNumber:['', Validators.required],
      password:['', Validators.required],
      // lastName: [''],
    });
  }
  logForm(){
    console.log(this.todo.value)
  }
  logForm1(){
    console.log(this.todo1.value)
  }
  alert(message: string) {
    this.alertCtrl.create({
      title: 'Info!',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  updatePerson(firstName: string, lastName: string, password: string, id): void {
    const personRef: firebase.database.Reference = firebase.database().ref(`/users/` + id +'/');
    personRef.set({
      firstName: firstName,
      lastName: lastName,
      password: password,
    })
    personRef.remove()
    personRef.update({
      firstName,
      lastName,
      password
    })
  }

  // createPerson(firstName: string, lastName: string): void {
  //   const personRef: firebase.database.Reference = firebase.database().ref(`/person1/`);
  //   personRef.set({
  //     firstName: firstName,
  //     lastName: lastName,
  //   });
  // }

  ionViewDidLoad() {
  //   const personRef: firebase.database.Reference = firebase.database().ref(`/person1/`);
  //   personRef.on('value', personSnapshot => {
  //     this.myPerson = personSnapshot.val();
  //     console.log(personSnapshot.val());
  //   });
    this.slides.lockSwipes(false);
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  //
  }
  // this.slides.lockSwipes(true); method in ionViewWillEnter() to lock them and this.slides.lockSwipes(false);
  // in ionViewWillLeave() to unlock them
//map function
  ionViewWillLeave(){
    this.slides.lockSwipes(false);
  }
  ionViewWillEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    this.loadmap();
  }
  loadmap() {
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 10
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      // let marker: any = leaflet.marker([lat,lang]).on('click', () => {
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        alert('Marker clicked');
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
    }).on('locationerror', (err) => {
      alert(err.message);
    })

  }

  next() {
    this.slides.slideNext(500);
    // console.log("name corrroct")
  }

  prev() {
    this.slides.slidePrev(500);
  }

//verify time out function
  destructMS(milli) {
    if (isNaN(milli) || milli < 0) {
      return null;
    }

    var d, h, m, s, ms;
    s = Math.floor(milli / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    ms = Math.floor((milli % 1000) * 1000) / 1000;
    return { d: d, h: h, m: m, s: s, ms: ms };
  }

  //finish button function
  opnepage(){
    // this.countms=0;
    // console.log('cleared');
    // clearTimeout(this.timeo);
    this.navCtrl.push(FooterPage);
  }

  disableSwipe(){
    this.slides.lockSwipes(true);
  }

//Signup button go to sign up slider
  Signup() {
    this.slides.slideNext(500);
    // console.log("name corrroct")
    // console.log(this.firstname._value);
    // console.log(this.lastname._value);
    // if(this.firstname._value==='lavan' && this.lastname._value==='vicky'){
      // console.log('name set')
      // this.alert('Success! You\'name accept');
      // this.slides.slideNext(500);
    // }
    // else {
    //   this.alert('name not match');
      // console.log('name not match')
    }

//testing
  GoToVerification() {
    // console.log("helo iam from login page")
    //   console.log(this.phonenumber._value);
    //   console.log(this.password._value);
    if(this.phonenumber._value==='0775718512' && this.password._value==='1234'){
      this.slides.slideTo(4, 500);
    }else{
      console.log('username or password incorrrect');
    }
    // this.slides.slideTo(4, 500);
  }

//login function
  signInUser() {
    this.fire.auth.signInWithEmailAndPassword(this.phonenumber.value
      // + '@domian.xta'
      , this.password1.value)
      .then( data => {
        console.log('got some data', this.fire.auth.currentUser);

        this.alert('Success! You\'re logged in');
        localStorage.setItem('user', '1');
        this.navCtrl.setRoot( FooterPage );
        // user is logged in
      })
      .catch( error => {
        console.log('got an error', error);
        this.alert(error.message);
      })
    console.log('Would sign in with ', this.phonenumber.value, this.password1.value);
  }

  moveSlideFour(phonenumber,firstName, lastName, password){
    this.slides.slideTo(4, 500);
    this.signIn(phonenumber,firstName, lastName, password);
  }
  signIn(phoneNumber: number,firstName, lastName, password){
    this.countDown = timer(0,1000).pipe(
      take(this.count),
      map(()=> --this.count)
    );
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber ;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( confirmationResult => {
        // this.conresult=confirmationResult;
        console.log('***************************')
        console.log(confirmationResult)
        alert('message sent you');
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        // let prompt = this.alertCtrl.create({
        //   title: 'Enter the Confirmation code',
        //   inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
        //   buttons: [
        //     { text: 'Cancel',
        //       handler: data => { console.log('Cancel clicked'); }
        //     },
        //     { text: 'Send',
        //       handler: data => {
        this.timeo = setTimeout(()=>{
                confirmationResult.confirm(this.confirmationCode)
                  .then(function (result) {
                    // User signed in successfully.
                    console.log(result.user['uid']);
                      // this.firbaseuid=result.user['uid'];
                      // console.log(this.firbaseuid);
                      // this.updatePerson(firstName, lastName,result.user['uid']);
                      const personRef: firebase.database.Reference = firebase.database().ref(`/users/` + result.user['uid'] +'/');
                      personRef.set({
                        firstName: firstName,
                        lastName: lastName,
                        password: password
                      })
                      personRef.remove()
                      personRef.update({
                        firstName,
                        lastName,
                        password
                      })
                      // this.navCtrl.push(FooterPage);
                    // ...
                    // this.navCtrl.setRoot( FooterPage );
                    //   this.opnepage();
                  }
                  ).catch(function (error) {
                  console.log('got an error', error);
                });
        }, 17000)
        //       }
        //     }
        //   ]
        // });
        // prompt.present();
      })
      .catch(function (error) {
        console.error("SMS not sent", error);
      });
  if(this.conresult!=null){
    this.navCtrl.push(FooterPage);
  }
}

  registerUser() {
    this.fire.auth.createUserWithEmailAndPassword(this.firstname.value
      // + '@domian.xta'
      , this.lastname.value)
      .then(data => {
        console.log('got data ', data);
        this.alert('Registered!');
        this.navCtrl.setRoot( FooterPage );
      })
      .catch(error => {
        console.log('got an error ', error);
        this.alert(error.message);
      });
    console.log('Would register user with ', this.firstname.value, this.lastname.value);
  }
}
