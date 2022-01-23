import { Component, OnInit, HostListener, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NotifyService } from "../../Services/Notify/Notify.service";
import { HubService } from "../../Services/Hub.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

//declare var $: any;


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header modal-header bg-danger">
      <h4 class="modal-title">{{title}}</h4>
      <button type="button" class="close btn-danger" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" [innerHtml]="message">
      {{message}}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
// tslint:disable-next-line:component-class-suffix
export class NgbdModalContent {
  @Input() title = "";
  @Input() message = "";

  constructor(public activeModal: NgbActiveModal) { }
}





@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit, OnDestroy {

  constructor(public router: Router, private hubService: HubService,
    private notify: NotifyService, private modalService: NgbModal) { }
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
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.hubService.status === false) {
      this.hubService.initiateSignalrConnection();
    }
    this.hubService.hubConnection.on('online', (u) => {
      if (user.userName !== u) {
        this.notify.showInfo(`User ${u} just Online`);
      }
    })
    this.hubService.hubConnection.on('offline', (u) => {
      if (user.userName !== u) {
        this.notify.showInfo(`User ${u} just offline`);
      }
    })

    this.hubService.hubConnection.on('notifyAll', (response, u, who) => {
      if (user.userName !== u) {
        if (who.length!==0) {
          if (who.indexOf(user.userName) !== -1) {
            const notify = this.modalService.open(NgbdModalContent);
            notify.componentInstance.title = response.title;
            notify.componentInstance.message = response.message;
            setTimeout(() => {
              notify.close();
            }, 10000)
          }
        }
        else {
          console.log("vao else")
          const notify = this.modalService.open(NgbdModalContent);
          notify.componentInstance.title = response.title;
          notify.componentInstance.message = response.message;
          setTimeout(() => {
            notify.close();
          }, 10000)
        }
      }

    })


    if (this.router.url === "/") {
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
