import 'package:shared_preferences/shared_preferences.dart';

Future<String> getServiceEndpoint() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getString('serviceEndpoint');
}

Future setServiceEndpoint(String value) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString('serviceEndpoint', value);
}

Future<String> getApiKey() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getString('apiKey');
}

Future setApiKey(String value) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString('apiKey', value);
}
