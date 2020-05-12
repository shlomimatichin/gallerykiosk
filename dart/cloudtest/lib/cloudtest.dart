
import 'dart:async';
import 'dart:convert';
import 'dart:io';
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
    throw Exception('Get ${url} failed: ${response.statusCode}');
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

Future test1() async {
  print(await getManifest());
}
