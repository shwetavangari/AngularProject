import { Component, NgModule } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,HeaderComponent, AboutusComponent,FooterComponent,NgStyle,CommonModule,ReactiveFormsModule,RouterOutlet,HttpClientModule,NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  constructor(private formBuilder: FormBuilder,private router: Router, private service:UserserviceService) { }
  
  usersArr:any=[]

  // form 
  registerForm:FormGroup=new FormGroup({
    fname:new FormControl('',[Validators.required, this.validateFirstName]),
    lname:new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required,Validators.email]),
    age:new FormControl(20, [Validators.required, Validators.min(20), Validators.max(60)]),
    phone:new FormControl('',[Validators.required, Validators.pattern(/^\d{10}$/)]),
    state:new FormControl('',Validators.required),
    country:new FormControl('',Validators.required),
    addressType:new FormControl(''),
    address1:new FormControl('',),
    address2:new FormControl('',),
    task:new FormControl('',Validators.required),
    checkBox:new FormControl('',Validators.required),
    companyAddress1:new FormControl(''),
    companyAddress2:new FormControl(''),
    img1:new FormControl('')
  })

// Image
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

   // Clear form 
   clearForm(){
    this.registerForm.controls['fname'].setValue('');
    this.registerForm.controls['lname'].setValue('');
    this.registerForm.controls['email'].setValue('');
    this.registerForm.controls['phone'].setValue('');
    this.registerForm.controls['age'].setValue('');
    this.registerForm.controls['state'].setValue('');
    this.registerForm.controls['country'].setValue('');
    this.registerForm.controls['addressType'].setValue('');
    this.registerForm.controls['companyAddress1'].setValue('');
    this.registerForm.controls['companyAddress2'].setValue('');
    this.registerForm.controls['address1'].setValue('');
    this.registerForm.controls['address2'].setValue('');
  }

  // show and hide form
  show:boolean=false;
  showForm(){
    this.show=!this.show;
    this.clearForm();
  }

  // name validation
  validateFirstName(control: AbstractControl): { [key: string]: boolean } | null {
    // const value = control.value;
    const firstNameRegex = /^[A-Za-z]{1,20}$/;
    if (control.value && !firstNameRegex.test(control.value)) {
      return { invalidFirstName: true };
    }
    return null;
  }

  // Getter for easier access to form controls
  get f() {
    return this.registerForm.controls;
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

// form submit 
  onSubmit(data:userdata) {
    if (this.registerForm.valid) {
      this.service.setUserDetails(data).subscribe((result)=>{
        console.log(result);
        this.router.navigate(['/user-profile']);
      })
    } else {  
      alert('Please fill all fields...');
    }
  }
}
