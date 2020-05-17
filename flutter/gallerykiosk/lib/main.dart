import 'package:flutter/material.dart';
import 'package:gallerykiosk/settings.dart';

import 'configurationpage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gallery Kiosk',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: Router(),
    );
  }
}

class Router extends StatefulWidget {
  @override
  _RouterState createState() => _RouterState();
}

class _RouterState extends State<Router> {
  bool ready = false;
  bool kioskMode = false;

  void loadPersistent() async {
    bool gotKioskMode = await getKioskMode();
    setState(() {
      kioskMode = gotKioskMode;
      ready = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!ready) {
      loadPersistent();
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text('loading'),
            ],
          ),
        ),
      );
    }
    if (kioskMode) {
      assert(false);
    } else {
      return ConfigurationPage();
    }
  }
}
