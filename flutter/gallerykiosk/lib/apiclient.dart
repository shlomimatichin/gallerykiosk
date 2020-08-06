import 'dart:async';
import 'dart:convert';
import 'package:gallerykiosk/settings.dart';
import 'package:path/path.dart';
import 'package:http/http.dart' as http;

class PresignedPost {
  final String url;
  final Map<String, dynamic> fields;
  PresignedPost(this.url, this.fields);
}

const String DEFAULT_SERVICE_ENDPOINT = "https://43fn5f4bw7.execute-api.eu-central-1.amazonaws.com/dev";

class APIClient {
  String _serviceEndpoint;
  String _apiKey;

  APIClient(this._serviceEndpoint, this._apiKey);

  static Future<APIClient> build() async {
    return new APIClient(
      (await getServiceEndpoint()) ?? DEFAULT_SERVICE_ENDPOINT,
      await getApiKey());
  }

  Future<Map> _httpGet(String relativePath) async {
    assert(_serviceEndpoint.isNotEmpty);
    var url = _serviceEndpoint + relativePath;
    var response = await http.get(url, headers: {'X-Api-Key': _apiKey});
    if (response.statusCode != 200) {
      throw Exception('Get $relativePath failed: ${response.statusCode}');
    }
    return json.decode(response.body);
  }

  Future<Map> _httpPost(String relativePath, Map data) async {
    assert(_serviceEndpoint.isNotEmpty);
    var url = _serviceEndpoint + relativePath;
    var response = await http.post(
      url,
      body: jsonEncode(data),
      headers: {'X-Api-Key': _apiKey, 'Content-Type': 'application/json'});
    if (response.statusCode != 200) {
      throw Exception('Post $relativePath failed: ${response.statusCode}');
    }
    return json.decode(response.body);
  }

  Future<String> getManifestUrl() async {
    var response = await _httpGet('/api/v1/manifestUrl');
    return response['url'];
  }

  Future<Map> getManifest(String url) async {
    var response = await http.get(url);
    if (response.statusCode != 200) {
      throw Exception('Get manifest failed: ${response.statusCode}, $url');
    }
    return json.decode(response.body);
  }

  Future<PresignedPost> presignedPost(String path) async {
    var pathBasename = basename(path);
    var presignedPost = await _httpPost('/api/v1/requestFileUpload', {'filename': pathBasename});
    var url = presignedPost['presignedPost']['url'];
    Map<String, dynamic> fields = presignedPost['presignedPost']['fields'];
    return new PresignedPost(url, fields);
  }
}
