import 'package:flutter/material.dart';
import 'package:gallerykiosk/apiclient.dart';
import 'package:gallerykiosk/manifest.dart';
import 'package:carousel_pro/carousel_pro.dart';

class GalleryPage extends StatefulWidget {
  final ValueChanged<bool> galleryModeChanged;
  const GalleryPage({Key key, this.galleryModeChanged}) : super(key: key);
  @override
  _GalleryPageState createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage> {
  var _taps = List<DateTime>();
  String _lastManifestURL = "";
  Manifest _manifest;

  void _addTap() {
    var now = DateTime.now();
    _taps.add(now);
    while (_taps.length > 0 && _taps.first.difference(now) > Duration(seconds: 3)) {
      _taps.removeAt(0);
    }
    if (_taps.length >= 4) {
      widget.galleryModeChanged(false);
    }
  }

  void _fetchManifest() async {
    var apiClient = await APIClient.build();
    var manifestUrl = await apiClient.getManifestUrl();
    if (manifestUrl == _lastManifestURL) {
      return;
    }
    print('Got new manifest url $manifestUrl');
    var manifestJSON = await apiClient.getManifest(manifestUrl);
    var manifest = Manifest.fromJSON(manifestJSON);
    print('Got new manifest with ${manifest.mediaFiles.length} media files');
    setState(() {
      _manifest = manifest;
      _lastManifestURL = manifestUrl;
    });
  }

  @override
  void initState() {
    super.initState();

    _fetchManifest();
  }

  @override
  Widget build(BuildContext context) {
    if (_manifest == null) {
      return GestureDetector(
        onTap: _addTap,
        child: Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text('Loading...'),
              ],
            ),
          ),
        ),
      );
    }

    List<ImageProvider> images = [];
    _manifest.mediaFiles.forEach((mediaFile) { images.add(ExactAssetImage('assets/loading.gif')); });

    return GestureDetector(
      onTap: _addTap,
      child: Scaffold(
        body: Carousel(
          images: images,
        ),
      ),
    );
  }
}
