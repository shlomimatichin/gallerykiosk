
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart';
import 'package:http/http.dart' as http;

String serviceEndpoint = '';
String apiKey;
HttpClient client = HttpClient();

Future readStackOutputs() async {
  var stackOutputs = await(File('../../stackoutputs.json')
    .readAsString()
    .then((fileContents) => json.decode(fileContents)));
  apiKey = stackOutputs['testapikey'];
  serviceEndpoint = stackOutputs['ServiceEndpoint'];
}

Future<Map> apiClientGet(String relativePath) async {
  assert(serviceEndpoint.isNotEmpty);
  var url = serviceEndpoint + relativePath;
  var response = await http.get(url, headers: {'X-Api-Key': apiKey});
  if (response.statusCode != 200) {
    throw Exception('Get ${relativePath} failed: ${response.statusCode}');
  }
  return json.decode(response.body);
}

Future<Map> apiClientPost(String relativePath, Map data) async {
  assert(serviceEndpoint.isNotEmpty);
  var url = serviceEndpoint + relativePath;
  var response = await http.post(
    url,
    body: jsonEncode(data),
    headers: {'X-Api-Key': apiKey, 'Content-Type': 'application/json'});
  if (response.statusCode != 200) {
    throw Exception('Post ${relativePath} failed: ${response.statusCode}');
  }
  return json.decode(response.body);
}


Future<String> getManifestUrl() async {
  var response = await apiClientGet('/api/v1/manifestUrl');
  return response['url'];
}

Future<Map> getManifest() async {
  var url = await getManifestUrl();
  var response = await http.get(url);
  if (response.statusCode != 200) {
    throw Exception('Get manifest failed: ${response.statusCode}, ${url}');
  }
  return json.decode(response.body);
}

Future destroyAllData() async {
  await apiClientPost('/fortesting/internal/destroyalldata', {});
}

Future uploadMediaFile(String path) async {
  var pathBasename = basename(path);
  var presignedPost = await apiClientPost('/api/v1/requestFileUpload', {'filename': pathBasename});
  print(presignedPost);
  assert(false);
}

Future test1() async {
  await destroyAllData();
  var manifest = await getManifest();
  assert(manifest['mediaFiles'].length == 0);
  await uploadMediaFile('testdata/test.png');
}
