import 'package:flutter/material.dart';

class GalleryPage extends StatefulWidget {
  final ValueChanged<bool> galleryModeChanged;
  const GalleryPage({Key key, this.galleryModeChanged}) : super(key: key);
  @override
  _GalleryPageState createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage> {
  var taps = List<DateTime>();

  void _addTap() {
    var now = DateTime.now();
    taps.add(now);
    while (taps.length > 0 && taps.first.difference(now) > Duration(seconds: 3)) {
      taps.removeAt(0);
    }
    if (taps.length >= 4) {
      widget.galleryModeChanged(false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _addTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            "Loading"
          )
        ],
      )
    );
  }
}
