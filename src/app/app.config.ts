import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const firebaseConfig = {
  apiKey: 'AIzaSyBnafytePFPOSNgK3QcmQ_hd0SjMQm7zsE',
  authDomain: 'pickerball-wallet.firebaseapp.com',
  projectId: 'pickerball-wallet',
  storageBucket: 'pickerball-wallet.firebasestorage.app',
  messagingSenderId: '403872219165',
  appId: '1:403872219165:web:d3d77b428b0a74767546f4',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()), provideAnimationsAsync(),
  ],
};
