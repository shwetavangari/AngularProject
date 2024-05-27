import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { userdata } from '../usermodel';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
  private userData: any;
  img1: any;

  constructor(private http:HttpClient) { }

  // set user details
  setUserDetails(data:any):Observable<any>{
    return this.http.post("http://localhost:3000/users/",data);
  }

  // get users details
  getUserDetails() {
    return this.http.get<userdata>("http://localhost:3000/users/");
  }

  // Upload image
  uploadImage(imageData: any): Observable<any> { 
    return this.http.post('http://localhost:3000/images', { image: this.img1 });
  }

  // Update User Profile
  updateUserDetails(users:userdata, id:number){
    return this.http.put<userdata>("http://localhost:3000/users/"+id,users)
  }

  // 
  getUserById(id:string){
    return this.http.get<userdata>("http://localhost:3000/users/"+id)
  }


  // Hobbies
  private apiUrl = 'http://localhost:3000/hobbies';

  getHobbies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addHobbies(task: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name: task });
  }

  removeHobbies(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}
