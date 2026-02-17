import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { CommonModule } from '@angular/common';
 

@Component({
  selector: 'app-demo',
  standalone:true ,
  imports: [WebcamModule , CommonModule],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  permissionStatus : string = '' ;
  camData : any = null ;
  capturedImage : any = '';
  trigger : Subject<void> = new Subject();


  get $trigger() : Observable<void>{
    return this.trigger.asObservable();
  }


  checkPermission(){
    navigator.mediaDevices.getUserMedia({video : {width : 500 , height : 500}}).then((response)=>{
      this.permissionStatus ='Allowed';
      this.camData = response ;
      console.log(this.camData);
    }).catch(err =>{
      this.permissionStatus = 'Not Allowed';
      console.log(this.permissionStatus);
    })
  }


  capture(event : WebcamImage){
    console.log("event " , event);
    this.capturedImage = event.imageAsDataUrl ;

  }

  captureImage(){
    this.trigger.next();
  }
}
