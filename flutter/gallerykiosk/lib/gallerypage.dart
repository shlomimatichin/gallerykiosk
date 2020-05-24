import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:gallerykiosk/apiclient.dart';
import 'package:gallerykiosk/manifest.dart';
import 'package:carousel_pro/carousel_pro.dart';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;

class GalleryPage extends StatefulWidget {
  final ValueChanged<bool> galleryModeChanged;
  const GalleryPage({Key key, this.galleryModeChanged}) : super(key: key);
  @override
  _GalleryPageState createState() => _GalleryPageState();
}

class MediaItem {
  String url;
  String key;
  File localFile;
  MediaItem(this.url, this.key);
}

class _GalleryPageState extends State<GalleryPage> {
  var _taps = List<DateTime>();
  String _lastManifestURL = "";
  Manifest _manifest;
  List<MediaItem> _mediaItems;

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
      _mediaItems = [];
      manifest.mediaFiles.forEach((mediaFile) {
        var mediaItem = MediaItem(mediaFile.url, mediaFile.key);
        _mediaItems.add(mediaItem);
        _fetchMediaItem(mediaItem);
      });
      //TODO: delete non used files from disk
      _lastManifestURL = manifestUrl;
    });
  }

  void _fetchMediaItem(MediaItem mediaItem) async {
    final directory = await getApplicationDocumentsDirectory();
    final noslash = mediaItem.key.replaceAll("/", "_");
    final localFile = File('${directory.path}/$noslash');
    if (await localFile.exists()) {
      setState((){
        mediaItem.localFile = localFile;
      });
    } else {
      var response = await http.get(mediaItem.url);
      print("Downloaded ${mediaItem.key} ${response.statusCode}");
      if (response.statusCode != 200) {
        throw Exception('Get image ${mediaItem.key} failed: ${response.statusCode}');
      }
      await localFile.writeAsBytes(response.bodyBytes);
      setState((){
        mediaItem.localFile = localFile;
      });
    }
  }

  @override
  void initState() {
    super.initState();

    _fetchManifest();
    //TODO: poll manifest periodically
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
    _mediaItems.forEach((item) {
      if (item.localFile == null) {
        images.add(ExactAssetImage('assets/loading.gif'));
      } else {
        images.add(FileImage(item.localFile));
      }
    });

    return GestureDetector(
      onTap: _addTap,
      child: Scaffold(
        body: Carousel(
          boxFit: BoxFit.contain,
          images: images,
        ),
      ),
    );
  }
}
