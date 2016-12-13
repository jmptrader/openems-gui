import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalstorageService } from './localstorage.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

const SUBSCRIBE: string = "fenecon_monitor_v1";

export class Connection {
  public isConnected: boolean = false;
  public username: string;
  public natures: Object;
  public websocket: WebSocket;
  public subject: BehaviorSubject<any>;
  public event: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    public name: string,
    public url: string,
    private localstorageService: LocalstorageService
  ) {
    // make sure to subscribe to openems natures on init; 
    // TODO: on first init it happens twice
    //this.subscribeNatures();

    /*    this.subject.subscribe((message: any) => {
          this.subscribeNatures();
          if ("data" in message) {
            var msg: any = JSON.parse(message.data);
            // Natures
            if ("natures" in msg) {
              console.log("got natures: " + this.natures);
              this.natures = msg.natures;
            }
          }
        });*/
  }

  public connectWithPassword(password: string) {
    this.connect(password, null);
  }

  /**
   * Tries to connect using given password or token.
   */
  private connect(password: string, token: string) {
    // return non-active Connection if no password or token was given
    if (password == null && token == null) {
      this.close();
      return;
    }

    // Error description is here:
    var error = null;

    // send "not successful event" if not connected within timeout
    var timeout = setTimeout(() => {
      if (!this.isConnected) {
        error = "Keine Verbindung: Timeout"
        this.event.next(error);
      }
    }, 2000);

    // create a new connection
    var ws = new WebSocket(this.url);

    // define observable
    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);

      ws.close.bind(ws);
    }).share();

    // define observer
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };

    // Authenticate when websocket is opened
    ws.onopen = () => {
      if (password) {
        observer.next({
          authenticate: { password: password }
        });
      } else if (token) {
        observer.next({
          authenticate: { token: token }
        });
      }
    };

    // create subject
    var sj: BehaviorSubject<any> = BehaviorSubject.create(observer, observable);

    sj.subscribe((message: any) => {
      if ("data" in message) {
        let data = JSON.parse(message.data);

        // Receive authentication token
        if ("authenticate" in data) {
          if ("token" in data.authenticate) {
            this.localstorageService.setToken(this.name, data.authenticate.token);
            if ("username" in data.authenticate) {
              this.username = data.authenticate.username;
              this.websocket = ws;
              this.subject = sj;
              this.isConnected = true;
              error = null; 
              this.event.next("Angemeldet als " + this.username + ".");
            }
          } else {
            // close websocket
            this.localstorageService.removeToken(this.name);
            this.close();
            clearTimeout(timeout);
            error = "Keine Verbindung: Authentifizierung fehlgeschlagen.";
            this.event.next(error);
          }
        }
      }
    }, (error: any) => {
      this.close();
      clearTimeout(timeout);
      error = "Verbindungsfehler."
      this.event.next(error);
    }, (/* complete */) => {
      this.close();
      clearTimeout(timeout);
      if(error == null) {
        this.event.next("Verbindung beendet.");
      }
    });
  }

  public send(value: any): void {
    this.subject.next(value);
  }

  /**
   * Closes the connection.
   */
  public close() {
    if (this.websocket != null && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.close();
    }
    this.websocket = null;
    this.isConnected = false;
    this.username = null;
  }


  /**
   * Send "subscribe" message to server 
   */
  private subscribeNatures() {
    /*if (this.natures == null) {
      this.send({
        subscribe: SUBSCRIBE
      });
    }*/
  }

  /**
   * send "unsubscribe" message to server
   */
  private unsubscribeNatures() {
    this.send({
      subscribe: ""
    });
  }
}