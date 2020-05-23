import 'dart:async';

import 'package:flutter/material.dart';
import 'package:gallerykiosk/apiclient.dart';
import 'package:receive_sharing_intent/receive_sharing_intent.dart';
import 'package:path/path.dart';

import 'configurationpage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

void uploadSharedMediaFile(SharedMediaFile sharedMediaFile) async {
  var apiClient = await APIClient.build();
  var presignedPost = await apiClient.presignedPost(basename(sharedMediaFile.path));
  print("GOT PRESIGNED POST: " + presignedPost.url);
}

void uploadSharedMediaFiles(List<SharedMediaFile> sharedMediaFiles) {
  for (var mediaFile in sharedMediaFiles) {
    uploadSharedMediaFile(mediaFile);
  }
}

class _MyAppState extends State<MyApp> {
  StreamSubscription _intentDataStreamSubscription;
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

  @override
  void initState() {
    super.initState();

    // For sharing images coming from outside the app while the app is in the memory
    _intentDataStreamSubscription =
      ReceiveSharingIntent.getMediaStream().listen((List<SharedMediaFile> value) {
        print("Shared:" + (value.map((f)=> f.path)?.join(",") ?? ""));
        uploadSharedMediaFiles(value);
      }, onError: (err) {
        print("getIntentDataStream error: $err");
      });

    ReceiveSharingIntent.getInitialMedia().then((List<SharedMediaFile> value) {
      print("Shared:" + (value.map((f)=> f.path)?.join(",") ?? ""));
      uploadSharedMediaFiles(value);
    });
  }

  @override
  void dispose() {
    _intentDataStreamSubscription.cancel();
    super.dispose();
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
