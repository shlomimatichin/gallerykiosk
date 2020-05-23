class MediaFile {
  String url;
  String key;
  DateTime dateAdded;

  static MediaFile fromJSON(Map value) {
    var result = new MediaFile();
    result.url = value['url'];
    result.key = value['key'];
    result.dateAdded = DateTime.parse(value['dateAdded']);
    return result;
  }
}

class CurationSettings {
  int maxFiles;
  int maxDays;

  static CurationSettings fromJSON(Map value) {
    var result = new CurationSettings();
    result.maxFiles = value['maxFiles'];
    result.maxDays = value['maxDays'];
    return result;
  }
}

class Manifest {
  CurationSettings curationSettings;
  List<MediaFile> mediaFiles;

  static Manifest fromJSON(Map value) {
    var result = new Manifest();
    result.curationSettings = CurationSettings.fromJSON(value['curationSettings']);
    result.mediaFiles = [];
    List<dynamic> mediaFiles = value['mediaFiles'];
    mediaFiles.forEach((mediaFile) {result.mediaFiles.add(MediaFile.fromJSON(mediaFile));});
    return result;
  }
}
