import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Notification } from './webapp.service';
import { Websocket } from './websocket.service';
import { Config } from './config';

const SUBSCRIBE: string = "fenecon_monitor_v1";

class Summary {
  public ess = {
    things: {},
    soc: null
  };
  public meter = {
    things: {}
  };
}

export class Device {

  public event = new Subject<Notification>();
  public address: string;
  public data = new BehaviorSubject<{ [thing: string]: any }>(null);
  public config = new BehaviorSubject<Config>(null);
  private online = false;
  private influxdb: {
    ip: string,
    username: string,
    password: string,
    fems: string
  }

  private summary: Summary = new Summary();

  constructor(
    public name: string,
    public websocket: Websocket
  ) {
    if (this.name == 'fems') {
      this.address = this.websocket.name;
    } else {
      this.address = this.websocket.name + ": " + this.name;
    }
  }

  public send(value: any) {
    this.websocket.send(this, value);
  }

  /**
   * Send "subscribe" message to websocket
   */
  public subscribe() {
    let isInArray = (array: any, value: any): boolean => {
      return array.indexOf(value) > -1;
    }
    let subscribe = {}
    let natures = this.config.getValue()._meta.natures;
    let ignoreNatures = {};
    this.summary = new Summary();
    for (let thing in natures) {
      let a = natures[thing];
      let channels = []

      /*
       * Find important Channels to subscribe
       */
      // Ess
      if (isInArray(a, "EssNature")) {
        channels.push("Soc");
        this.summary.ess.things[thing] = true;
      }
      if (isInArray(a, "AsymmetricEssNature")) {
        channels.push("ActivePowerL1", "ActivePowerL2", "ActivePowerL3", "ReactivePowerL1", "ReactivePowerL2", "ReactivePowerL3");
      }
      if (isInArray(a, "SymmetricEssNature")) {
        channels.push("ActivePower", "ReactivePower");
      }
      if (isInArray(a, "FeneconCommercialEss")) { // workaround to ignore asymmetric meter for commercial
        ignoreNatures["AsymmetricMeterNature"] = true;
      }

      // Meter
      if (isInArray(a, "MeterNature")) {
        this.summary.meter.things[thing] = true;
      }
      if (isInArray(a, "AsymmetricMeterNature") && !ignoreNatures["AsymmetricMeterNature"]) {
        channels.push("ActivePowerL1", "ActivePowerL2", "ActivePowerL3", "ReactivePowerL1", "ReactivePowerL2", "ReactivePowerL3");
      }
      if (isInArray(a, "SymmetricMeterNature")) {
        channels.push("ActivePower", "ReactivePower");
      }

      subscribe[thing] = channels;
    }

    this.send({
      subscribe: subscribe
    });
  }

  /**
   * Send "unsubscribe" message to websocket
   */
  public unsubscribe() {
    this.send({
      subscribe: ""
    });
  }

  /**
   * Receive new data from websocket
   */
  public receive(message: any) {

    if ("metadata" in message) {
      let metadata = message.metadata;
      /*
       * config
       */
      if ("config" in metadata) {
        let config = metadata.config;
        // parse influxdb connection
        if ("persistence" in config) {
          for (let persistence of config.persistence) {
            if (persistence.class == "io.openems.impl.persistence.influxdb.InfluxdbPersistence" &&
              "ip" in persistence && "username" in persistence && "password" in persistence && "fems" in persistence) {
              let ip = persistence["ip"];
              if (ip == "127.0.0.1" || ip == "localhost") { // rewrite localhost to remote ip
                ip = location.hostname;
              }
              this.influxdb = {
                ip: ip,
                username: persistence["username"],
                password: persistence["password"],
                fems: persistence["fems"]
              }
            }
          }
        }
        // store all config
        this.config.next(config);
      }

      if ("online" in metadata) {
        this.online = metadata.online;
      } else {
        this.online = true;
      }
    }

    /*
     * data
     */
    if ("currentdata" in message) {
      let data = message.currentdata;
      console.log("currentdata", data);

      // Calculate summarized data
      let soc = 0;
      for (let thing in this.summary.ess.things) {
        if (thing in data) {
          let ess = data[thing];
          soc += ess["Soc"];
        }
      }
      this.summary.ess.soc = soc / Object.keys(this.summary.ess.things).length;

      this.data.next(data);
    }
  }
}