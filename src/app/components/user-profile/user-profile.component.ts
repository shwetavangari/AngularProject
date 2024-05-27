import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { userdata } from '../../usermodel';
import { UserserviceService } from '../../services/userservice.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule,RouterLink,RouterOutlet],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user: any;
  imageSrc: any;
  img1:any;
  lastRecord:any;
 
  constructor( private service:UserserviceService, private http:HttpClient) {}

  ngOnInit():void {
    this.service.getUserDetails().subscribe(data=>{
      if(Array.isArray(data) && data.length > 0){
        this.user=data[data.length -1];
      }
    });
  }

  getUserDetails(){
    this.service.getUserDetails().subscribe(res=>{
      this.user=res;
      console.log(res);
    })
  }

  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.img1 = e.target.result;  // Assuming base64 string for simplicity
        this.service.setUserDetails(this.user);  // Update the user data in the service
      };
      reader.readAsDataURL(file);
    }
  }
}
