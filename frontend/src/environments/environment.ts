// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,

    apiUrl: "http://127.0.0.1:5000/api", //staging
    // apiUrl: "http://13.201.227.174:8080/allanaFactory/",  //live
    // apiUrl: "http://127.0.0.1:5000/api",
    // apiUrl: "http://13.201.227.174:8000/api",

    firebase: {
        apiKey: "AIzaSyBNPgp9PUyY6RdpnliGS5skirgeFEefi_8",
        authDomain: "master-35eaa.firebaseapp.com",
        projectId: "master-35eaa",
        storageBucket: "master-35eaa.appspot.com",
        messagingSenderId: "1033278095600",
        appId: "1:1033278095600:web:5a43df193a5b8acab18235",
        measurementId: "G-SC23N3MB4Q",
        vapidKey:
            "BCkWkbsaD-nnwpR185Sak1qI9f3kvbBsrfV8xVVGp2JTC4hWaObdd3-rbquzwQDmgrUbkMLHcK2kotThDOudbm0",
    },
};
