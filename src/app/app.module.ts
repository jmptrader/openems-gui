import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdSnackBar } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import 'hammerjs';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { environment } from '../environments';

/*
 * Frontend
 */
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';
import { DeviceOverviewComponent } from './device/overview/overview.component';
import { DeviceOverviewEnergymonitorComponent } from './device/overview/energymonitor/energymonitor.component';
import { DeviceOverviewEnergymonitorChartComponent } from './device/overview/energymonitor/chart/chart.component';
import { DeviceOverviewEnergymonitorTableComponent } from './device/overview/energymonitor/table/table.component';
import { DeviceConfigOverviewComponent } from './device/config/overview/overview.component';
import { DeviceConfigBridgeComponent } from './device/config/bridge/bridge.component';
import { FormBridgeSimulatorComponent } from './device/config/bridge/bridge/simulator/simulator.component';
import { FormBridgeSystemComponent } from './device/config/bridge/bridge/system/system.component';
import { FormDeviceSimulatorComponent } from './device/config/bridge/device/simulator/simulator.component';
import { FormDeviceSystemComponent } from './device/config/bridge/device/system/system.component';
import { DeviceConfigSchedulerComponent } from './device/config/scheduler/scheduler.component';
import { DeviceConfigMoreComponent } from './device/config/more/more.component';
import { FormSchedulerWeekTimeComponent } from './device/config/scheduler/weektime/weektime.component';
import { DeviceConfigControllerComponent } from './device/config/controller/controller.component';
import { DeviceConfigCtrlWebsocketApiComponent } from './device/config/controller/websocketapi/websocketapi.component';
//import { ConfigComponent } from './config/config.component';

/*
import { MonitorGrafanaComponent } from './monitor/grafana/grafana.component';
import { MonitorUniversalCurrentComponent } from './monitor/universal/current/universal-current.component';
import { MonitorDetailComponent } from './monitor/detail/detail.component';
import { ConfigurationComponent } from './monitor/configuration/configuration.component';
*/

/*
 * Common components
 */
// Forms
import { FormControllersComponent } from './common/form/controller/controllers.component';
import { FormControllerWebsocketApiComponent } from './common/form/controller/websocketapi/websocketapi.component';
import { FormControllerRestApiComponent } from './common/form/controller/restapi/restapi.component';
import { FormControllerUniversalComponent } from './common/form/controller/universal/universal.component';
import { FormControllerNewComponent } from './common/form/controller/new/new.component';
import { FormSchedulerComponent } from './common/form/scheduler/scheduler.component';
import { FormSchedulerWeekTimeHoursComponent } from './common/form/scheduler/weektime/hours.component';

/*
 * Services
 */
import { WebappService } from './service/webapp.service';
import { WebsocketService } from './service/websocket.service';

/*
 * Pipe
 */
import { KeysPipe } from './common/pipe/keys/keys.pipe';
import { ClassnamePipe } from './common/pipe/classname/classname.pipe';

@NgModule({
  declarations: [
    AppComponent,
    // Login
    LoginComponent,
    // Overview
    OverviewComponent,
    // Device
    DeviceOverviewComponent,
    DeviceOverviewEnergymonitorComponent,
    DeviceOverviewEnergymonitorChartComponent,
    DeviceOverviewEnergymonitorTableComponent,
    DeviceConfigOverviewComponent,
    DeviceConfigBridgeComponent,
    DeviceConfigSchedulerComponent,
    DeviceConfigControllerComponent,
    DeviceConfigCtrlWebsocketApiComponent,
    // Form
    FormBridgeSimulatorComponent,
    FormBridgeSystemComponent,
    DeviceConfigMoreComponent,
    FormDeviceSimulatorComponent,
    FormDeviceSystemComponent,
    FormSchedulerWeekTimeComponent,
    //   Form
    FormControllersComponent,
    FormControllerWebsocketApiComponent,
    FormControllerRestApiComponent,
    FormControllerUniversalComponent,
    FormControllerNewComponent,
    FormSchedulerComponent,
    FormSchedulerWeekTimeHoursComponent,
    // pipe
    KeysPipe,
    ClassnamePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxChartsModule,
    routing,
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    MdSnackBar,
    WebappService,
    WebsocketService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
