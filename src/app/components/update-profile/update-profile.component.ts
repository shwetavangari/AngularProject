import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Params, RouterLink, RouterOutlet } from '@angular/router';
import { AboutusComponent } from '../aboutus/aboutus.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { userdata } from '../../usermodel';
import { UserserviceService } from '../../services/userservice.service';
@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [RouterLink,HeaderComponent, AboutusComponent,FooterComponent,NgStyle,CommonModule,ReactiveFormsModule,RouterOutlet,HttpClientModule,NgIf],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent {
  constructor(private formBuilder: FormBuilder,private router: Router, private service:UserserviceService, private activeRoute:ActivatedRoute) { }
  
  usersArr:any=[]

  // form 
  registerForm:FormGroup=new FormGroup({
    fname:new FormControl(''),
    lname:new FormControl(''),
    email:new FormControl(''),
    age:new FormControl(20),
    phone:new FormControl(''),
    state:new FormControl(''),
    country:new FormControl(''),
    addressType:new FormControl(''),
    address1:new FormControl('',),
    address2:new FormControl('',),
    task:new FormControl(''),
    checkBox:new FormControl(''),
    companyAddress1:new FormControl(''),
    companyAddress2:new FormControl(''),
    img1:new FormControl('')
  })

  // 
  dataid:any;
  public users:userdata={} as userdata;

  ngOnInit():void{
    this.activeRoute.paramMap.subscribe((param:Params)=>{
      this.dataid=param['get']('id');
      console.log("id is",this.dataid);
    })

    this.service.getUserById(this.dataid).subscribe((data:any)=>{
      this.users=data;
      console.log(this.users);
    })
  }

  // Image
  // img1:any;
  img1:string='../../../assets/profile.jpg';
  msg='';
  SelectFile(e:any){
    if(!e.target.files[0] || e.target.files[0].length==0){
      this.msg='Upload your profile!!';
      return;
    }
    var mimeType=e.target.files[0].type;

    if(mimeType.match(/image\/*/)==null){
      this.msg="Only images are supported!!"
      return;
    }
    if(e.target.files){
      var reader=new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.msg=""
        this.img1=event.target.result;
      }
    }
  }

  // Address
  onAddressTypeChanges() {
    const addressTypeControl = this.registerForm.get('addressType');
  
    if (addressTypeControl) {
      addressTypeControl.valueChanges.subscribe(value => {
        const address1Control = this.registerForm.get('address1');
        const address2Control = this.registerForm.get('address2');
        const companyAddress1Control = this.registerForm.get('companyAddress1');
        const companyAddress2Control = this.registerForm.get('companyAddress2');
  
        if (value === 'Home') {
          address1Control?.setValidators(Validators.required);
          address2Control?.setValidators(Validators.required);
          companyAddress1Control?.clearValidators();
          companyAddress2Control?.clearValidators();
        } else if (value === 'Company') {
          address1Control?.clearValidators();
          address2Control?.clearValidators();
          companyAddress1Control?.setValidators(Validators.required);
          companyAddress2Control?.setValidators(Validators.required);
        }
  
        address1Control?.updateValueAndValidity();
        address2Control?.updateValueAndValidity();
        companyAddress1Control?.updateValueAndValidity();
        companyAddress2Control?.updateValueAndValidity();
      });
    }
  }
    
// Hobbies
    list: { id: number, name: string }[] = [];
    addTask(task: string) {
        if (task.trim()) {
            const newItem = { id: this.list.length + 1, name: task };
            this.list.push(newItem);
        }
    }
    removeTask(id: number) {
        this.list = this.list.filter(item => item.id !== id);
    }

// form update 
  update(){
    this.service.updateUserDetails(this.users,this.dataid).subscribe((data:any)=>{
      this.router.navigate(['/user-profile']);
    })
  }
}
