import 'package:flutter/material.dart';

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

  @override
  Widget build(BuildContext context) {
    return ConfigurationPage();
  }
}
