import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';
import { DeviceOverviewComponent } from './device/overview/overview.component';
import { DeviceConfigOverviewComponent } from './device/config/overview/overview.component';
import { DeviceConfigBridgeComponent } from './device/config/bridge/bridge.component';
import { DeviceConfigSchedulerComponent } from './device/config/scheduler/scheduler.component';
import { DeviceConfigMoreComponent } from './device/config/more/more.component';
import { DeviceConfigControllerComponent } from './device/config/controller/controller.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'overview', component: OverviewComponent },

  { path: 'device/:websocket/:device', redirectTo: 'device/:websocket/:device/overview', pathMatch: 'full' },
  { path: 'device/:websocket/:device/overview', component: DeviceOverviewComponent },

  { path: 'device/:websocket/:device/config', redirectTo: 'device/:websocket/:device/config/overview', pathMatch: 'full' },
  { path: 'device/:websocket/:device/config/overview', component: DeviceConfigOverviewComponent },
  { path: 'device/:websocket/:device/config/bridge', component: DeviceConfigBridgeComponent },
  { path: 'device/:websocket/:device/config/scheduler', component: DeviceConfigSchedulerComponent },
  { path: 'device/:websocket/:device/config/more', component: DeviceConfigMoreComponent },
  { path: 'device/:websocket/:device/config/controller', component: DeviceConfigControllerComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);