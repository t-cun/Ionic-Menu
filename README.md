# Ionic-Menu
This project was created as part of an AngularJS [course](https://www.coursera.org/learn/hybrid-mobile-development) with Ionic
provided through Coursera. This project is a follow-up to a previous [course](https://www.coursera.org/learn/angular-js) (Repository
available [here](https://github.com/tcunningham07/AngularJS-Menu)).
This repository contains code progress over the course of the material provided via video lectures and coding assignments.
Additonally, the project has been remasked as well as additional features added, including firebase integration. Other tools that have
used as part of the project include bower and npm. The app is currently downloadable on the Google Play store as [Spice Shack](https://play.google.com/store/apps/details?id=com.ionicframework.spiceshackionic256949).

<img height="100" align="left" src="http://ionicframework.com/img/ionic-logo-blog.png">

<img height="100" align="left" src="https://s3.amazonaws.com/media-p.slid.es/uploads/hugojosefson/images/86267/angularjs-logo.png">

<img height="100" align="left" src="https://lh4.ggpht.com/Jb4QYgFBbFH7hfyOIzdRFF90Uyyx20W2-TB5lJEkdC9gyc0MQNTuC8n_HEGpCfaUgfw=w300">

<img height="100" align="left" src="https://d1qb2nb5cznatu.cloudfront.net/startups/i/13274-1e708e28fa58694493de9b2f3bf08a11-medium_jpg.jpg?buster=1334550800">

<br/><br/><br/><br/>

My intention is use this project as a resource for current and future students of the course and as an example project for anyone learning
AngularJS and Ionic. As with the previous project, please feel free to send e-mail me with any questions or comments. If you believe there is an issue with the project, please feel free to open an issue in the repo.

## Usage

### Clone the repository

Clone the repository on your machine
```
git clone https://github.com/tcunningham07/Ionic-Menu.git
```

Install the required tools: `cordova`, `ionic`:
```
npm install -g cordova ionic
```

Additionally, if you did not install `gulp` and `bower` from the previous course or have not installed them before:
```
npm install -g gulp bower
```

Install npm and bower dependencies:
```
npm install && bower install
```

Before serving the app, please download the following chrome extension:
[Cordova Mocks](https://chrome.google.com/webstore/detail/cordova-mocks/iigcccneenmnplhhfhaeahiofeeeifpn)
This extension will allow you to preview the app using chrome, with mock values for some device-only cordova plugins (camera, geolocation, and others).

Once the dependencies have installed, preview the project:
```
ionic serve
```

### Running on android:

To add the appropriate files to get up and running with the android platform on an ionic project, execute the following command:
```
ionic platform add android
```

Once this command is completed, all necessary application files for running on your android device should be created and ready to use. This can be verified by running:
```
ionic build android
```

Now, in order to run the app locally on your device via the Ionic CLI, please make sure your device is visible via adb (android debug bridge):
```
adb devices
```

If your device does not appear, please make sure that your device has USB debugging enabled (quick google search will help with this). Additionally, adb must also be installed on your machine.
Once you have successfully installed adb and can see your device alias upon executing `adb devices`, exectue the following command to run the app on your device:
```
ionic run android
```
The app should download and run on your device shortly!

Note: If you run into any issues when working with adb, please feel free to download the app via the [Google Play Store](https://play.google.com/store/apps/details?id=com.ionicframework.spiceshackionic256949).

### Running on iOS:

Unfortunately, I do not personally own any iOS devices so I have not been able to work with getting the app going with iOS. Feel free to try this yourself, however!
The same command used for android applies for iOS:
```
ionic platform add iOS
```

## Thanks
Coursera

## License
MIT
