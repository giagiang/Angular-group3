import { Component, OnInit, HostListener, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NotifyService } from "../../Services/Notify/Notify.service";
import { HubService } from "../../Services/Hub.service";
import { UserService } from "../../Services/User/User.service";

//declare var $: any;

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit,OnDestroy {

  constructor(public router: Router, private hubService: HubService,
    private userService: UserService,private notify:NotifyService) { }
  public isCollapsed = false;
  public innerWidth: number = 0;
  public defaultSidebar: string = "";
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = "full";
  Logo() {
    this.expandLogo = !this.expandLogo;
  }
  ngOnDestroy(): void {
     this.hubService.stopHubConnection();
  }

  ngOnInit() {
    console.log(this.hubService.status)
    const user=JSON.parse(sessionStorage.getItem('user')|| '{}');
    if(this.hubService.status===false){
      this.hubService.initiateSignalrConnection();
    }
    this.hubService.hubConnection.on('online',(u)=>{
      if(user.userName!==u){
        this.notify.showInfo(`User ${u} just Online`);
      }
    })
    this.hubService.hubConnection.on('offline',(u)=>{
      if(user.userName!==u){
        this.notify.showInfo(`User ${u} just offline`);
      }
    })
    if(this.router.url === "/") {
      this.router.navigate(["/dashboard"]);
    }
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = "full";
    } else {
      this.sidebartype = this.defaultSidebar;
    }
  }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case "full":
        this.sidebartype = "mini-sidebar";
        break;

      case "mini-sidebar":
        this.sidebartype = "full";
        break;

      default:
    }
  }
}
