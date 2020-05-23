import 'package:flutter/material.dart';

import 'configurationpage.dart';
import 'gallerypage.dart';
import 'settings.dart';

class Router extends StatefulWidget {
  @override
  _RouterState createState() => _RouterState();
}

class _RouterState extends State<Router> {
  bool ready = false;
  bool galleryMode = false;

  void loadPersistent() async {
    bool gotGalleryMode = await getGalleryMode();
    setState(() {
      galleryMode = gotGalleryMode;
      ready = true;
    });
  }

  _galleryModeChanged(bool value) {
    setState(() {
      setGalleryMode(value);
      galleryMode = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!ready) {
      loadPersistent();
      return Center();
    }

    if (galleryMode) {
      return GalleryPage(galleryModeChanged: _galleryModeChanged);
    } else {
      return ConfigurationPage(galleryModeChanged: _galleryModeChanged);
    }
  }
}
