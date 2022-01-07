export class User {
    UserName:string;
    FullName:string;
    Email:string;
    PhoneNumber:string;
    Roles:Array<string>;
    constructor(UserName:string,FullName:string,Email:string,PhoneNumber:string,Roles:Array<string>) {
        this.FullName=FullName;
        this.UserName=UserName;
        this.Roles=Roles;
        this.Email=Email;
        this.PhoneNumber=PhoneNumber;
    }
}
